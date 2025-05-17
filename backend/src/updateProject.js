const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const client = new DynamoDBClient();

function isValidProject(project) {
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
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ message: 'Missing project id' })
      };
    }
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
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: marshall({ id }),
      UpdateExpression: 'set #title = :title, #overview = :overview, #status = :status, #objectives = :objectives, #deliverables = :deliverables, #considerations = :considerations, #techStack = :techStack, #metadata = :metadata, #sections = :sections, #updated_at = :updated_at',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#overview': 'overview',
        '#status': 'status',
        '#objectives': 'objectives',
        '#deliverables': 'deliverables',
        '#considerations': 'considerations',
        '#techStack': 'techStack',
        '#metadata': 'metadata',
        '#sections': 'sections',
        '#updated_at': 'updated_at'
      },
      ExpressionAttributeValues: marshall({
        ':title': project.title,
        ':overview': project.overview,
        ':status': project.status,
        ':objectives': project.objectives,
        ':deliverables': project.deliverables,
        ':considerations': project.considerations,
        ':techStack': project.techStack,
        ':metadata': project.metadata,
        ':sections': project.sections,
        ':updated_at': timestamp
      }),
      ReturnValues: 'ALL_NEW'
    };
    const result = await client.send(new UpdateItemCommand(params));
    if (!result.Attributes) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ message: 'Project not found' })
      };
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(unmarshall(result.Attributes))
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