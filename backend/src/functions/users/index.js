const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  ScanCommand, 
  DeleteCommand,
  UpdateCommand 
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With,Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '600'
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    let response;
    
    switch (event.httpMethod) {
      case 'GET':
        if (event.pathParameters?.id) {
          response = await getUser(event.pathParameters.id);
        } else {
          response = await getAllUsers();
        }
        break;
        
      case 'POST':
        response = await createUser(JSON.parse(event.body));
        break;
        
      case 'PUT':
        response = await updateUser(event.pathParameters.id, JSON.parse(event.body));
        break;
        
      case 'DELETE':
        response = await deleteUser(event.pathParameters.id);
        break;
        
      default:
        throw new Error(`Unsupported method: ${event.httpMethod}`);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({
        message: error.message || 'Internal server error'
      })
    };
  }
};

async function getAllUsers() {
  const command = new ScanCommand({
    TableName: TABLE_NAME
  });
  
  const result = await docClient.send(command);
  return result.Items || [];
}

async function getUser(id) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  });
  
  const result = await docClient.send(command);
  if (!result.Item) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return result.Item;
}

async function createUser(user) {
  const id = uuidv4();
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      id,
      ...user,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });
  
  await docClient.send(command);
  return { id, ...user };
}

async function updateUser(id, updates) {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET #name = :name, email = :email, role = :role, #status = :status, metadata = :metadata, updated_at = :updated_at',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':name': updates.name,
      ':email': updates.email,
      ':role': updates.role,
      ':status': updates.status,
      ':metadata': updates.metadata,
      ':updated_at': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  });
  
  const result = await docClient.send(command);
  return result.Attributes;
}

async function deleteUser(id) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  });
  
  await docClient.send(command);
  return { message: 'User deleted successfully' };
} 