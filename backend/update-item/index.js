const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const itemId = event.pathParameters?.itemId;
    const userId = event.queryStringParameters?.userId || 'demo';
    const body = JSON.parse(event.body);

    if (!itemId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing itemId parameter' }),
      };
    }

    const { name, url, price, targetYears, expectedReturn } = body;

    // Calculate future value
    const fv =
      Number(price) * Math.pow(1 + Number(expectedReturn), Number(targetYears));

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        userId: userId,
        itemId: itemId,
      },
      UpdateExpression:
        'SET #name = :name, #url = :url, price = :price, targetYears = :targetYears, expectedReturn = :expectedReturn, fv = :fv',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#url': 'url',
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':url': url,
        ':price': Number(price),
        ':targetYears': Number(targetYears),
        ':expectedReturn': Number(expectedReturn),
        ':fv': fv,
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await ddb.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error('Error updating item:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};
