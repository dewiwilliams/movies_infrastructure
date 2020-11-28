#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { MoviedatabaseCdkStack } = require('../lib/moviedatabase-cdk-stack');

const app = new cdk.App();
new MoviedatabaseCdkStack(app, 'MoviedatabaseCdkStack');
