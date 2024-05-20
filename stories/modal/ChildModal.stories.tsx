import MemberModal, { ChildMode } from "@/app/tree/components/MemberModal"
import ModalWrapper from "@/app/tree/components/ModalWrapper"
import RelationshipIds from "@/app/tree/components/RelationshipIds"
import { Meta, StoryObj } from "@storybook/react"
import { createMembers, fakeGetRelationship } from "../util"

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
    const edges = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 2,
        relationship_type: RelationshipIds.Partner.Married,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 1,
        relationship_type: RelationshipIds.Partner.Married,
      },
    ]

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ChildMode
            node={members[0]}
            edges={edges}
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
    const edges = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 2,
        relationship_type: RelationshipIds.Partner.Married,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 1,
        relationship_type: RelationshipIds.Partner.Married,
      },
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 3,
        relationship_type: RelationshipIds.Partner.Separated,
      },
      {
        id: 1,
        family_id: 1,
        from: 3,
        to: 1,
        relationship_type: RelationshipIds.Partner.Separated,
      },
    ]

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ChildMode
            node={members[0]}
            edges={edges}
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

export const CreateChildWithOneParent: Story = {
  render: () => {
    const members = createMembers([
      { first_name: "Parent", second_name: "One" },
    ])
    const getFamilyMember = (id: number) => {
      return members[id - 1]
    }

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ChildMode
            node={members[0]}
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
