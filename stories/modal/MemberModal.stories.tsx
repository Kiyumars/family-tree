import MemberModal, {
  EditMode,
  ReadMode,
} from "@/components/member/MemberModal"
import ModalWrapper from "@/components/modal/ModalWrapper"
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
