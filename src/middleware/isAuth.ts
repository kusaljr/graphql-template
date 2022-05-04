import { verify } from "jsonwebtoken";
import { Roles } from "../../src/entity/User";
import { MiddlewareFn } from "type-graphql"
import { MyContext } from "../contexts/MyContext"

export interface TokenPayload{
    userId: string
    role: Roles
    email: string
}

export const isAdminAuth: MiddlewareFn<MyContext> = ({context}, next)=>{
    const authorization = context.req.headers['authorization']

    if(!authorization){
        throw new Error("Unauthorized Access");
    }

    try {
        const token = authorization.split(" ")[1]
        const payload = verify(token, 'secret')
        context.payload = payload as TokenPayload
        if(context.payload.role != Roles.ADMIN){
            throw new Error("Unauthorized Access!!!")
        }
    } catch (error) {
        throw new Error("Invalid Token")
        
    }
    return next()
}

export const isAuth: MiddlewareFn<MyContext> = ({context}, next)=>{
    const authorization = context.req.headers['authorization']

    if(!authorization){
        throw new Error("Unauthorized Access");
    }

    try {
        const token = authorization.split(" ")[1]
        const payload = verify(token, 'secret')
        context.payload = payload as TokenPayload
    } catch (error) {
        throw new Error("Invalid Token")
        
    }
    return next()
}