import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

//import {Bucket, BucketAccessControl} from "@aws-cdk/aws-s3";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new cdk.aws_s3.Bucket(this, "Bucket", {
      accessControl: cdk.aws_s3.BucketAccessControl.PRIVATE,
    });

    //import {BucketDeployment, Source} from "@aws-cdk/aws-s3-deployment";

    new cdk.aws_s3_deployment.BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      sources: [cdk.aws_s3_deployment.Source.asset("../website")],
    });

    //import {Distribution, OriginAccessIdentity} from "@aws-cdk/aws-cloudfront";
    //import {S3Origin} from "@aws-cdk/aws-cloudfront-origins";

    const originAccessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    bucket.grantRead(originAccessIdentity);

    new cdk.aws_cloudfront.Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(bucket, {
          originAccessIdentity,
        }),
      },
    });
  }
}
