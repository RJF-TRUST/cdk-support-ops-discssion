#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ecsClusterStack } from './cdk-ecs-stack';


const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }

const vpcIdSsmPath = "/cdk/vpc/cdk-ss-vpc/vpcId";

const app = new cdk.App();

const ecs_patterns_stack = new ecsClusterStack(app, 'cdk-so-ecs-patterns-stack', {
  env: env,
  vpcIdExportPath: vpcIdSsmPath,
});

cdk.Tags.of(ecs_patterns_stack).add('auto-delete', 'no');
cdk.Tags.of(ecs_patterns_stack).add('managedBy', 'cdk');
cdk.Tags.of(ecs_patterns_stack).add('environment', 'dev');
