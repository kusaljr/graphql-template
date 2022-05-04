import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

import { MyContext } from "../contexts/MyContext";
import {  isAuth } from "../middleware/isAuth";


@Resolver()
export class UserResolvers{
    @Query(()=>String)
    hello(){
        return 'hi'
    }


    @Query(()=>String)
    @UseMiddleware(isAuth)
    protectedHello(
        @Ctx() {payload} : MyContext
    ){
        console.log(payload)
        return `Hello from protected! Your user id is ${payload?.userId}. Your role is ${payload?.role} & your email is ${payload?.email}`
    }
    


}