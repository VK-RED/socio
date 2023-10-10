import { TRPCError } from "@trpc/server";
import { middleware, procedure } from "./trpc";

//Auth Middleware

/*
    All the incoming reqs, will be captured by the middleware before hitting the protected routes
    Protected Routes will be called one and only if the user is SignedIn
*/

export const admin  = middleware(async (opts) => {
    const { ctx } = opts;

    if(!ctx.session?.user)
        throw new TRPCError({code : 'UNAUTHORIZED'});

    else{
        return opts.next({
            ctx:{
                prisma:opts.ctx.prisma,
                session:opts.ctx.session,
            }
        });
    }

  });


export const authProcedure = procedure.use(admin);