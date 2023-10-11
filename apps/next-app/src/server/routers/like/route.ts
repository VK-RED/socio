import { admin } from "@/server/middleware";
import { procedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

//  Like can be done on a Post or a Comment

export const likeRouter = router({
    onPost : procedure
            .use(admin)
            .input(z.object({
                postId : z.string(),
            }))
            .mutation(async(opts)=>{

                /*
                    GENERAL TRIVIA : 
                        - Get the userId
                        - Check if a post/Comment is Valid
                        - Check if a like exist for a POST or COMMENT 
                            - If yes ,then remove
                            - else add it
                */

                const {postId} = opts.input;
                const email = opts.ctx.session?.user?.email;

                const user = await opts.ctx.prisma.user.findFirst({where:{email}});
                const userId = user?.id as string; 
                

                try {

                    const post = await opts.ctx.prisma.post.findUnique({where:{id:postId},include:{likes:true}});

                    if(!post) return new TRPCError({code:"BAD_REQUEST", message:"ENTER_VALID_POST_ID"});

                    //Only if the post is found, then all the below methods will be proceeded

                    let likeCount  = post.likes.length;
                    
                    const like = await opts.ctx.prisma.like.findFirst({where:{
                        postId,
                        authorId:userId,
                    }})

                    //Unliking a POST
                    if(like){
                        await opts.ctx.prisma.like.delete({where:{id:like.id}});
                        return {message:"Unliked the Post !!! ", likeCount : likeCount-1};
                    }
                    //Liking a POST
                    else{
                        const like = await opts.ctx.prisma.like.create({
                            data:{
                                authorId:userId,
                                postId,
                            }
                        });
                        
                        return {message:"Liked the Post !!! ", likeCount: likeCount+1};
                    }
                    
                } catch (error) {
                    console.log(error);
                    throw new TRPCError({code:"INTERNAL_SERVER_ERROR"});
                }
                
            }),

    onComment : procedure
                .use(admin)
                .input(z.object({commentId : z.string()}))
                .mutation(async (opts)=>{


                    const {commentId} = opts.input;
                    const email = opts.ctx.session?.user?.email;

                    const user = await opts.ctx.prisma.user.findFirst({where:{email}});
                    const userId = user?.id as string; 

                    

                    try {

                        const comment = await opts.ctx.prisma.comment.findFirst({where:{id:commentId},include:{likes:true}});
    
                        if(!comment) return new TRPCError({code:"BAD_REQUEST", message:"CHECK_COMMENT_ID"});
    
                        const likeCount = comment.likes.length;

                        const like = await opts.ctx.prisma.like.findFirst({where:{
                            commentId,
                            authorId:userId,
                        }})
    
                        
                        //Unliking a Comment
                        if(like){
                            await opts.ctx.prisma.like.delete({where:{id:like.id}});
                            return {message:"Unliked the Comment !!! ", likeCount:likeCount-1};
                        }
                        //Liking a Comment
                        else{
                            const like = await opts.ctx.prisma.like.create({
                                data:{
                                    authorId:userId,
                                    commentId,
                                }
                            });
                            
                            return {message:"Liked the Comment !!! ", likeCount: likeCount+1};
                        }
                        
                    } catch (error) {
                        console.log(error);
                        throw new TRPCError({code:"INTERNAL_SERVER_ERROR"});
                    }

                })
})