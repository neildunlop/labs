import {
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  resendSignUpCode as amplifyResendSignUp,
  resetPassword as amplifyForgotPassword,
  confirmResetPassword as amplifyForgotPasswordSubmit,
} from '@aws-amplify/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';

export interface AuthUser {
  username: string;
  email: string;
  sub: string;
}

const checkConfig = () => {
  const userPoolId = import.meta.env.VITE_USER_POOL_ID;
  const clientId = import.meta.env.VITE_CLIENT_ID;
  
  if (!userPoolId || !clientId) {
    throw new Error('Auth configuration is missing. Please check your .env file.');
  }
};

export const signUp = async (username: string, email: string, password: string): Promise<void> => {
  try {
    checkConfig();
    await amplifySignUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const confirmSignUp = async (username: string, code: string): Promise<void> => {
  try {
    checkConfig();
    await amplifyConfirmSignUp({
      username,
      confirmationCode: code,
    });
  } catch (error) {
    console.error('Error confirming sign up:', error);
    throw error;
  }
};

export const signIn = async (username: string, password: string): Promise<AuthUser> => {
  try {
    checkConfig();
    const { isSignedIn, nextStep } = await amplifySignIn({
      username,
      password,
    });

    if (isSignedIn) {
      const user = await amplifyGetCurrentUser();
      return {
        username: user.username,
        email: user.signInDetails?.loginId || '',
        sub: user.userId,
      };
    }
    throw new Error('Sign in failed');
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    checkConfig();
    await amplifySignOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    checkConfig();
    const user = await amplifyGetCurrentUser();
    if (!user) {
      return null;
    }
    return {
      username: user.username,
      email: user.signInDetails?.loginId || '',
      sub: user.userId,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

export const resendConfirmationCode = async (username: string): Promise<void> => {
  try {
    checkConfig();
    await amplifyResendSignUp({
      username,
    });
  } catch (error) {
    console.error('Error resending confirmation code:', error);
    throw error;
  }
};

export const forgotPassword = async (username: string): Promise<void> => {
  try {
    checkConfig();
    await amplifyForgotPassword({
      username,
    });
  } catch (error) {
    console.error('Error initiating forgot password:', error);
    throw error;
  }
};

export const confirmForgotPassword = async (
  username: string,
  code: string,
  newPassword: string
): Promise<void> => {
  try {
    checkConfig();
    await amplifyForgotPasswordSubmit({
      username,
      confirmationCode: code,
      newPassword,
    });
  } catch (error) {
    console.error('Error confirming forgot password:', error);
    throw error;
  }
}; 