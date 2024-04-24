import DeployButton from "../components/DeployButton"
import AuthButton from "../components/AuthButton"
import { createClient } from "@/utils/supabase/server"

export default async function Index() {
  return (
    <div>
      <h1>Hello There</h1>
      <AuthButton />
    </div>
  )
}
