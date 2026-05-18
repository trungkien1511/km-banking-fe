import { z } from 'zod';
import { loginSchema } from '@/features/auth/schemas/login-schema';

export type LoginFormData = z.infer<typeof loginSchema>;
