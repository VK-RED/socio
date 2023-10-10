"use client";

import { trpc } from "@/utils/trpc";
import { signIn, useSession } from "next-auth/react"


const GOOGLE_LOGO = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png";
const POST_ID = "clnijocgn000455csw8l8een8"

export default function Home() {

  const{data :session, status} = useSession();
  // const res = trpc.post.getPost.useQuery({postId:POST_ID});

  
  const res1 = trpc.post.get.useQuery({postId:"12E3E213"});
  console.log(res1);

  if(status === 'authenticated'){
    return(
      <div>
        You are authenticated to see this page
          <div>
            {res1.data?.image}
          </div>
      </div>
    )
  }

  else if(status === 'loading') return <div>Loading  ....</div>

  else{
    return(
      <div>
        <button onClick={()=>signIn()} >Sign In</button>
      </div>
    )
  }


}
