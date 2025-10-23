import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
  paymentsProvider: process.env.PAYMENTS_PROVIDER ?? 'stripe',
  storageBucket: process.env.MINIO_BUCKET ?? 'pariconnect-media'
};
