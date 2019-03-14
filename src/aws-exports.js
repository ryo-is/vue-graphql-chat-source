// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile =  {
  "aws_project_region": "ap-northeast-1",
  "aws_cognito_identity_pool_id": "ap-northeast-1:f90d2720-e2d4-4c22-b164-a962cfdd805d",
  "aws_cognito_region": "ap-northeast-1",
  "aws_user_pools_id": "ap-northeast-1_3YzFmcfso",
  "aws_user_pools_web_client_id": "7aij1o8k4k9hkil4me8d6h311c",
  "aws_appsync_graphqlEndpoint": "https://prdqdmo57req3fhfvkdt6pyrxm.appsync-api.ap-northeast-1.amazonaws.com/graphql",
  "aws_appsync_region": "ap-northeast-1",
  "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
  "oauth": {
    "CognitoBaseURL": "https://vue-signin-oauth.auth.ap-northeast-1.amazoncognito.com",
    "CognitoAppClientID": "7aij1o8k4k9hkil4me8d6h311c",
    // "RedirectURI": "http://localhost:8080/auth",
    "RedirectURI": "https://chat.isryo.work/auth",
  },
};

if (process.env.NODE_ENV === "development") {
  awsmobile.oauth.RedirectURI = "http://localhost:8080/auth";
}


export default awsmobile;
