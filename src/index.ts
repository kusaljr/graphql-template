import "reflect-metadata";
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from 'type-graphql';
import { UserResolvers } from './resolvers/user.resolvers';
import { AppDataSource } from "./data-source";
import { AdminResolvers } from "./resolvers/admin.resolvers";
import { AuthResolvers } from "./resolvers/auth.resolvers";

(async ()=>{
    const app = express()

    app.get('/', (_req,res)=>{
        res.send('hello')
    })

    await AppDataSource.initialize()

    const apolloSever = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolvers, AdminResolvers, AuthResolvers]
        }),
        context: ({req,res})=>({req,res})
    })

    await apolloSever.start()

    apolloSever.applyMiddleware({app})

    app.listen(4000, ()=>{
        console.log('Server started at port 4000!')
    })

})();
