import { initTRPC } from '@trpc/server';
import type { Context } from './context';

//Initialize trpc with the context
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;