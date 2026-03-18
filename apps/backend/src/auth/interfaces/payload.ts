import { Role } from 'generated/prisma/client';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
