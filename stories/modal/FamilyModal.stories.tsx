import { FormContent as CreateFamily } from "@/components/family/CreateForm"
import ModalWrapper from "@/components/modal/ModalWrapper"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof CreateFamily> = {
  component: CreateFamily,
}

export default meta
type Story = StoryObj<typeof CreateFamily>

export const CreateFamilyTree: Story = {
  render: () => {
    return (
      <div id="modal-root">
        <ModalWrapper>
          <CreateFamily />
        </ModalWrapper>
      </div>
    )
  },
}
