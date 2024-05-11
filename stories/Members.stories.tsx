import Members from "@/app/tree/components/Members"
import { Meta, StoryObj } from "@storybook/react"
import { createMembers } from "./util"
import { Tables } from "@/database.types"
import { setHierarchies } from "@/app/tree/utils/utils"

const meta: Meta<typeof Members> = {
  component: Members,
}

export default meta
type Story = StoryObj<typeof Members>

const RELATIONSHIP_TYPES: Tables<"relationship_types">[] = [
  { id: 1, type: "partner", subtype: "married" },
  { id: 2, type: "partner", subtype: "unmarried" },
  { id: 3, type: "child", subtype: "biological" },
  { id: 4, type: "child", subtype: "adopted" },
  { id: 5, type: "partner", subtype: "separated" },
  { id: 6, type: "parent", subtype: "biological" },
  { id: 7, type: "parent", subtype: "adopted" },
]

const rtMap: Record<number, Tables<"relationship_types">> = {}
RELATIONSHIP_TYPES.forEach((rt) => {
  rtMap[rt.id] = rt
})

const getRelationship = (id: number) => {
  return rtMap[id]
}

export const OneEntry: Story = {
  render: () => {
    return (
      <Members
        familyId={1}
        relationshipTypes={RELATIONSHIP_TYPES}
        familyMembers={createMembers([
          { first_name: "Frank", second_name: "Sinatra" },
        ])}
        relationships={[]}
      />
    )
  },
}

export const TwoUnlinkedEntries: Story = {
  render: () => {
    return (
      <Members
        familyId={1}
        familyMembers={createMembers([
          { first_name: "Frank", second_name: "Sinatra" },
          { first_name: "Dean", second_name: "Martin" },
        ])}
        relationships={[]}
        relationshipTypes={RELATIONSHIP_TYPES}
      />
    )
  },
}

export const ParentChild: Story = {
  render: () => {
    return (
      <Members
        familyId={1}
        relationshipTypes={RELATIONSHIP_TYPES}
        familyMembers={createMembers([
          { first_name: "Frank", second_name: "Sinatra" },
          { first_name: "Dean", second_name: "Martin" },
        ])}
        relationships={[
          {
            id: 1,
            family_id: 1,
            from: 1,
            to: 2,
            relationship_type: 6,
          },
          {
            id: 2,
            family_id: 1,
            from: 2,
            to: 1,
            relationship_type: 3,
          },
        ]}
      />
    )
  },
}

export const TwoChildren: Story = {
  render: () => {
    return (
      <Members
        familyId={1}
        relationshipTypes={RELATIONSHIP_TYPES}
        familyMembers={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Blue", second_name: "Knowles" },
          { first_name: "Rumi", second_name: "Knowles" },
        ])}
        relationships={[
          {
            id: 1,
            family_id: 1,
            from: 1,
            to: 2,
            relationship_type: 6,
          },
          {
            id: 2,
            family_id: 1,
            from: 1,
            to: 3,
            relationship_type: 6,
          },
        ]}
      />
    )
  },
}

export const ParentsWithOneChild: Story = {
  render: () => {
    return (
      <Members
        familyId={1}
        relationshipTypes={RELATIONSHIP_TYPES}
        familyMembers={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Sean", second_name: "Carter" },
          { first_name: "Blue", second_name: "Knowles" },
        ])}
        relationships={[
          {
            id: 1,
            family_id: 1,
            from: 1,
            to: 2,
            relationship_type: 1,
          },
          {
            id: 2,
            family_id: 1,
            from: 2,
            to: 1,
            relationship_type: 1,
          },
          {
            id: 3,
            family_id: 1,
            from: 1,
            to: 3,
            relationship_type: 6,
          },
          {
            id: 4,
            family_id: 1,
            from: 2,
            to: 3,
            relationship_type: 6,
          },
        ]}
      />
    )
  },
}

export const ParentsWithTwoChildren: Story = {
  render: () => {
    return (
      <Members
        familyId={1}
        relationshipTypes={RELATIONSHIP_TYPES}
        familyMembers={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Sean", second_name: "Carter" },
          { first_name: "Blue", second_name: "Knowles" },
          { first_name: "Rumi", second_name: "Knowles" },
        ])}
        relationships={[
          {
            id: 1,
            family_id: 1,
            from: 1,
            to: 2,
            relationship_type: 1,
          },
          {
            id: 2,
            family_id: 1,
            from: 2,
            to: 1,
            relationship_type: 1,
          },
          {
            id: 3,
            family_id: 1,
            from: 1,
            to: 3,
            relationship_type: 6,
          },
          {
            id: 4,
            family_id: 1,
            from: 2,
            to: 3,
            relationship_type: 6,
          },
          {
            id: 6,
            family_id: 1,
            from: 1,
            to: 4,
            relationship_type: 6,
          },
          {
            id: 7,
            family_id: 1,
            from: 2,
            to: 4,
            relationship_type: 6,
          },
        ]}
      />
    )
  },
}

export const ManWithSpouseAndPreviousChild: Story = {
  render: () => {
    return (
      <Members
        familyId={1}
        relationshipTypes={RELATIONSHIP_TYPES}
        familyMembers={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Sean", second_name: "Carter" },
          { first_name: "Blue", second_name: "Knowles" },
        ])}
        relationships={[
          {
            id: 1,
            family_id: 1,
            from: 1,
            to: 2,
            relationship_type: 1,
          },
          {
            id: 2,
            family_id: 1,
            from: 2,
            to: 1,
            relationship_type: 1,
          },
          {
            id: 3,
            family_id: 1,
            from: 2,
            to: 3,
            relationship_type: 6,
          },
        ]}
      />
    )
  },
}
