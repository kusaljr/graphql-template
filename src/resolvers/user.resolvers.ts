import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { MyContext } from "../contexts/MyContext";
import { isAuth } from "../middleware/isAuth";
import { Upload } from "../../src/contexts/Upload";
import { createWriteStream } from "fs";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { AppDataSource } from "../../src/data-source";
import { Media } from "../../src/entity/Media";
import { User } from "../entity/User";

@Resolver()
export class UserResolvers {
    @Query(() => String)
    hello() {
        return 'hi'
    }


    @Query(() => String)
    @UseMiddleware(isAuth)
    protectedHello(
        @Ctx() { payload }: MyContext
    ) {
        console.log(payload)
        return `Hello from protected! Your user id is ${payload?.userId}. Your role is ${payload?.role} & your email is ${payload?.email}`
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async singleUpload(
        @Ctx() { payload }: MyContext,
        @Arg("file", () => GraphQLUpload)
        { createReadStream, filename }: FileUpload
    ): Promise<boolean> {
        const uploadDir = 'images';
        const fn = `${Date.now()}${filename}`
        const path = `${uploadDir}/${fn}`;
        return await new Promise(async (resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(path))
                .on('finish', async () => { 
                    const mediaRepository = AppDataSource.getRepository(Media)
                    const userRepository = AppDataSource.getRepository(User)

                    const media = await mediaRepository.create({
                        path: fn
                    }).save()
                    
                    const user = await userRepository.findOneOrFail({
                        where:{
                            email: payload?.email
                        },
                        relations: ['profile_pic']
                    })

                    user.profile_pic = media
                    await userRepository.save(user)
                    resolve(true) 
                })
                .on("error", () => reject(false))
        );

    }


    @Mutation(() => Boolean)
    async uploadProfilePicture(
        @Arg('picture', () => GraphQLUpload)
        {
            createReadStream,
            filename
        }: Upload): Promise<boolean> {
        return new Promise(async (resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(__dirname + `../../images/${filename}`))
                .on('finish', (item: any) => {
                    console.log(item)
                    resolve(true)
                })
                .on('error', () => reject(false))
        )
    }

}