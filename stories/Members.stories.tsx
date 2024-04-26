import React from "react"

import Member, { FamilyMember } from "@/app/family/components/Members"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Member> = {
  component: Member,
}

export default meta
type Story = StoryObj<typeof Member>

export const Empty: Story = {
  render: () => <Member familyMembers={[]} />,
}

export const OneEntry: Story = {
  render: () => {
    const familyMembers: FamilyMember[] = [
      { uuid: "sdfdssfsd", first_name: "Dean", second_name: "Martin" },
    ]
    return <Member familyMembers={familyMembers} />
  },
}

export const MultipleEntries: Story = {
    render: () => {
      const familyMembers: FamilyMember[] = [
        { uuid: "sdfdssfsd", first_name: "Dean", second_name: "Martin" },
      ]
      return <Member familyMembers={familyMembers} />
    },
  }
