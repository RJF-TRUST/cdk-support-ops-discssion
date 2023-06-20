#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ecsCodeDeployStack } from './cdk-ecs-codedeploy-stack';

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }

const vpcIdSsmPath = "/cdk/vpc/cdk-ss-vpc/vpcId";
const clusterStackName = "cdk-so-ecs-code-deploy-stack";

const ecs_code_deploy_stack = new ecsCodeDeployStack(app, 'cdk-so-ecs-code-deploy-stack', {
  env: env,
  stackName: clusterStackName,
  vpcIdExportPath: vpcIdSsmPath,
});
cdk.Tags.of(ecs_code_deploy_stack).add('auto-delete', 'no');
cdk.Tags.of(ecs_code_deploy_stack).add('managedBy', 'cdk');
cdk.Tags.of(ecs_code_deploy_stack).add('environment', 'dev');
