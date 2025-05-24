const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  ScanCommand, 
  DeleteCommand,
  UpdateCommand,
  QueryCommand
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With,Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '600'
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Headers:', JSON.stringify(event.headers, null, 2));

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    console.log('Origin:', event.headers.origin);
    console.log('Access-Control-Request-Method:', event.headers['Access-Control-Request-Method']);
    console.log('Access-Control-Request-Headers:', event.headers['Access-Control-Request-Headers']);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        if (event.pathParameters && event.pathParameters.id) {
          return await getProject(event.pathParameters.id);
        }
        return await getProjects();
      case 'POST':
        return await createProject(JSON.parse(event.body));
      case 'PUT':
        return await updateProject(event.pathParameters.id, JSON.parse(event.body));
      case 'DELETE':
        return await deleteProject(event.pathParameters.id);
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Unsupported method' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

async function getProjects() {
  const params = {
    TableName: TABLE_NAME,
    IndexName: 'StatusIndex',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': 'active'
    }
  };

  const result = await docClient.send(new QueryCommand(params));
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.Items)
  };
}

async function getProject(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  };

  const result = await docClient.send(new GetCommand(params));
  if (!result.Item) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Project not found' })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.Item)
  };
}

async function createProject(project) {
  const id = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id,
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active'
    }
  };

  await docClient.send(new PutCommand(params));
  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify(params.Item)
  };
}

async function updateProject(id, updates) {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET #name = :name, description = :description, status = :status, metadata = :metadata, updated_at = :updated_at',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': updates.name,
      ':description': updates.description,
      ':status': updates.status,
      ':metadata': updates.metadata,
      ':updated_at': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };

  const result = await docClient.send(new UpdateCommand(params));
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.Attributes)
  };
}

async function deleteProject(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  };

  await docClient.send(new DeleteCommand(params));
  return {
    statusCode: 204,
    headers: corsHeaders,
    body: ''
  };
} 