#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ecsStack } from './cdk-ecs-stack';

const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }

const vpcIdSsmPath = "/cdk/vpc/cdk-ss-vpc/vpcId";
const clusterStackName = "cdk-so-ecs-stack";

const app = new cdk.App();

const ecs_stack = new ecsStack(app, 'cdk-so-ecs-stack', {
  env: env,
  stackName: clusterStackName,
  vpcIdExportPath: vpcIdSsmPath,
});

cdk.Tags.of(ecs_stack).add('auto-delete', 'no');
cdk.Tags.of(ecs_stack).add('managedBy', 'cdk');
cdk.Tags.of(ecs_stack).add('environment', 'dev');
