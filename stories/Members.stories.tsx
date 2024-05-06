import Member from "@/app/family/components/Members"
import { Meta, StoryObj } from "@storybook/react"
import { createMembers } from "./util"

const meta: Meta<typeof Member> = {
  component: Member,
}

export default meta
type Story = StoryObj<typeof Member>

export const OneEntry: Story = {
  render: () => {
    return (
      <Member
        members={createMembers([
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
      <Member
        members={createMembers([
          { first_name: "Frank", second_name: "Sinatra" },
          { first_name: "Dean", second_name: "Martin" },
        ])}
        relationships={[]}
      />
    )
  },
}

export const ParentChild: Story = {
  render: () => {
    return (
      <Member
        members={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Blue", second_name: "Knowles" },
        ])}
        relationships={[
          {
            source: 1,
            target: 2,
            relationship_types: { type: "parent", subtype: "biological" },
          },
          {
            source: 2,
            target: 1,
            relationship_types: { type: "child", subtype: "biological" },
          },
        ]}
      />
    )
  },
}

export const TwoChildren: Story = {
  render: () => {
    return (
      <Member
        members={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Blue", second_name: "Knowles" },
          { first_name: "Rumi", second_name: "Knowles" },
        ])}
        relationships={[
          {
            source: 1,
            target: 2,
            relationship_types: { type: "parent", subtype: "biological" },
          },
          {
            source: 1,
            target: 3,
            relationship_types: { type: "parent", subtype: "biological" },
          },
        ]}
      />
    )
  },
}

export const ParentsWithOneChild: Story = {
  render: () => {
    return (
      <Member
        members={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Sean", second_name: "Carter" },
          { first_name: "Blue", second_name: "Knowles" },
        ])}
        relationships={[
          {
            source: 1,
            target: 2,
            relationship_types: { type: "partner", subtype: "married" },
          },
          {
            source: 2,
            target: 1,
            relationship_types: { type: "partner", subtype: "married" },
          },
          {
            source: 1,
            target: 3,
            relationship_types: { type: "parent", subtype: "biological" },
          },
          {
            source: 2,
            target: 3,
            relationship_types: { type: "parent", subtype: "biological" },
          },
        ]}
      />
    )
  },
}

export const ManWithSpouseAndPreviousChild: Story = {
  render: () => {
    return (
      <Member
        members={createMembers([
          { first_name: "Beyonce", second_name: "Knowles" },
          { first_name: "Sean", second_name: "Carter" },
          { first_name: "Blue", second_name: "Knowles" },
        ])}
        relationships={[
          {
            source: 1,
            target: 2,
            relationship_types: { type: "partner", subtype: "married" },
          },
          {
            source: 2,
            target: 1,
            relationship_types: { type: "partner", subtype: "married" },
          },
          {
            source: 2,
            target: 3,
            relationship_types: { type: "parent", subtype: "biological" },
          },
        ]}
      />
    )
  },
}
