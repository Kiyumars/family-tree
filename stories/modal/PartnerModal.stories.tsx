import MemberModal, {
  PartnerModal
} from "@/app/tree/components/MemberModal"
import ModalWrapper from "@/app/tree/components/ModalWrapper"
import { Meta, StoryObj } from "@storybook/react"
import { fakeMember } from "../util"
  
  const meta: Meta<typeof MemberModal> = {
    component: MemberModal,
  }
  
  export default meta
  type Story = StoryObj<typeof MemberModal>
  
  export const CreatePartner: Story = {
    render: () => {
      return (
        <div id="modal-root">
          <ModalWrapper>
            <PartnerModal
              node={fakeMember}
              onClose={() => {}}
              familyId={1}
              setModalMode={() => {}}
              setNode={() => {}}
            />
          </ModalWrapper>
        </div>
      )
    },
  }