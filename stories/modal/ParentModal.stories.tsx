import MemberModal, { ParentModal } from "@/app/tree/components/MemberModal"
import ModalWrapper from "@/app/tree/components/ModalWrapper"
import RelationshipIds from "@/app/tree/components/RelationshipIds"
import { Meta, StoryObj } from "@storybook/react"
import { createMembers, fakeGetRelationship } from "../util"

const meta: Meta<typeof MemberModal> = {
  component: MemberModal,
}

export default meta
type Story = StoryObj<typeof MemberModal>

export const CreateParentFirstScreen: Story = {
  render: () => {
    const nodes = createMembers([
      { first_name: "Child", second_name: "O'Parent" },
    ])
    const members = createMembers([
      { first_name: "Parent", second_name: "One" },
      { first_name: "Parent", second_name: "Two" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ParentModal
            node={nodes[0]}
            edges={[]}
            getFamilyMember={getFamilyMember}
            getRelationship={fakeGetRelationship}
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
    const nodes = createMembers([
      { first_name: "Child", second_name: "O'Parent" },
    ])
    const members = createMembers([
      // fake entry for id
      { first_name: "Child", second_name: "O'Parent" },

      { first_name: "Parent", second_name: "One" },
      { first_name: "Parent", second_name: "Two" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ParentModal
            node={nodes[0]}
            edges={[
              {
                id: 1,
                family_id: 1,
                from: 1,
                to: 2,
                relationship_type: RelationshipIds.Child.Adopted,
              },
              {
                id: 2,
                family_id: 1,
                from: 2,
                to: 1,
                relationship_type: RelationshipIds.Parent.Biological,
              },
            ]}
            getFamilyMember={getFamilyMember}
            getRelationship={fakeGetRelationship}
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
    const nodes = createMembers([
      { first_name: "Child", second_name: "O'Parent" },
    ])
    const members = createMembers([
      // fake entry for id
      { first_name: "Child", second_name: "O'Parent" },

      { first_name: "Parent", second_name: "One" },
      { first_name: "Parent", second_name: "Two" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ParentModal
            node={nodes[0]}
            edges={[
              {
                id: 1,
                family_id: 1,
                from: 1,
                to: 2,
                relationship_type: RelationshipIds.Child.Adopted,
              },
              {
                id: 2,
                family_id: 1,
                from: 2,
                to: 1,
                relationship_type: RelationshipIds.Parent.Biological,
              },
              {
                id: 3,
                family_id: 1,
                from: 3,
                to: 1,
                relationship_type: RelationshipIds.Parent.Biological,
              },
              {
                id: 4,
                family_id: 1,
                from: 1,
                to: 3,
                relationship_type: RelationshipIds.Child.Biological,
              },
            ]}
            getFamilyMember={getFamilyMember}
            getRelationship={fakeGetRelationship}
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
