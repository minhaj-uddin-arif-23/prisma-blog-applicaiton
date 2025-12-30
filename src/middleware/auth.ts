import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
// declare user type
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

// middleware ->

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get user session

    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
 

    // console.log(getSession);
    // check session and verified
    if (!session?.user) {
     return res.status(403).json({
        success: false,
        message: "you are not authorized",
      });
    }
    if (!session?.user?.emailVerified) {
     return res.status(403).json({
        success: false,
        message: "your email not verified",
      });
    }
    req.user = {
      id: session?.user.id as string,
      email: session?.user.email as string,
      name: session?.user.name as string,
      role: session?.user.role as string,
      emailVerified: session?.user.emailVerified as boolean,
    };
       console.log("SESSION ROLE:", session.user.role);
console.log("ALLOWED ROLES:", roles);
    if (roles.length && !roles.includes(req.user?.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
};
export default authMiddleware