import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as fs from "fs"
import { RelationshipType } from "./common.types"
import path from "path"

dotenv.config({ path: ".env.local" })
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function fetchRelationshipTypes() {
  if (supabaseUrl === undefined) {
    console.error("Supabase url is not defined")
    return
  }
  if (supabaseKey === undefined) {
    console.error("Supabase key is not defined")
    return
  }
  const client = createClient(supabaseUrl, supabaseKey)
  const fetch = async () => {
    const res = await client.from("relationship_types").select()
    if (res.error) {
      throw res.error
    }
    if (res.data.length < 1) {
      throw new Error("could not fetch relationship types")
    }
    return res.data as RelationshipType[]
  }
  const rts = await fetch()
  return rts
}

function mapTypes(rts: RelationshipType[] | undefined) {
  if (rts === undefined) {
    throw Error("could not fet relationship type")
  }
  const byId: Record<number, RelationshipType> = {}
  rts.forEach((r) => {
    byId[r.id] = r
  })
  return byId
}

function writeToFile(rtMap: Record<number, RelationshipType>) {
  const filePath = path.join(".", "app", "types", "RelationshipTypes.ts")
  const fileContent = `
  import { RelationshipType } from "@/common.types"

  export const ById: Record<number, RelationshipType> = ${JSON.stringify(rtMap, null, 2)}
  `
  fs.writeFileSync(filePath, fileContent, "utf8")
}

fetchRelationshipTypes().then(mapTypes).then(writeToFile).catch(console.error)
