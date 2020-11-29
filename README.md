# Dewi's movie database CDK JavaScript project

This is the CDK deployment project for Dewi's movie database.

## Requirements
To run this project you will need to,
* Install the AWS cli tools (https://aws.amazon.com/cli/)
* Configure the AWS cli tools (This CDK is hard-coded to assume that it will be deployed to the eu-west-2 (London) region).:
```
aws configure
```
* Install Node. I am running Node 14.15.1, but I'm sure other version will work as well. (https://nodejs.org/en/)
* Install the AWS CDK Toolkit (I am running CDK 1.75.0, but I'm sure other versions will work)
```
npm install -g aws-cdk
```

## Deploying
Before this deployment can be made, you will need the lambda handler artifact. 
This artifact should be placed in the lib directory.

To deploy this stack to your default AWS configuration, you should run,
 ```
 cdk deploy
```
This CDK is hard-coded to assume that it will be deployed to the eu-west-2 (London) region.
If you are not able to (or do not wish to) deploy to this region, you should edit `moviedatabase-cdk-stack.js` appropriately.

After deploying, you will be given an api endpoint, you will need to provide this to the React application.

Other available commands:
* `cdk destroy`: Destroy the provisioned infrastructure 
* `cdk synth`: Emits the synthesized CloudFormation template
