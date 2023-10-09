
import { signIn, useSession } from "next-auth/react"

export default function Home() {

  const{data :session, status} = useSession();

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
