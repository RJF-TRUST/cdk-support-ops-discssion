import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export interface ecsStackProps extends cdk.StackProps {
  readonly vpcIdExportPath: string;
}

export class ecsClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ecsStackProps) {
    super(scope, id, props);

    const vpcId = ssm.StringParameter.valueFromLookup(this, props.vpcIdExportPath);

    const ssVpc = ec2.Vpc.fromLookup(this, 'cdk-ss-vpc',{
      vpcId: vpcId,
    })

    // 👇 create a new ecs cluster 👇
    const cluster = new ecs.Cluster(this, 'ecsCluster', {
      vpc: ssVpc,
      containerInsights: true,
    });
    // 👇 create a new ecs pattern with an alb 👇
    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService (this, 'ecsPattern', {
      cluster: cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      publicLoadBalancer: true,
      taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      enableExecuteCommand: true,
      });

    // 👇 auto scale task count 👇
    const scalableTarget = loadBalancedFargateService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 6,
      });
      // 👇 auto scale cpu trigger 👇
      scalableTarget.scaleOnCpuUtilization('CpuScaling', {
          targetUtilizationPercent: 50,
      });
      // 👇 auto scale memory trigger 👇
      scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
          targetUtilizationPercent: 50,
      });
      // 👇 load balancer health check 👇
      loadBalancedFargateService.targetGroup.configureHealthCheck({
          path: "/",
      });
  }
}

export interface ecsClusterStackProps extends cdk.StackProps {
  readonly ecs: ecs.Cluster;
}
