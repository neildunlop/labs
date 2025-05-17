import {
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  resendSignUpCode as amplifyResendSignUp,
  resetPassword as amplifyForgotPassword,
  confirmResetPassword as amplifyForgotPasswordSubmit,
  fetchUserAttributes,
  fetchAuthSession,
} from '@aws-amplify/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from './types';
import { Amplify } from 'aws-amplify';

// Initialize Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_CLIENT_ID,
    },
  },
};

Amplify.configure(amplifyConfig);

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await signIn(email, password);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
    const { isSignedIn } = await amplifySignIn({
      username,
      password,
    });

    if (isSignedIn) {
      const cognitoUser = await amplifyGetCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      const groups = idToken?.payload?.['cognito:groups'] as string[] || [];
      const isAdmin = groups.includes('admin');

      return {
        id: 0,
        username: cognitoUser.username,
        email: cognitoUser.signInDetails?.loginId || '',
        sub: cognitoUser.userId,
        role: isAdmin ? 'admin' : 'user',
        is_active: true,
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
    const cognitoUser = await amplifyGetCurrentUser();
    if (!cognitoUser) {
      return null;
    }

    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    const groups = idToken?.payload?.['cognito:groups'] as string[] || [];
    const isAdmin = groups.includes('admin');

    return {
      id: 0,
      username: cognitoUser.username,
      email: cognitoUser.signInDetails?.loginId || '',
      sub: cognitoUser.userId,
      role: isAdmin ? 'admin' : 'user',
      is_active: true,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('User needs to be authenticated')) {
      return null;
    }
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