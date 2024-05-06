import MemberModal from "@/app/family/components/MemberModal"
import { Node } from "@/app/family/components/Members"
import { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof MemberModal> = {
  component: MemberModal,
}

export default meta
type Story = StoryObj<typeof MemberModal>

const fakeMember: Node = {
  id: 1,
  family_id: 1,
  uuid: "asdadasdasd",
  birth_date: "1769-08-15",
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
    const [display, setDisplay] = React.useState(true)
    return (
      <div id="modal-root">
        {display && (
          <MemberModal node={fakeMember} onClose={() => setDisplay(false)} />
        )}
      </div>
    )
  },
}

export const Edit: Story = {
  render: () => {
    const [display, setDisplay] = React.useState(true)
    return (
      <div id="modal-root">
        {display && (
          <MemberModal
            isEdit={true}
            node={fakeMember}
            onClose={() => setDisplay(false)}
          />
        )}
      </div>
    )
  },
}
