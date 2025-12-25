interface Config {
  port: number;
  nodeEnv: string;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  api: {
    prefix: string;
    version: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration (if needed)
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'movila',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || ''
  },

  // API configuration
  api: {
    prefix: '/api',
    version: 'v1'
  }
};

export default config;
