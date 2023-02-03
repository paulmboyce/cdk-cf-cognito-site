import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_s3_deployment as s3deployment,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfront_origins,
} from "aws-cdk-lib";

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "Bucket", {
      bucketName: "com-bragaboo-friday-bucket",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(bucket, {
          originAccessIdentity,
        }),
      },
    });

    new s3deployment.BucketDeployment(
      this,
      "BucketDeploymentWithInvalidation",
      {
        destinationBucket: bucket,
        sources: [s3deployment.Source.asset("../website")],
        distribution,
        distributionPaths: ["/*"],
      }
    );
    bucket.grantRead(originAccessIdentity);

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new CfnOutput(this, "domainName", { value: distribution.domainName });
  }
}
