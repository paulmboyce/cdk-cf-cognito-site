import { Stack, StackProps, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_s3_deployment as s3deployment,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfront_origins,
  aws_iam as iam,
} from "aws-cdk-lib";

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "Bucket", {
      bucketName: "com-bragaboo-friday-bucket",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

      // DEV: Allow bucket removal when Destroy Stack
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
    });

    const originAccessId = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(bucket, {
          originAccessIdentity: originAccessId,
        }),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
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
    //    bucket.grantRead(originAccessId);
    // Grant access to cloudfront
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            originAccessId.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    new CfnOutput(this, "Bucket ARN", {
      value: bucket.bucketArn,
    });

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new CfnOutput(this, "domainName", { value: distribution.domainName });
  }
}
