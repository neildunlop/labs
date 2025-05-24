const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, UpdateUserPoolCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const cognitoClient = new CognitoIdentityProviderClient({});

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle custom resource request
  if (event.RequestType) {
    try {
      if (event.RequestType === 'Create' || event.RequestType === 'Update') {
        const params = {
          UserPoolId: event.ResourceProperties.UserPoolId,
          LambdaConfig: event.ResourceProperties.LambdaConfig
        };

        await cognitoClient.send(new UpdateUserPoolCommand(params));
        console.log('Updated User Pool with Lambda trigger');
      }

      // Send success response
      await sendCloudFormationResponse(event, 'SUCCESS');
      return;
    } catch (error) {
      console.error('Error updating User Pool:', error);
      await sendCloudFormationResponse(event, 'FAILED', error.message);
      throw error;
    }
  }

  // Handle Cognito trigger
  try {
    const { userName, request } = event;
    const { userAttributes } = request;

    // Create user in DynamoDB
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: uuidv4(),
        email: userAttributes.email,
        name: userAttributes.name || userAttributes.email.split('@')[0],
        role: 'user', // Default role for self-registered users
        status: 'active',
        cognito_username: userName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    await docClient.send(command);
    console.log('User created in DynamoDB:', userName);

    return event;
  } catch (error) {
    console.error('Error creating user in DynamoDB:', error);
    throw error;
  }
};

async function sendCloudFormationResponse(event, status, reason = '') {
  const responseBody = JSON.stringify({
    Status: status,
    Reason: reason,
    PhysicalResourceId: event.PhysicalResourceId || event.LogicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId
  });

  const responseUrl = event.ResponseURL;
  const response = await fetch(responseUrl, {
    method: 'PUT',
    body: responseBody,
    headers: {
      'Content-Type': '',
      'Content-Length': responseBody.length.toString()
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to send CloudFormation response: ${response.statusText}`);
  }
} 