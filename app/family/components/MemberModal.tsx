"use client"

import * as React from "react"
import ModalWrapper from "./ModalWrapper"
import { Node } from "./Members"
import { FullItem } from "vis-data/declarations/data-interface"
import styles from "./MemberModal.module.css"

function ReadMode({
  node,
  onClose,
  onEditMode,
}: {
  node: FullItem<Node, "id">
  onClose: () => void
  onEditMode: () => void
}) {
  return (
    <div>
      <h1 className={styles.title}>MemberModal</h1>
      <div>
        <p>First name: {node.first_name}</p>
        <p>Second name: {node.second_name}</p>
        <p>Birth date: {node.birth_date}</p>
        <p>Gender: {node.gender}</p>
        <p>Profession: {node.profession}</p>
      </div>
      <button onClick={onClose}>Close</button>
      <button onClick={onEditMode}>Edit</button>
    </div>
  )
}

function EditMode({
  node,
  onClose,
}: {
  node: FullItem<Node, "id">
  onClose: () => void
}) {
  return (
    <div>
      <h1 className={styles.title}>MemberModal</h1>
      <form>
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
  node: FullItem<Node, "id">
  isEdit?: boolean
}) {
  const [editMode, setEditMode] = React.useState(isEdit)
  return (
    <ModalWrapper>
      {editMode ? (
        <EditMode node={node} onClose={onClose} />
      ) : (
        <ReadMode
          node={node}
          onClose={onClose}
          onEditMode={() => setEditMode(true)}
        />
      )}
    </ModalWrapper>
  )
}
