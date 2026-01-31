import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  PGDATA: z.string(),
  DATABASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
