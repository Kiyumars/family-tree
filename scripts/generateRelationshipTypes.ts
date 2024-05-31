import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as fs from "fs"
import { RelationshipType } from "../common.types"
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

function createFileContent(rts: RelationshipType[] | undefined) {
  if (rts === undefined) {
    throw Error("could not fetch relationship type")
  }
  const byId: Record<number, RelationshipType> = {}
  const byType: Record<string, { subtype: string; id: number }[]> = {}
  rts.forEach((r) => {
    byId[r.id] = r
    if (byType[r.type] === undefined) {
      byType[r.type] = []
    }
    byType[r.type].push({ subtype: r.subtype, id: r.id })
  })
  let c = "export const ByType = {\n"
  for (const [t, sts] of Object.entries(byType)) {
    c += `  ${t.replace(/\b\w/, (s) => s.toUpperCase())}: {\n`
    sts.forEach((s) => {
      c += `    ${s.subtype.replace(/\b\w/, (s) => s.toUpperCase())}: ${s.id},\n`
    })
    c += "},\n"
  }
  c += "\n}"
  const content = `
import { RelationshipType } from "@/common.types"

export const ById: Record<number, RelationshipType> = ${JSON.stringify(byId, null, 2)}

${c}
  `
  return content
}

function writeToFile(content: string) {
  const filePath = path.join(
    ".",
    "app",
    "tree",
    "utils",
    "maps",
    "RelationshipTypes.ts"
  )
  fs.writeFileSync(filePath, content, "utf8")
}

fetchRelationshipTypes()
  .then(createFileContent)
  .then(writeToFile)
  .catch(console.error)
