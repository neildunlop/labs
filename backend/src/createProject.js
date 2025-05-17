const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const client = new DynamoDBClient();
//const { v4: uuidv4 } = require('uuid');
const {"v4": uuidv4} = require('uuid');

function isValidProject(project) {
  // Basic validation for required fields and types
  if (
    typeof project.title !== 'string' ||
    typeof project.overview !== 'string' ||
    !['active', 'draft', 'completed', 'archived'].includes(project.status) ||
    !Array.isArray(project.objectives) ||
    !Array.isArray(project.deliverables) ||
    !Array.isArray(project.considerations) ||
    typeof project.techStack !== 'object' ||
    typeof project.metadata !== 'object' ||
    typeof project.sections !== 'object'
  ) {
    return false;
  }
  // Metadata validation
  const meta = project.metadata;
  if (
    typeof meta.type !== 'string' ||
    typeof meta.estimatedTime !== 'string' ||
    typeof meta.teamSize !== 'object' ||
    !['beginner', 'intermediate', 'advanced'].includes(meta.difficulty) ||
    !Array.isArray(meta.tags)
  ) {
    return false;
  }
  return true;
}

exports.handler = async (event) => {
  try {
    const project = JSON.parse(event.body);
    if (!isValidProject(project)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ message: 'Invalid project object' })
      };
    }
    const timestamp = new Date().toISOString();
    const item = {
      id: uuidv4(),
      ...project,
      created_at: timestamp,
      updated_at: timestamp
    };
    delete item.createdAt;
    delete item.updatedAt;
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: marshall(item)
    };
    await client.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(item)
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