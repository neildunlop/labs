import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_CLIENT_ID,
      tokenProvider: {
        oauth: {
          scope: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
        },
      },
    },
  },
  API: {
    REST: {
      projects: {
        endpoint: import.meta.env.VITE_API_URL,
        region: import.meta.env.VITE_AWS_REGION,
      },
    },
  },
};

Amplify.configure(amplifyConfig); 