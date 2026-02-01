import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  PGDATA: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_AT_EXPIRES: z.string(),
  JWT_RT_EXPIRES: z.string(),
});

export type Env = z.infer<typeof envSchema>;
