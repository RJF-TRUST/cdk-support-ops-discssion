# Welcome to your CDK TypeScript project

[![cdk](https://github.com/aws-k68pex/cdk-sample-ts-eks/actions/workflows/aws-cdk.yml/badge.svg)](https://github.com/aws-k68pex/cdk-sample-ts-eks/actions/workflows/aws-cdk.yml)

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


Outputs:
```
cdk-eks-stack.eksConfigCommandDB09280A = aws eks update-kubeconfig --name eksB49B8EA3-30b0ae68f0e64650b04b6e2a27312720 --region us-east-1 --role-arn arn:aws:iam::123510061335:role/cdk-eks-stack-mastersRole634808EE-16L4M8FS48N49
cdk-eks-stack.eksGetTokenCommand8952195F = aws eks get-token --cluster-name eksB49B8EA3-30b0ae68f0e64650b04b6e2a27312720 --region us-east-1 --role-arn arn:aws:iam::123510061335:role/cdk-eks-stack-mastersRole634808EE-16L4M8FS48N49
Stack ARN:
arn:aws:cloudformation:us-east-1:123510061335:stack/cdk-eks-stack/e0b5a720-be6c-11ed-a525-121de38a7e19
```
