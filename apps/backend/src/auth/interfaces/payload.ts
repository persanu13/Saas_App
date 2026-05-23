import { UserType } from 'generated/prisma/enums';

export interface JwtPayload {
  sub: number;
  email: string;
  type: UserType;
  iat?: number;
  exp?: number;
}
