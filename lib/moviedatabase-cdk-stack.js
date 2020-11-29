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
      partitionKey: { name: 'MovieID', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const lambdaHandler = {
      runtime: lambda.Runtime.GO_1_X,
      handler: 'main',
      code: lambda.Code.fromAsset(path.join(__dirname, 'main.zip')),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        TABLE_REGION: "eu-west-2"
      }
    };
    const getAllHandler = new lambda.Function(this, 'getAll', lambdaHandler);
    const getOneHandler = new lambda.Function(this, 'getOne', lambdaHandler);

    dynamoTable.grantReadWriteData(getAllHandler);
    dynamoTable.grantReadWriteData(getOneHandler);

    const api = new apigateway.RestApi(this, 'itemsApi', {
      restApiName: 'Movie Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      }
    });

    const items = api.root.addResource('movies');
    const getAllIntegration = new apigateway.LambdaIntegration(getAllHandler);
    items.addMethod('GET', getAllIntegration);
    items.addMethod('POST', getAllIntegration);

    const singleItem = items.addResource('{id}');
    const getOneIntegration = new apigateway.LambdaIntegration(getOneHandler);
    singleItem.addMethod('GET', getOneIntegration);
    singleItem.addMethod('PUT', getOneIntegration);
    //TODO: Add DELETE method and implementation
  }
}

module.exports = { MoviedatabaseCdkStack }
