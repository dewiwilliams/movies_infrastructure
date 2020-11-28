const path = require('path');
const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const apigateway = require('@aws-cdk/aws-apigateway');
const lambda = require('@aws-cdk/aws-lambda');
const dynamodb = require('@aws-cdk/aws-dynamodb');

class MoviedatabaseCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const dynamoTable = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'movieid', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const getAllHandler = new lambda.Function(this, 'getAll', {
      runtime: lambda.Runtime.GO_1_X,
      handler: 'main',
      code: lambda.Code.fromAsset(path.join(__dirname, 'main.zip')),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
      }
    });

    dynamoTable.grantReadWriteData(getAllHandler);

    const api = new apigateway.RestApi(this, 'itemsApi', {
      restApiName: 'Movie Service'
    });
    const items = api.root.addResource('movies');
    const getAllIntegration = new apigateway.LambdaIntegration(getAllHandler);
    items.addMethod('GET', getAllIntegration);
  }
}

module.exports = { MoviedatabaseCdkStack }
