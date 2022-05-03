import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../entity/User";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { MyContext } from "../contexts/MyContext";
import { isAuth } from "../../src/middleware/isAuth";

@ObjectType()
class LoginResponse{
    @Field()
    accessToken: string
}


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
        return `Hello from protected! Your user id is ${payload?.userId}`
    }

    @Query(()=>[User])
    users(){
        return User.find()
    }

    @Mutation(()=>LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {res}: MyContext
    ): Promise<LoginResponse>{
        const user = await User.findOne({
            where:{
                email: email
            }
        })
        if(!user){
            throw new Error("User does not exist");
        }

        const isValid = await compare(password, user.password)

        if(!isValid){
            throw new Error("Password do not match!");
        }
        res.cookie("jid", sign({
            userId: user.id, email: user.email
        }, 'verySecret', {expiresIn: '7d'}), {httpOnly: true} )
        return {
            accessToken: sign({userId: user.id, email: user.email}, 'secret',{expiresIn: '15m'})
        }
    }

    @Mutation(()=> Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ){
        const user = await User.findOne({
            where:{
                email
            }
        })
        if(user){
            throw new Error('Email already Exists')
        }
        try {
            const hashedPassword = await hash(password, 12)
            await User.insert({
                email,
                password: hashedPassword
            })
            return true
        } catch (error) {
            return false
            
        }
    }
}