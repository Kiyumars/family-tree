import MemberModal, { ParentModal } from "@/app/tree/components/MemberModal"
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

export const CreateParentFirstScreen: Story = {
  render: () => {
    const members = createMembers([
      { first_name: "Child", second_name: "O'Parent" },

      { first_name: "Parent", second_name: "One" },
      { first_name: "Parent", second_name: "Two" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }
    const adjMap: Record<number, Adjacencies> = { 1: createAdjaciencies({}) }
    const getRelationships = (id: number) => {
      return adjMap[id]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ParentModal
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

export const CreateParentSecondScreen: Story = {
  render: () => {
    const members = createMembers([
      { first_name: "Child", second_name: "O'Parent" },

      { first_name: "Parent", second_name: "One" },
      { first_name: "Parent", second_name: "Two" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }
    const adjMap: Record<number, Adjacencies> = {
      1: createAdjaciencies({ parents: [2] }),
      2: createAdjaciencies({ children: [1] }),
    }
    const getRelationships = (id: number) => {
      return adjMap[id]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ParentModal
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

export const CreateParentThirdScreen: Story = {
  render: () => {
    const members = createMembers([
      { first_name: "Child", second_name: "O'Parent" },

      { first_name: "Parent", second_name: "One" },
      { first_name: "Parent", second_name: "Two" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }

    const adjMap: Record<number, Adjacencies> = {
      1: createAdjaciencies({ parents: [2, 3] }),
      2: createAdjaciencies({ children: [1], partners: [3] }),
      3: createAdjaciencies({ children: [1], partners: [2] }),
    }
    const getRelationships = (id: number) => {
      return adjMap[id]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ParentModal
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
