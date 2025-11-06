// types/express/index.d.ts
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      username: string;
      email: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}

// No export needed for declaration files