import { Role, Session } from 'generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        session: Session;
      };
    }
  }
}

export {};
