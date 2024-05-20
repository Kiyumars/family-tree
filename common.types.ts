import { Tables, TablesInsert } from "@/database.types"

export type FamilyMember = Tables<"family_members">
export type FamilyMemberUpsert = TablesInsert<"family_members">
export type Relationship = Tables<"family_member_relationships">
export type RelationshipUpsert = TablesInsert<"family_member_relationships">
export type RelationshipType = Tables<"relationship_types">
