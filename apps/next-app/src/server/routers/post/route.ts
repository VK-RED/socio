import { z } from 'zod';
import {procedure, router } from "../../trpc"

// This file contains the functions to CRUD a POST

export const postRouter = router({

    //create a post
    create: procedure

            .input(z.object({
                image: z.string(),
                content: z.string(),
            }))

            .mutation(async(opts)=>{


                if(!opts.ctx.session?.user) return {message: "You are not authenticated to do this operation"};

                const {image, content} = opts.input;

                if(opts.ctx.session.user.email){
                    
                    //check for the user in DB
                    const user = await opts.ctx.prisma.user.findUnique({
                        where:{
                            email: opts.ctx.session.user.email,
                        }
                    });

                    if(!user) return {message: "Cannot find any User, Kindly Please Check your email"};


                    const newPost = await opts.ctx.prisma.post.create({
                        data:{
                            image,
                            content: content || "",
                            authorId: user.id,
                        }
                    })
                    
                    return {message:"Post Created Successfully"};
                }

            }),

    //edit a Post
    update: procedure

            .input(z.object({
                content: z.string(),
                image: z.string(),
                postId: z.string(),
            }))

            .mutation(async (opts)=>{

                //If there is no user resend back
                if(!opts.ctx.session?.user) 
                    return {message: "You are not authenticated to do this operation"};

                const {image, content, postId} = opts.input;

                //TypeSafety Check
                if(opts.ctx.session.user.email){
            
                    const user = await opts.ctx.prisma.user.findUnique({
                        where:{
                            email: opts.ctx.session.user.email,
                        }
                    });

                    if(!user) 
                        return {message: "Cannot find any User, Kindly Please Check your email"};

                    const oldPost = await opts.ctx.prisma.post.findUnique({where:{id: postId}});

                    //Check if the post exists or not
                    if(!oldPost) 
                        return {message:"Please Enter the correct Post ID"}

                    //If the userId and Post's userId mismatches, return the error message
                    if(user.id !== oldPost.authorId) 
                        return {message:"You do not have permission to Update other person's post"}

                    const post = await opts.ctx.prisma.post.update({
                        where:{
                            id: opts.input.postId
                        },
                        data:{
                            content,
                            image,
                        }
                    })

                    return {message:"Post Updated Successfully"};

                }

            }),

    //delete a post
    delete: procedure
            .input(z.object({
                postId: z.string(),
            }))
            .mutation(async(opts)=>{

                //If there is no user resend back
                if(!opts.ctx.session?.user?.email) 
                    return {message: "You are not authenticated to do this operation"};

                const {postId} = opts.input;

                const oldPost = await opts.ctx.prisma.post.findUnique({where:{id:postId}});

                //Check if the post exists or not
                if(!oldPost) 
                    return {message:"Please Enter the correct Post ID"}
            
                //check if this user have the authorisation
                const user = await opts.ctx.prisma.user.findUnique({where:{
                    email: opts.ctx.session.user.email
                }})

                if(user?.id !== oldPost.authorId) 
                    return {message:"You do not have permission to Update other person's post"}

                //Delete the post from D.B
                await opts.ctx.prisma.post.delete({where:{id:postId}});

                return {message:"The Post has been successfully deleted"};
            }),

    //get the details of the POST
    get:    procedure
            .input(z.object({
                postId: z.string(),
            }))
            .query(async (opts)=>{
                const {postId} = opts.input;

                //If there is no user resend back
                if(!opts.ctx.session?.user?.email) 
                    return {message: "You are not authenticated to do this operation"};

                const post = await opts.ctx.prisma.post.findUnique({where:{id:postId}});

                if(!post)
                    return {message: "Please Enter the correct post Id"}

                else
                    return {id:postId, content: post.content || "NO CONTENT", image: post.image};
            })
})