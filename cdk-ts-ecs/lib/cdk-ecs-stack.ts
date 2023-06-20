import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from 'constructs';


export interface ecsProps extends cdk.StackProps {
  readonly vpcIdExportPath: string;
}

export class ecsStack extends cdk.Stack {

  public readonly cluster: ecs.ICluster;

  constructor(scope: Construct, id: string, props: ecsProps) {
    super(scope, id, props);

    const vpcId = ssm.StringParameter.valueFromLookup(this, props.vpcIdExportPath);

    const ssVpc = ec2.Vpc.fromLookup(this, 'cdk-ss-vpc',{
      vpcId: vpcId,
    })

    const cluster = new ecs.Cluster(this, "EcsCluster", { 
      vpc: ssVpc,
      containerInsights: true,
    });
    // create security group
    const securityGroupName = "ecsHostSg";
    const SecurityGroup = new ec2.SecurityGroup(this, 'securityGroupName', {
      vpc: ssVpc,
      allowAllOutbound: true,
      securityGroupName: securityGroupName,
    });
    SecurityGroup.addIngressRule(
      ec2.Peer.ipv4(ssVpc.vpcCidrBlock),
      ec2.Port.tcp(22),
      'allow SSH access from VPC cidr block',
    );

    const autoScalingGroup = cluster.addCapacity(
      "DefaultAutoScalingGroupCapacity",
      {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.MICRO,
        ),
        minCapacity: 1,
        desiredCapacity: 1,
        maxCapacity: 6,
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        spotPrice: "0.0136",
        spotInstanceDraining: true,
        keyName: "aws-ec2-737719307477-us-east-1-kp",
      }
    );
    autoScalingGroup.addSecurityGroup(SecurityGroup)
    autoScalingGroup.scaleOnCpuUtilization("KeepCpuHalfwayLoaded", {
      targetUtilizationPercent: 50,
    });

    //Create ECS Serivce - EC2 Type:
    const taskDefinition = new ecs.Ec2TaskDefinition(this, "Ec2TaskDefinition",{});

    const container = taskDefinition.addContainer("SampleContainer", {
      image:          ecs.ContainerImage.fromRegistry("nginx:1.25.1-alpine"),
      cpu:            128,
      memoryLimitMiB: 256,
      logging:        ecs.LogDrivers.awsLogs({ streamPrefix: "cdk-so-ecs" }),
    });
    container.addPortMappings({
        containerPort: 80,
    });

    const ecsService = new ecs.Ec2Service(this, "Ec2Service", {
        cluster,
        taskDefinition,
        desiredCount: 2,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, "LB", {
        vpc: ssVpc,
        internetFacing: true,
    });

    const listener = lb.addListener("Listener", { port: 80 });

    const targetGroup = listener.addTargets("ECS", {
        port: 80,
        targets: [ecsService],
    });
  }
}