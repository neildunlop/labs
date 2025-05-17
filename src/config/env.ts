// Environment variables
const env = {
  AWS_REGION: import.meta.env.VITE_AWS_REGION,
  USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  API_URL: import.meta.env.VITE_API_URL,
};

// Validate environment variables
const requiredEnvVars = ['AWS_REGION', 'USER_POOL_ID', 'CLIENT_ID', 'API_URL'] as const;
const missingEnvVars = requiredEnvVars.filter(key => !env[key]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Log environment variables (without sensitive values)
console.log('Environment variables loaded:', {
  AWS_REGION: env.AWS_REGION,
  USER_POOL_ID: env.USER_POOL_ID ? 'exists' : 'missing',
  CLIENT_ID: env.CLIENT_ID ? 'exists' : 'missing',
  API_URL: env.API_URL ? 'exists' : 'missing',
});

export default env; 