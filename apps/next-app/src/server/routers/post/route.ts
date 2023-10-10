import { z } from 'zod';
import {procedure, router } from "../../trpc"
import { admin } from '@/server/middleware';
import { TRPCError } from '@trpc/server';

// This file contains the functions to CRUD a POST . 
// All the routes are protected using admin MIDDLEWARE


export const postRouter = router({

    //create a post
    create: procedure
            .use(admin)
            .input(z.object({
                image: z.string(),
                content: z.string(),
            }))
            .mutation(async(opts)=>{

                const {image, content} = opts.input;
                const email = opts.ctx.session?.user?.email;

                //Find if the user Exists in DB Else throw ERROR
                //Create a new Post and return the new Message

                try {
                    const user = await opts.ctx.prisma.user.findFirst({
                        where:{
                            email,
                        }
                    });

                    if(!user) throw new TRPCError({code:"FORBIDDEN"});

                    const newPost = await opts.ctx.prisma.post.create({
                        data:{
                            image,
                            content: content,
                            authorId: user.id,
                        }
                    })

                    return {message:"Post created Successfully"};

                } catch (error) {
                    throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
                }

            }),

    //edit a Post
    update: procedure

            .use(admin)
            .input(z.object({
                content: z.string(),
                image: z.string(),
                postId: z.string(),
            }))
            .mutation(async (opts)=>{

                const {image, content, postId} = opts.input;
                const email = opts.ctx.session?.user?.email;

                //Update the Post one and only if userId === post.authorId

                try {
                    const post = await opts.ctx.prisma.post.findUnique({where:{id:postId}});
                    const user = await opts.ctx.prisma.user.findFirst({where:{
                        email
                    }});

                    if(post?.authorId !== user?.id)
                        throw new TRPCError({code:"FORBIDDEN"});

                    else{
                        const newPost = await opts.ctx.prisma.post.update({
                            where:{
                                id:postId,
                            },
                            data:{
                                content,
                                image,
                            }

                        });

                        return {message:"The Post has been updated successfully"};
                    }
                } catch (error) {
                    throw new TRPCError({code:"BAD_REQUEST", cause:"INVALID_POSTID"});
                }


            }),

    //delete a post
    delete: procedure
            .use(admin)
            .input(z.object({
                postId: z.string(),
            }))
            .mutation(async(opts)=>{

                
                const {postId} = opts.input;
                const email = opts.ctx.session?.user?.email;

                //If the post exists and the client is the original author, delete the post
                //Else throw appropriate errors to the client

                try {
                    const post = await opts.ctx.prisma.post.findUnique({where:{id:postId}});
                    const user = await opts.ctx.prisma.user.findFirst({where:{
                        email
                    }});

                    //Delete only if the userId matches with post's authorId
                    if(post?.authorId === user?.id){
                        await opts.ctx.prisma.post.delete({where:{id:postId}});
                        return {message:"The Post has been deleted successfully"};
                    }
                        
                    else
                        throw new TRPCError({code:"FORBIDDEN"});

                } catch (error) {
                    throw new TRPCError({code:"BAD_REQUEST", cause:"INVALID_POSTID"});
                }

            }),

    //get the details of the POST
    get:    procedure
            .use(admin)
            .input(z.object({
                postId: z.string(),
            }))
            .query(async (opts)=>{
                const {postId} = opts.input;
                const email = opts.ctx.session?.user?.email ;

                //Only if the post's author matches with the original author, return the post
                //Else throw appropriate errors to the client

                try {
                    const post = await opts.ctx.prisma.post.findUnique({where:{id:postId}});
                    const user = await opts.ctx.prisma.user.findFirst({where:{email}});

                    if(post?.authorId === user?.id)
                        return post;
                    else
                        throw new TRPCError ({code:"FORBIDDEN"});

                } catch (error) {
                    throw new TRPCError({code:"BAD_REQUEST", cause:"INVALID_POST_ID"});
                }
                
            }),

})