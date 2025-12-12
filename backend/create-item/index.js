const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { userId, name, url, price, salesTaxRate=14, targetYears=5, expectedReturn=0.07 } = body;
  const itemId = uuidv4();
  const createdAt = new Date().toISOString();
  const fv = Number(price) * Math.pow(1 + Number(expectedReturn), Number(targetYears));
  const item = { userId, itemId, name, url, price: Number(price), salesTaxRate: Number(salesTaxRate), targetYears, expectedReturn, fv, createdAt };

  await ddb.put({ TableName: process.env.TABLE_NAME, Item: item }).promise();

  return { statusCode: 201, headers: {'Content-Type':'application/json'}, body: JSON.stringify(item) };
};
