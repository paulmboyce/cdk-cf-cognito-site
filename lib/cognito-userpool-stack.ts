import {
  LambdaRestApi,
  CfnAuthorizer,
  LambdaIntegration,
  AuthorizationType,
} from "aws-cdk-lib/aws-apigateway";
import { AssetCode, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";

import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";

export class CognitoUserPoolApiGatewayStack extends Stack {
  constructor(app: App, id: string, props?: StackProps) {
    super(app, id, props);

    // NOTE: USe NodeJsFunction for auto build with ESBuild.
    // Else you need to repeat manual step npm run build

    // Function that returns 201 with "Hello world!"
    // const helloWorldFunctionOLD = new Function(this, "helloWorldFunction", {
    //   code: new AssetCode("lambda"),
    //   handler: "helloworld.handler",
    //   runtime: Runtime.NODEJS_12_X,
    // });

    const njsProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_12_X,
      entry: "lambda/helloworld.ts",
      functionName: "my-hello-world-fn",
      handler: "handler",
    };
    const helloWorldFunction = new NodejsFunction(
      this,
      "nodejs-fn-auto-esbuild",
      njsProps
    );
    // Rest API backed by the helloWorldFunction
    const helloWorldLambdaRestApi = new LambdaRestApi(
      this,
      "helloWorldLambdaRestApi",
      {
        restApiName: "Hello World API",
        handler: helloWorldFunction,
        proxy: false,
      }
    );

    // Use Existing Cognito User Pool
    const userPool = UserPool.fromUserPoolArn(
      this,
      "userPool-workshop-BuilderClass01",
      "arn:aws:cognito-idp:eu-west-1:369368976179:userpool/eu-west-1_ayYl6Et6f"
    );

    // Authorizer for the Hello World API that uses the
    // Cognito User pool to Authorize users.
    const authorizer = new CfnAuthorizer(this, "cfnAuth", {
      restApiId: helloWorldLambdaRestApi.restApiId,
      //  name: "HelloWorldAPIAuthorizer",
      name: "BuilderClass01-APIAuthorizer",
      type: "COGNITO_USER_POOLS",
      identitySource: "method.request.header.Authorization",
      providerArns: [userPool.userPoolArn],
    });

    // Hello Resource API for the REST API.
    const hello = helloWorldLambdaRestApi.root.addResource("HELLO");

    // GET method for the HELLO API resource. It uses Cognito for
    // authorization and the auathorizer defined above.
    hello.addMethod("GET", new LambdaIntegration(helloWorldFunction), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.ref,
      },
      // Set OAuth scope(s) needs for method access.
      // These scopees are defined n the Cognito UserPool Resource and Client App.
      authorizationScopes: ["helloworld/gethello", "openid"],
    });
  }
}
