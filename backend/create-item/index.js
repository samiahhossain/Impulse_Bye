const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const ddb = new AWS.DynamoDB.DocumentClient();

// Function to extract image from URL
async function extractImageFromUrl(url) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 5000,
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          // Simple regex to extract og:image
          const ogImageMatch = data.match(
            /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
          );
          const twitterImageMatch = data.match(
            /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i
          );

          let imageUrl = ogImageMatch?.[1] || twitterImageMatch?.[1] || null;

          // Make sure it's a full URL
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl =
              urlObj.origin + (imageUrl.startsWith('/') ? '' : '/') + imageUrl;
          }

          resolve(imageUrl);
        });
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.end();
    } catch (error) {
      resolve(null);
    }
  });
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const {
    userId,
    name,
    url,
    price,
    salesTaxRate = 14,
    targetYears = 5,
    expectedReturn = 0.07,
  } = body;
  const itemId = uuidv4();
  const createdAt = new Date().toISOString();
  const fv =
    Number(price) * Math.pow(1 + Number(expectedReturn), Number(targetYears));

  // Extract image from URL
  const imageUrl = await extractImageFromUrl(url);

  const item = {
    userId,
    itemId,
    name,
    url,
    imageUrl,
    price: Number(price),
    salesTaxRate: Number(salesTaxRate),
    targetYears,
    expectedReturn,
    fv,
    createdAt,
  };

  await ddb.put({ TableName: process.env.TABLE_NAME, Item: item }).promise();

  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  };
};
