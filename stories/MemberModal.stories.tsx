import MemberModal, {
  EditMode,
  ReadMode,
} from "@/app/tree/components/MemberModal"
import { Node } from "@/app/tree/components/MembersGraph"
import ModalWrapper from "@/app/tree/components/ModalWrapper"
import { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof MemberModal> = {
  component: MemberModal,
}

export default meta
type Story = StoryObj<typeof MemberModal>

const fakeMember: Node = {
  id: 1,
  created_at: "2024-05-01",
  family_id: 1,
  uuid: "asdadasdasd",
  birth_date: "1769-08-15",
  death_date: "1821-05-05",
  first_name: "Napoleon",
  second_name: "Bonaparte",
  profession: "Warmongering emperor",
  biography:
    "Short king impresses an Austrian socialite by taking over Europe.",
  gender: "male",
  title: "Napoleon Bonaparte",
  label: "Napoleon Bonaparte",
  level: 0,
}

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
