import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {

      if(opts.ctx.session?.user)
        return {greeting: `Hi ${opts.ctx.session.user}, you have been successfully Signed In`};

      else{
        return {
          greeting: `Hi user, you have not been Signed In, kindly please SignIn`,
        }
      }
      
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;