import { Stack, StackProps, CfnOutput, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class CognitoUserPoolUIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const userPool = new cognito.UserPool(this, "myuserpool", {
    //   userPoolName: "myawesomeapp-userpool",
    // });

    const userPool = new cognito.UserPool(this, "myuserpool", {
      userPoolName: "myawesomeapp-userpool",
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      email: cognito.UserPoolEmail.withCognito("support@myawesomeapp.com"),
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
    });

    const clientWriteAttributes = new cognito.ClientAttributes().withStandardAttributes(
      { email: true }
    );

    const clientReadAttributes = clientWriteAttributes.withStandardAttributes({
      emailVerified: true,
    });

    const client = userPool.addClient("app-client", {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: ["https://d1gjurpo59wtr9.cloudfront.net/welcome.html"],
        logoutUrls: ["https://d1gjurpo59wtr9.cloudfront.net/signup.html"],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      accessTokenValidity: Duration.minutes(5),
      idTokenValidity: Duration.minutes(5),
      refreshTokenValidity: Duration.days(30),

      readAttributes: clientReadAttributes,
      writeAttributes: clientWriteAttributes,
    });
    const clientId = client.userPoolClientId;

    const cognitoDomain = userPool.addDomain("CognitoDomain", {
      cognitoDomain: {
        domainPrefix: "my-awesome-app-bxr18t8t",
      },
    });

    const signInUrl = cognitoDomain.signInUrl(client, {
      redirectUri: "https://d1gjurpo59wtr9.cloudfront.net/welcome.html", // must be a URL configured under 'callbackUrls' with the client
    });

    new CfnOutput(this, "Userpool: ARN", {
      value: userPool.userPoolArn,
    });
    new CfnOutput(this, "Userpool: id", {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, "Userpool Client App: id", {
      value: clientId,
    });
    new CfnOutput(this, "Userpool Signin Url", {
      value: signInUrl,
    });
  }
}
