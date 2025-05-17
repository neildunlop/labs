console.log('DEPLOYED VERSION: ' + new Date().toISOString());
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const client = new DynamoDBClient();
const { unmarshall } = require('@aws-sdk/util-dynamodb');

exports.handler = async (event) => {
  try {
    const params = {
      TableName: process.env.TABLE_NAME
    };
    const result = await client.send(new ScanCommand(params));
    // Unmarshall items if needed
    const items = (result.Items || []).map(item => {
      const unmarshalled = unmarshall(item);
      if (unmarshalled.createdAt) {
        unmarshalled.created_at = unmarshalled.createdAt;
        delete unmarshalled.createdAt;
      }
      if (unmarshalled.updatedAt) {
        unmarshalled.updated_at = unmarshalled.updatedAt;
        delete unmarshalled.updatedAt;
      }
      return unmarshalled;
    });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 