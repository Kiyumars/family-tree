import { useRef, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import styles from "./ModalWrapper.module.css"

export default function ModalWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const ref = useRef(document.querySelector("modal-root"))
  const [mounted, setMounted] = useState(false)
  const content = (
    <div className={styles.backdrop}>
      <div className={styles.modal}>{children}</div>
    </div>
  )

  useEffect(() => {
    ref.current = document.getElementById('modal-root')
    if (ref.current) {
      setMounted(true)
    }
  }, [ref])
  return mounted && ref.current ? createPortal(content, ref.current) : null
}
