import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../../src/entity/User";
import { Arg, Field, Mutation, ObjectType } from "type-graphql";

@ObjectType()
class LoginResponse{
    @Field()
    accessToken: string
}

export class AuthResolvers{
    @Mutation(()=>LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
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
        return {
            accessToken: sign({userId: user.id, email: user.email, role: user.role}, 'secret',{expiresIn: '15m'})
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