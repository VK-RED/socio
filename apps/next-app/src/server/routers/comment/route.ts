import { admin } from "@/server/middleware";
import { procedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


//This file contains CRUD for Comments.


export const commentRouter = router({

    //Add a comment to a Post
    add : procedure
            .use(admin)
            .input(z.object({content:z.string(), postId: z.string()}))
            .mutation(async (opts)=>{
                
                const content = opts.input.content;
                const email = opts.ctx.session?.user?.email;
                const postId = opts.input.postId;

                /*
                    If the Post exists, add a new Comment else throw an ERROR
                */

                
                try {
                    const user = await opts.ctx.prisma.user.findFirst({where:{email}});
                    const post = await opts.ctx.prisma.post.findFirst({where:{id:postId}});

                    //TypeSafe check
                    if(user?.id && post?.id){

                        const newComment = await opts.ctx.prisma.comment.create({
                            data:{
                                content,
                                authorId: user.id,
                                postId: post.id,
                            }
                        })

                        return {message:"The Comment has been added successfully"};

                    }

                } catch (error) {
                    return new TRPCError({code:"BAD_REQUEST", message:"ENTER_VALID_POSTID"});
                }

            }),

    //UPDATE a COMMENT

    update:   procedure
                .use(admin)
                .input(z.object({content:z.string(), commentId: z.string()}))
                .mutation(async(opts)=>{

                    const content = opts.input.content;
                    const email = opts.ctx.session?.user?.email;
                    const commentId = opts.input.commentId;


                    //If commentID is valid and then update the comment

                    try {
                        const user = await opts.ctx.prisma.user.findFirst({where:{email}});
                        const comment = await opts.ctx.prisma.comment.findFirst({where:{id:commentId}});

                        //Throw ERROR when authorID mismatches
                        if(comment?.authorId !== user?.id){
                            throw new TRPCError({code:"FORBIDDEN"});
                        }
                        else{
                            
                            const updatedComment = await opts.ctx.prisma.comment.update({
                                where:{
                                    id:comment?.id,
                                },
                                data:{
                                    content,
                                }
                            })

    
                            return {message:"The Comment has been updated successfully !!!"};

                        }
    
                        
    
                    } catch (error) {
                        return new TRPCError({code:"BAD_REQUEST", message:"ENTER_VALID_COMMENTID"});
                    }


                }),

    // DELETE A COMMENT
    delete  :   procedure
                .use(admin)
                .input(z.object({commentId: z.string()}))
                .mutation(async (opts)=>{
                    const commentId = opts.input.commentId;
                    const email = opts.ctx.session?.user?.email;

                    try {
                        const comment = await opts.ctx.prisma.comment.findFirst({where:{id:commentId}});
                        const user = await opts.ctx.prisma.user.findFirst({where:{email}});

                        if(user?.id !== comment?.authorId)
                            throw new TRPCError({code:"FORBIDDEN"});
                        else{
                            await opts.ctx.prisma.comment.delete({where:{id:commentId}});
                            return {message:"The comment has been successfully deleted"}
                        }
                    } catch (error) {
                        
                    }
                    
                }),

    //Fetches all Comments of a User for a Post

    get :   procedure
            .use(admin)
            .input(z.object({postId:z.string()}))
            .query(async (opts)=>{
                const postId = opts.input.postId;
                const email = opts.ctx.session?.user?.email;

                //If the Post ID is invalid, then an ERROR is THROWN

                try {
                    
                    const user = await opts.ctx.prisma.user.findFirst({where:{email}});
                    const post = await opts.ctx.prisma.post.findFirst({where:{id:postId}});


                    const comments = await opts.ctx.prisma.comment.findMany({
                        where:{
                            authorId: user?.id,
                            postId,
                        }
                    })

                    return comments;

                } catch (error) {

                    throw new TRPCError({code:"BAD_REQUEST", message:"ENTER_A_VALID_POSTID"});
                }
                
            })
})