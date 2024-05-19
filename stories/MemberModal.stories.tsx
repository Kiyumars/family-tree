import MemberModal, {
  ChildMode,
  EditMode,
  ParentModal,
  PartnerModal,
  ReadMode,
} from "@/app/tree/components/MemberModal"
import { Node } from "@/app/tree/components/MembersGraph"
import ModalWrapper from "@/app/tree/components/ModalWrapper"
import { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { createMembers } from "./util"
import * as Relationship from "@/app/tree/components/Relationship"
import { Tables } from "@/database.types"

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

export const CreateChildWithTwoParents: Story = {
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
        relationship_type: Relationship.Types.Partner.Married,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 1,
        relationship_type: Relationship.Types.Partner.Married,
      },
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 3,
        relationship_type: Relationship.Types.Partner.Separated,
      },
      {
        id: 1,
        family_id: 1,
        from: 3,
        to: 1,
        relationship_type: Relationship.Types.Partner.Separated,
      },
    ]

    return (
      <div id="modal-root">
        <ModalWrapper>
          <ChildMode
            node={members[0]}
            edges={edges}
            getFamilyMember={getFamilyMember}
            getRelationship={(id: number): Tables<"relationship_types"> => {
              switch (id) {
                case Relationship.Types.Partner.Married:
                  return { id, type: "partner", subtype: "married" }
                case Relationship.Types.Partner.Separated:
                  return { id, type: "partner", subtype: "seperated" }
                default:
                  return { id, type: "partner", subtype: "married" }
              }
            }}
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
            getRelationship={(id: number): Tables<"relationship_types"> => {
              return { id, type: "partner", subtype: "married" }
            }}
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
            getRelationship={(id: number): Tables<"relationship_types"> => {
              return { id, type: "partner", subtype: "married" }
            }}
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
                relationship_type: Relationship.Types.Child.Adopted,
              },
              {
                id: 2,
                family_id: 1,
                from: 2,
                to: 1,
                relationship_type: Relationship.Types.Parent.Biological,
              },
            ]}
            getFamilyMember={getFamilyMember}
            getRelationship={(id: number): Tables<"relationship_types"> => {
              if (id === 2) {
                return {
                  id: Relationship.Types.Parent.Biological,
                  type: "parent",
                  subtype: "biological",
                }
              }
              return {
                id: Relationship.Types.Parent.Biological,
                type: "parent",
                subtype: "biological",
              }
            }}
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
                relationship_type: Relationship.Types.Child.Adopted,
              },
              {
                id: 2,
                family_id: 1,
                from: 2,
                to: 1,
                relationship_type: Relationship.Types.Parent.Biological,
              },
              {
                id: 3,
                family_id: 1,
                from: 3,
                to: 1,
                relationship_type: Relationship.Types.Parent.Biological,
              },
              {
                id: 4,
                family_id: 1,
                from: 1,
                to: 3,
                relationship_type: Relationship.Types.Child.Biological,
              },
            ]}
            getFamilyMember={getFamilyMember}
            getRelationship={(id: number): Tables<"relationship_types"> => {
              if (id === 2 || id === 3) {
                return {
                  id: Relationship.Types.Parent.Biological,
                  type: "parent",
                  subtype: "biological",
                }
              }
              return {
                id: Relationship.Types.Parent.Biological,
                type: "parent",
                subtype: "biological",
              }
            }}
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
