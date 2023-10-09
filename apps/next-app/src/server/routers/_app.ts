import { router } from '../trpc';
import { postRouter } from './post/route';

//This is the Main Router combining all the Routers
export const appRouter = router({
  post: postRouter,
  
});

// export type definition of API to the Frontend
export type AppRouter = typeof appRouter;