import { Request, Response } from "express";
import { Roles } from "src/entity/User";

export interface MyContext{
    req: Request,
    res: Response,
    payload? : {userId: string, email: string, role: Roles}
}