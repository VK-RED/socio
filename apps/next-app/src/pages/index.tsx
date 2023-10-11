"use client";

import { trpc } from "@/utils/trpc";
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react";

//DUMMY CREDENTIALS
const IMG = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png";
const POST_ID = "clnlij3wp000155u0d05za6bg"
const CONTENT = "Let's Go for a Long Walk"

const COMMENT_ID = "clnlikkpd000355u07jg6adkq";

export default function Home() {

  const{data :session, status} = useSession();
  const[enabled, setEnabled] = useState(false);

    //TEST TRPC QUERIES
  
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

  const likeOnPost = trpc.like.onPost.useMutation({
    onSuccess(opts){
      console.log(opts);
    },
    onError(opts){
      console.log(opts);
    },
  });

  const likeOnComment = trpc.like.onComment.useMutation({
    onSuccess(opts){
      console.log(opts);
    },
    onError(opts){
      console.log(opts);
    },
  })
  

  if(status === 'authenticated'){
    return(
      <div>
        You are authenticated to see this page
        
        <div className="m-40">
            <button  onClick={()=>cmntMutation.mutate({content:"This is my cmnt", postId:POST_ID})}>
              ADD A COMMENT TO THE POST
            </button>
            <br/>
            <button onClick={()=>uCmnt.mutate({commentId:COMMENT_ID, content:"His content"})}>UPDATE THE COMMENT</button>
            <br />
            <button onClick={()=>setEnabled(!enabled)}> GET THE POST</button>
            <br />
            <button onClick={()=>dPost.mutate({postId:POST_ID})}>DELETE THE POST</button>
            <br />
            <button onClick={()=>cPost.mutate({content:"MY POST", image:IMG})}>CREATE A POST</button>
            <br />
            <button onClick={()=>dCmnt.mutate({commentId:COMMENT_ID})}>DELETE A CMNT</button>
            <br />
            <button onClick={()=>likeOnPost.mutate({postId:POST_ID})}>LIKE/DISLIKE ON THE POST</button>
            <br />
            <button onClick={()=>likeOnComment.mutate({commentId:COMMENT_ID})}>LIKE/DISLIKE ON THE COMEMNT</button>

        </div>


        <div className="m-40">
            {postQuery.data?.post?.content}
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
