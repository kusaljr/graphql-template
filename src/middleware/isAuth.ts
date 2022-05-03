import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql"
import { MyContext } from "../contexts/MyContext"

export const isAuth: MiddlewareFn<MyContext> = ({context}, next)=>{
    const authorization = context.req.headers['authorization']

    if(!authorization){
        throw new Error("Unauthorized Access");
    }

    try {
        const token = authorization.split(" ")[1]
        const payload = verify(token, 'secret')
        context.payload = payload as any
    } catch (error) {
        throw new Error("Invalid Token")
        
    }
    return next()
}