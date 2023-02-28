# Hosted UI Uri:

## AUTH:

https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=code&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Flocalhost

https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=code&scope=helloworld%2Fgethello+openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Flocalhost


https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=code&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Foauth.pstmn.io/v1/browser-callback


https://oauth.pstmn.io/v1/browser-callback

## SIGNIN (code):

https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/login?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=code&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Flocalhost

## SIGNIN (token):

https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/login?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=token&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Flocalhost

### Response with Token:
https://localhost/#id_token=eyJraWQiO--blablabla---ha73g
&access_token=eyJr----blablabla----4_nMdskPqSQ
&expires_in=3600
&token_type=Bearer


# Open ID Config:

Lets explore the published configuration and it’s format. This configuration follows a convention

https://cognito-idp.{region}.amazonaws.com/{userpoolid}/.well-known/openid-configuration

https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_ayYl6Et6f/.well-known/openid-configuration
