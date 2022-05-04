import { User } from "../../src/entity/User"
import { Query, UseMiddleware } from "type-graphql"
import { isAdminAuth } from "../../src/middleware/isAuth"

export class AdminResolvers{
    
    @Query(()=>[User])
    @UseMiddleware(isAdminAuth)
    async returnAllUser(){
        const data = await User.find()
        return data
    }
}