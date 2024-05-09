"use client"

import { editNode } from "@/app/actions"
import { Tables } from "@/database.types"
import * as React from "react"
import { Edge } from "react-vis-graph-wrapper"
import styles from "./MemberModal.module.css"
import ModalWrapper from "./ModalWrapper"

enum Mode {
  Read,
  Edit,
  Create,
}

function ReadMode({
  node,
  onClose,
  onSetMode,
}: {
  node: Tables<"family_members">
  onClose: () => void
  onSetMode: (mode: Mode) => void
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
        <button onClick={() => onSetMode(Mode.Create)}>Add child</button>
      </div>
    </div>
  )
}

function EditMode({
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
  const formAction= async (formData: FormData) => {
    if (node.id) {
      formData.append("id", node.id.toString())
    }
    formData.append("family_id", node.family_id.toString())
    const death = formData.get("death_date")
    if (!death) {
      formData.delete("death_date")
    }
    const editedNode = await editNode(formData)
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

function CreateMode({
  familyId,
  edges,
  onClose,
  onSubmit,
}: {
  familyId: number
  edges: Edge[]
  onSubmit: (node: Tables<"family_members">) => void
  onClose: () => void
}) {
  return (
    <div>
      <h1>New Member</h1>
      <Form formAction={() => console.log('create')}/>
      <button onClick={onClose}>Cancel</button>
    </div>
  )
}

export default function MemberModal({
  onClose,
  familyId,
  node,
  edges = [],
  mode = Mode.Read,
}: {
  onClose: () => void
  familyId: number
  node: Tables<"family_members">
  edges: Edge[]
  mode?: Mode
}) {
  const [modalMode, setModalMode] = React.useState(mode)
  const [n, setNode] = React.useState(node)
  return (
    <ModalWrapper>
      {modalMode === Mode.Edit ? (
        <EditMode
          familyId={familyId}
          node={n}
          onClose={onClose}
          onSubmit={(editedNode) => {
            setNode(editedNode)
            setModalMode(Mode.Read)
          }}
        />
      ) : modalMode === Mode.Create ? (
        <CreateMode
          familyId={familyId}
          edges={edges}
          onClose={onClose}
          onSubmit={(submittedNode) => {
            setNode(submittedNode)
            setModalMode(Mode.Read)
          }}
        />
      ) : (
        <ReadMode node={n} onClose={onClose} onSetMode={setModalMode} />
      )}
    </ModalWrapper>
  )
}
