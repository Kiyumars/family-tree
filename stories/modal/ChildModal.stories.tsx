import MemberModal, { ChildMode } from "@/app/tree/components/MemberModal"
import ModalWrapper from "@/app/tree/components/ModalWrapper"
import RelationshipIds from "@/app/tree/components/RelationshipIds"
import { Meta, StoryObj } from "@storybook/react"
import { createMembers } from "../util"
import { Adjacencies, createAdjaciencies } from "@/app/tree/utils/utils"

const meta: Meta<typeof MemberModal> = {
  component: MemberModal,
}

export default meta
type Story = StoryObj<typeof MemberModal>

export const CreateChildWithTwoParents: Story = {
  render: () => {
    const members = createMembers([
      { first_name: "Husband", second_name: "Man" },
      { first_name: "Current", second_name: "Wife" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }
    const adjMap: Record<number, Adjacencies> = {
      1: createAdjaciencies({ partners: [2] }),
      2: createAdjaciencies({ partners: [1] }),
    }
    const getRelationships = (id: number) => {
      return adjMap[id]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ChildMode
            node={members[0]}
            getRelationships={getRelationships}
            getFamilyMember={getFamilyMember}
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

export const CreateChildWithMultiplePossibleParents: Story = {
  render: () => {
    const members = createMembers([
      { first_name: "Husband", second_name: "Man" },
      { first_name: "Current", second_name: "Wife" },
      { first_name: "Ex", second_name: "Wife" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }
    const adjMap: Record<number, Adjacencies> = {
      1: createAdjaciencies({ partners: [2, 3] }),
      2: createAdjaciencies({ partners: [1] }),
    }
    const getRelationships = (id: number) => {
      return adjMap[id]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ChildMode
            node={members[0]}
            getRelationships={getRelationships}
            getFamilyMember={getFamilyMember}
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
