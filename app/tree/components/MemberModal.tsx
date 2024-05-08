"use client"

import * as React from "react"
import ModalWrapper from "./ModalWrapper"
import { Node } from "./Members"
import { FullItem } from "vis-data/declarations/data-interface"
import { editNode } from "@/app/actions"
import styles from "./MemberModal.module.css"
import { Tables } from "@/database.types"

function ReadMode({
  node,
  onClose,
  onEditMode,
}: {
  node: Tables<"family_members">
  onClose: () => void
  onEditMode: () => void
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
      <button onClick={onClose}>Close</button>
      <button onClick={onEditMode}>Edit</button>
    </div>
  )
}

function EditMode({
  node,
  onClose,
  onSubmit,
}: {
  node: Tables<"family_members">
  onClose: () => void
  onSubmit: (node: Tables<"family_members">) => void
}) {
  return (
    <div>
      <h1 className={styles.title}>MemberModal</h1>
      <form
        action={async (formData) => {
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
        }}
      >
        <div>
          <label htmlFor="first_name">First name: </label>
          <input
            type="text"
            name="first_name"
            defaultValue={node.first_name}
            required
          />
        </div>
        <div>
          <label htmlFor="second_name">Second name: </label>
          <input
            type="text"
            name="second_name"
            defaultValue={node.second_name}
            required
          />
        </div>
        <div>
          <label htmlFor="birth_date">Birth Date: </label>
          <input
            type="date"
            name="birth_date"
            defaultValue={node.birth_date}
            required
          />
        </div>
        <div>
          <label htmlFor="death_date">Death Date: </label>
          <input
            type="date"
            name="death_date"
            defaultValue={node.death_date || undefined}
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
          <textarea name="profession" defaultValue={node.profession || ""} />
        </div>
        <div>
          <label htmlFor="biography">Biography: </label>
          <textarea name="biography" defaultValue={node.biography || ""} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  )
}

export default function MemberModal({
  onClose,
  node,
  isEdit = false,
}: {
  onClose: () => void
  node: Tables<'family_members'>
  isEdit?: boolean
}) {
  const [editMode, setEditMode] = React.useState(isEdit)
  const [n, setNode] = React.useState(node)
  return (
    <ModalWrapper>
      {editMode ? (
        <EditMode
          node={n}
          onClose={onClose}
          onSubmit={(editedNode) => {
            setNode(editedNode)
            setEditMode(false)
          }}
        />
      ) : (
        <ReadMode
          node={n}
          onClose={onClose}
          onEditMode={() => setEditMode(true)}
        />
      )}
    </ModalWrapper>
  )
}
