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
      accessControl: s3.BucketAccessControl.PRIVATE,
    });

    new s3deployment.BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      sources: [s3deployment.Source.asset("../website")],
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    bucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(bucket, {
          originAccessIdentity,
        }),
      },
    });

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new CfnOutput(this, "Site:distributionDomainName", {
      value: distribution.distributionDomainName,
    });
    new CfnOutput(this, "Site:domainName", { value: distribution.domainName });
  }
}
