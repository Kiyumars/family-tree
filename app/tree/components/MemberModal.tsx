"use client"

import { upsertEdges, upsertNode } from "@/app/actions"
import { Tables, TablesInsert } from "@/database.types"
import * as React from "react"
import styles from "./MemberModal.module.css"
import ModalWrapper from "./ModalWrapper"

const Mode = {
  Read: 1,
  Edit: 2,
  Create: {
    Child: 3,
    Partner: 4,
    Parent: 5,
  },
  Delete: 6,
}

export function ReadMode({
  node,
  onClose,
  onSetMode,
}: {
  node: Tables<"family_members">
  onClose: () => void
  onSetMode: (mode: number) => void
}) {
  return (
    <div>
      <h1 className={styles.title}>MemberModal</h1>
      <div>
        <p>First name: {node.first_name}</p>
        <p>Second name: {node.second_name}</p>
        <p>Birth: {node.birth_date}</p>
        <p>Death: {node.death_date}</p>
        <p>Gender: {node.gender}</p>
        <p>Profession: {node.profession}</p>
        <p>Bio: {node.biography}</p>
      </div>
      <div>
        <button onClick={onClose}>Close</button>
      </div>
      <div>
        <button onClick={() => onSetMode(Mode.Edit)}>Edit</button>
      </div>
      <div>
        <button onClick={() => onSetMode(Mode.Create.Child)}>Add child</button>
      </div>
    </div>
  )
}

export function EditMode({
  familyId,
  node,
  onClose,
  onSubmit,
}: {
  familyId: number
  node: Tables<"family_members">
  onClose: () => void
  onSubmit: (node: Tables<"family_members">) => void
}) {
  const formAction = async (formData: FormData) => {
    if (node.id) {
      formData.append("id", node.id.toString())
    }
    formData.append("family_id", familyId.toString())
    const death = formData.get("death_date")
    if (!death) {
      formData.delete("death_date")
    }
    const editedNode = await upsertNode(formData, `/tree/${familyId}`)
    onSubmit(editedNode)
  }
  return (
    <div>
      <h1 className={styles.title}>MemberModal</h1>
      <Form node={node} formAction={formAction} />
      <button onClick={onClose}>Close</button>
    </div>
  )
}

function Form({
  node,
  formAction,
}: {
  node?: Tables<"family_members">
  formAction: (formData: FormData) => void
}) {
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="first_name">First name: </label>
        <input
          type="text"
          name="first_name"
          defaultValue={node && node.first_name ? node.first_name : ""}
          required
        />
      </div>
      <div>
        <label htmlFor="second_name">Second name: </label>
        <input
          type="text"
          name="second_name"
          defaultValue={node && node.second_name ? node.second_name : ""}
          required
        />
      </div>
      <div>
        <label htmlFor="birth_date">Birth Date: </label>
        <input
          type="date"
          name="birth_date"
          defaultValue={node && node.birth_date ? node.birth_date : undefined}
          required
        />
      </div>
      <div>
        <label htmlFor="death_date">Death Date: </label>
        <input
          type="date"
          name="death_date"
          defaultValue={node && node.death_date ? node.death_date : undefined}
        />
      </div>
      <div>
        <label htmlFor="gender-m">Male</label>
        <input
          type="radio"
          id="gender-m"
          name="gender"
          value="m"
          defaultChecked
        />
        <label htmlFor="gender-w">Female</label>

        <input
          type="radio"
          id="gender-w"
          name="gender"
          value="w"
          defaultChecked
        />
      </div>
      <div>
        <label htmlFor="profession">Profession: </label>
        <textarea
          name="profession"
          defaultValue={node && node.profession ? node.profession : ""}
        />
      </div>
      <div>
        <label htmlFor="biography">Biography: </label>
        <textarea
          name="biography"
          defaultValue={node && node.biography ? node.biography : ""}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

function ChildMode({
  node,
  familyId,
  edges,
  getRelationship,
  onClose,
  onSubmit,
}: {
  node: Tables<"family_members">
  familyId: number
  edges: Tables<"family_member_relationships">[]
  getRelationship: (id: number) => Tables<"relationship_types">
  onSubmit: (node: Tables<"family_members">) => void
  onClose: () => void
}) {
  let parents = [node.id]
  edges.forEach((edge) => {
    if (getRelationship(edge.relationship_type).type === "partner") {
      parents.push(edge.to)
    }
  })

  return (
    <div>
      <h1>New Member</h1>
      <Form
        formAction={async (formData: FormData) => {
          formData.append("family_id", familyId.toString())
          const death = formData.get("death_date")
          if (!death) {
            formData.delete("death_date")
          }
          const child = await upsertNode(formData)
          // todo avoid hardcoding relationship id
          let parentEdges: TablesInsert<"family_member_relationships">[] = []
          parents.forEach((parent) => {
            parentEdges.push({
              family_id: familyId,
              from: child.id,
              to: parent,
              relationship_type: 3,
            })
            parentEdges.push({
              family_id: familyId,
              from: parent,
              to: child.id,
              relationship_type: 6,
            })
          })
          await upsertEdges(parentEdges, `/tree/${familyId}`)
          onSubmit(child)
        }}
      />
      <button onClick={onClose}>Cancel</button>
    </div>
  )
}

export default function MemberModal({
  onClose,
  familyId,
  node,
  edges = [],
  getRelationship,
  mode = Mode.Read,
}: {
  onClose: () => void
  familyId: number
  node: Tables<"family_members">
  edges: Tables<"family_member_relationships">[]
  getRelationship: (id: number) => Tables<"relationship_types">
  mode?: number
}) {
  const [modalMode, setModalMode] = React.useState(mode)
  const [n, setNode] = React.useState(node)
  const renderContent = () => {
    switch (modalMode) {
      case Mode.Read:
        return <ReadMode node={n} onClose={onClose} onSetMode={setModalMode} />
      case Mode.Edit:
        return (
          <EditMode
            familyId={familyId}
            node={n}
            onClose={onClose}
            onSubmit={(editedNode) => {
              setNode(editedNode)
              setModalMode(Mode.Read)
            }}
          />
        )
      case Mode.Create.Child:
        return (
          <ChildMode
            familyId={familyId}
            node={node}
            edges={edges}
            getRelationship={getRelationship}
            onClose={onClose}
            onSubmit={(submittedNode) => {
              setNode(submittedNode)
              setModalMode(Mode.Read)
            }}
          />
        )
      default:
        return <ReadMode node={n} onClose={onClose} onSetMode={setModalMode} />
    }
  }

  return <ModalWrapper>{renderContent()}</ModalWrapper>
}