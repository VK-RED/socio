import { router } from '../trpc';
import { commentRouter } from './comment/route';
import { likeRouter } from './like/route';
import { postRouter } from './post/route';

//This is the Main Router combining all the Routers
export const appRouter = router({
  post: postRouter,
  comment: commentRouter,
  like: likeRouter,
});

// export type definition of API to the Frontend
export type AppRouter = typeof appRouter;