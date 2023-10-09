import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/pages/api/auth/[...nextauth]';

//This context will be mounted on the serving adapter
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getServerSession(opts.req, opts.res, authOptions);

  if(!session?.user)
    return{
        prisma,
    }

  return {
    prisma,
    session,
  };
}
 
export type Context = inferAsyncReturnType<typeof createContext>;