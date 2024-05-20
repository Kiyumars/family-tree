import MemberModal, {
  EditMode,
  ReadMode
} from "@/app/tree/components/MemberModal"
import ModalWrapper from "@/app/tree/components/ModalWrapper"
import { Meta, StoryObj } from "@storybook/react"
import { fakeMember } from "../util"

const meta: Meta<typeof MemberModal> = {
  component: MemberModal,
}

export default meta
type Story = StoryObj<typeof MemberModal>

export const Read: Story = {
  render: () => {
    return (
      <div id="modal-root">
        <ModalWrapper>
          <ReadMode node={fakeMember} onClose={() => {}} onSetMode={() => {}} />
        </ModalWrapper>
      </div>
    )
  },
}

export const Edit: Story = {
  render: () => {
    return (
      <div id="modal-root">
        <ModalWrapper>
          <EditMode
            familyId={1}
            node={fakeMember}
            onClose={() => {}}
            onSubmit={() => {}}
          />
        </ModalWrapper>
      </div>
    )
  },
}
