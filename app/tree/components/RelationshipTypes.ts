import { RelationshipType } from "@/common.types"

const RelationshipTypeIds = {
  Partner: {
    Married: 1,
    Unmarried: 2,
    Separated: 5,
  },
  Child: {
    Biological: 3,
    Adopted: 4,
  },
  Parent: {
    Biological: 6,
    Adopted: 7,
  },
}

// todo replace with database generated code map
export const rtMap: Record<number, RelationshipType> = {
  1: { id: 1, type: "partner", subtype: "married" },
  2: { id: 2, type: "partner", subtype: "unmarried" },
  3: { id: 3, type: "child", subtype: "biological" },
  4: { id: 4, type: "child", subtype: "adopted" },
  5: { id: 5, type: "partner", subtype: "separated" },
  6: { id: 6, type: "parent", subtype: "biological" },
  7: { id: 7, type: "parent", subtype: "adopted" },
}

export default RelationshipTypeIds
