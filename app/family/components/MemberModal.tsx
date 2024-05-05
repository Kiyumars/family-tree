"use client"

import * as React from "react"
import ModalWrapper from "./ModalWrapper"
import { Node } from "./Members"
import { FullItem } from "vis-data/declarations/data-interface"
import styles from "./MemberModal.module.css"

export default function MemberModal({
  onClose,
  node,
}: {
  onClose: () => void
  node: FullItem<Node, "id">
}) {
  return (
    <ModalWrapper>
      <div>
        <h1 className={styles.title}>MemberModal</h1>
        <form>
          <p>First name: {node.first_name}</p>
          <p>Second name: {node.second_name}</p>
          <p>Birth date: {node.birth_date}</p>
          <p>Gender: {node.gender}</p>
          <p>Profession: {node.profession}</p>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </ModalWrapper>
  )
}
