import { Content as CreateFamily } from "@/app/tree/components/forms/FamilyForm"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof CreateFamily> = {
  component: CreateFamily,
}

export default meta
type Story = StoryObj<typeof CreateFamily>

export const CreateFamilyTree: Story = {
  render: () => {
    return <CreateFamily />
  },
}
