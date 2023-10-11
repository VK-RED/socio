"use client";

import { trpc } from "@/utils/trpc";
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react";

//POST, COMMENT DETAILS
const IMG = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png";
const POST_ID = "ENTER A POST ID"
const CONTENT = "Let's Go for a Long Walk"

const COMMENT_ID = "ENTER A COMMENT ID";

export default function Home() {

  const{data :session, status} = useSession();

  const[enabled, setEnabled] = useState(false);

  //Test tRPC QUERIES : 
  
  const cmntMutation = trpc.comment.add.useMutation();

  const postQuery = trpc.post.get.useQuery({postId:POST_ID},{enabled,
    
    onSuccess(opts){
      console.log(opts);
    },
    onError(opts){
      console.log(opts);
    }

  });

  const dPost = trpc.post.delete.useMutation({
    onSuccess(opts){
      console.log(opts.message);
    }
  });

  const uCmnt = trpc.comment.update.useMutation({
    onSuccess(opts){
      console.log(opts);
    },
    onError(opts){
      console.log(opts);
    }
  })

  const cPost = trpc.post.create.useMutation({
    onSuccess(opts){
      console.log(opts);
    },
    onError(opts){
      console.log(opts);
    }
  })

  const dCmnt = trpc.comment.delete.useMutation({
    onSuccess(opts){
      console.log(opts);
    },
    onError(opts){
      console.log(opts);
    }
  });
  

  if(status === 'authenticated'){
    return(
      <div>
        You are authenticated to see this page
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
