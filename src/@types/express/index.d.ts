import { IUser } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        companyId?: string;
      };
    }
  }
}

export {}; 