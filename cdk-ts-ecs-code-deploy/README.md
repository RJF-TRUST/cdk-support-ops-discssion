# Tutorial: Deploy an Amazon ECS service

![image](https://github.com/aws-k68pex/code-training-ecs-deploy/assets/29943707/2be8f07e-edd5-421d-b6e7-5b056caad6f0)


![image](https://github.com/aws-k68pex/code-training-ecs-deploy/assets/29943707/15ce2080-ea15-4df8-a653-2c9d7aefea3d)

## Procedure steps:
1. Create a new revision of Task Definition, for example, change the `amazon-sample` image to `nginx` image.
2. Update the new Task Def Arn in `appspec.yaml` and upload it to the S3 bucket.
3. Go to **CodeDeploy**, and open **Application**, Create a deployment under **Deployments** Tab.
4. Select the following:
- Revision location: `s3://cdk-so-ecs-code-deploy-stack-bucket83908e77-18v7w07818ruk/appspec.yml`
- Revision file type: `yaml`
