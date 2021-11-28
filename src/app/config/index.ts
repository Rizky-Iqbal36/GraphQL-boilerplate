
import * as dotenv from 'dotenv';
import {join} from 'path';
dotenv.config();
const pjson = require(join(process.cwd(), 'package.json'));

const validNodeEnv = ['development', 'test', 'production'];
const appConfig = {
  app: {
    name: pjson.name,
    version: pjson.version,
    env: validNodeEnv.includes(process.env.NODE_ENV) ?
      process.env.NODE_ENV :
      'development',
    port: parseInt(process.env.PORT) || 3000,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    ecryptJwtSecret: process.env.ENCRYPT_JWT_SECRET,
    jwtIssuer: process.env.JWT_ISSUER,
  },
};

export default appConfig;
