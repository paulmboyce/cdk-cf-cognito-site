# AUTHORIZE:

###( redirect_uri -> localhost)
https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=code&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Flocalhost

https:/localhost

###( redirect_uri -> Postman)
https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=code&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Foauth.pstmn.io/v1/browser-callback

https://oauth.pstmn.io/v1/browser-callback

## Response with Code:

https://localhost/?code=016aa19d-a2bc-44cc-9e5d-2181c7ae416b

If logged in will respond directly with code={some code}, else redirects to /login.

# LOGIN (Code Authentication Flow):

https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/login?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=code&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Flocalhost

## Response with Code:

https://localhost/?code=016aa19d-a2bc-44cc-9e5d-2181c7ae416b

# SIGNIN (Implicit "token" Authentication Flow):

https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/login?client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&response_type=token&scope=openid+petstore%2Fread+profile&redirect_uri=https%3A%2F%2Flocalhost

## Response with Token:

https://localhost/#id_token=eyJraWQiO--blablabla---ha73g
&access_token=eyJr----blablabla----4_nMdskPqSQ
&expires_in=3600
&token_type=Bearer

# Exchange CODE for id_token / access code

## IF you have a client_secret, pass Base64 Auth header

Base64Encode(client_id:client_secret) using the Base64-encoded version of the string.
Authorization: Basic Base64Encode(client_id:client_secret)

E.G.
Authorization: Basic ZGpjOTh1M2ppZWRtaTI4M2V1OTI4OmFiY2RlZjAx

SEE: https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
-H "Authorization: Basic base-64-encoded-only-if-have-cient-secret"\

curl -d "client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&\
redirect_uri=https://localhost&\
grant_type=authorization_code&\
code=016aa19d-a2bc-44cc-9e5d-2181c7ae416b"\
 -X POST https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/token

curl -d "client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&\
redirect_uri=https%3A%2F%2Flocalhost&\
grant_type=authorization_code&\
code=2c2363f3-7cd9-4a93-9f1f-34756abe2ace&\
client_secret=" https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/token

curl -d "client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&\
redirect_uri=https%3A%2F%2Flocalhost&\
grant_type=authorization_code&\
code=21c48718-6aea-44eb-a298-5eaf2808b7f1&\
client_secret=" https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/token

## This works (using localhost):

curl -d "grant_type=authorization_code&code=e3b30b0f-0386-47dd-8cd7-31288379902d&redirect_uri=https%3A%2F%2Flocalhost&client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&client_secret=" https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/token

### NOTES:

1. redirect*uri is not used in the token request for
   return a value, but \_MUST* be same as was used to receive the CODE.
2. Authorization Header an only be used if you have a client_secret
3. If no client_secret, then pass as empty (or do not include, because its optional as its empty)

## This works (using Postman endpoint):

```
curl -d
"grant_type=authorization_code&code=>>>CODE<<<&redirect_uri=https%3A%2F%2Foauth.pstmn.io%2Fv1%2Fbrowser-callback&client_id=3vbuqdb4pbvid3l4ve9o4dvn1a&client_secret="
https://bragaboo-auth-01.auth.eu-west-1.amazoncognito.com/oauth2/token
```

### NOTE: Can only exchange the CODE one time. Subsequent calls return:

```json
{ "error": "invalid_grant" }
```

# Open ID Config:

Lets explore the published configuration and it’s format. This configuration follows a convention

https://cognito-idp.{region}.amazonaws.com/{userpoolid}/.well-known/openid-configuration

https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_ayYl6Et6f/.well-known/openid-configuration
