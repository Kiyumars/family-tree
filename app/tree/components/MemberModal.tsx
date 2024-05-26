"use client"

import {
  upsertChildsParents,
  upsertFamilyMember,
  upsertRelationship
} from "@/app/actions"
import RelationshipTypeIds from "@/app/tree/components/RelationshipTypes"
import { FamilyMember } from "@/common.types"
import * as React from "react"
import { Adjacencies } from "../utils/utils"
import styles from "./MemberModal.module.css"
import ModalWrapper from "./ModalWrapper"
import MemberForm from "./forms/MemberForm"

interface Props {
  onClose: () => void
  familyId: number
  node: FamilyMember
  getRelationships: (id: number) => Adjacencies
  getFamilyMember: (id: number) => FamilyMember
  mode?: number
}

type CreateModalProps = Props & {
  setModalMode: (mode: number) => void
  setNode: (node: FamilyMember) => void
}

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
  node: FamilyMember
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
        <button onClick={() => onSetMode(Mode.Create.Partner)}>
          Add Partner
        </button>
        <button onClick={() => onSetMode(Mode.Create.Parent)}>
          Add Parents
        </button>
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
  node: FamilyMember
  onClose: () => void
  onSubmit: (node: FamilyMember) => void
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
    const editedNode = await upsertFamilyMember(formData, `/tree/${familyId}`)
    onSubmit(editedNode)
  }
  return (
    <div>
      <h1 className={styles.title}>MemberModal</h1>
      <MemberForm familyId={familyId} node={node} formAction={formAction} />
      <button onClick={onClose}>Close</button>
    </div>
  )
}

function PartnerSelection({
  parent,
  partners,
  setPartners,
  onClose,
}: {
  parent: FamilyMember
  partners: FamilyMember[]
  setPartners: (partners: FamilyMember[]) => void
  onClose: () => void
}) {
  const [current, setCurrent] = React.useState(partners[0])
  return (
    <div>
      <h1>Please clarify the parents of child</h1>
      <p>
        First parent: {parent.first_name} {parent.second_name}
      </p>
      <p>Second parent: </p>
      <form>
        {partners.map((p, i) => (
          <div key={`partner-select-${p.id}`}>
            <input
              type="radio"
              name="partner"
              defaultChecked={i === 0}
              onSelect={() => setCurrent(p)}
              id={`partner-${i}`}
            />
            <label htmlFor={`partner-${i}`}>
              {p.first_name} {p.second_name}
            </label>
          </div>
        ))}
        <button onClick={onClose}>Cancel</button>
        <button onClick={() => setPartners([current])}>Set partner</button>
      </form>
    </div>
  )
}

export function ChildMode({
  node,
  familyId,
  getFamilyMember,
  getRelationships,
  onClose,
  setModalMode,
  setNode,
}: CreateModalProps) {
  const tmp: FamilyMember[] = []
  getRelationships(node.id).partners.forEach((p) => {
    tmp.push(getFamilyMember(p))
  })
  const [parentPartners, setParentPartners] = React.useState(tmp)

  if (parentPartners.length < 1) {
    return (
      <div>
        <h1>Please add an additional parent for child</h1>
        <p>
          Add a partner for {node.first_name} {node.second_name}
        </p>{" "}
        <button onClick={() => setModalMode(Mode.Create.Partner)}>
          Add partner
        </button>
      </div>
    )
  }
  if (parentPartners.length > 1) {
    return (
      <PartnerSelection
        parent={node}
        partners={parentPartners}
        setPartners={setParentPartners}
        onClose={onClose}
      />
    )
  }

  return (
    <div>
      <h1>Add new child</h1>
      <MemberForm
        familyId={familyId}
        formAction={async (fd: FormData) => {
          const death = fd.get("death_date")
          if (!death) {
            fd.delete("death_date")
          }
          const child = await upsertFamilyMember(fd)
          await upsertChildsParents({
            fd: fd,
            familyId: familyId,
            childId: child.id,
            parents: [node, parentPartners[0]],
            revalidatedPath: `/tree/${familyId}`,
          })
          setNode(child)
          setModalMode(Mode.Read)
        }}
      >
        <div>
          <p>These are the parents of the child</p>
          {[node, parentPartners[0]].map((parent, i) => (
            <div key={`parents-sel-${parent.id}`}>
              <label htmlFor={`parents-${i}`}>
                {parent.first_name} {parent.second_name}
              </label>
              <select name="parents" id={`parents-${i}`}>
                <option value={RelationshipTypeIds.Parent.Biological}>
                  Biolgical
                </option>
                <option value={RelationshipTypeIds.Parent.Adopted}>
                  Adopter
                </option>
              </select>
            </div>
          ))}
        </div>
      </MemberForm>
      <button onClick={onClose}>Cancel</button>
    </div>
  )
}

export function PartnerModal({
  node,
  familyId,
  setNode,
  onClose,
  setModalMode,
}: Omit<
  CreateModalProps,
  "edges" | "getRelationshipType" | "getFamilyMember" | "getRelationships"
>) {
  return (
    <div>
      <h1>
        Add partner of {node.first_name} {node.second_name}
      </h1>
      <MemberForm
        familyId={familyId}
        formAction={async (fd) => {
          const death = fd.get("death_date")
          if (!death) {
            fd.delete("death_date")
          }
          const partner = await upsertFamilyMember(fd)
          await upsertRelationship({
            fd,
            familyId,
            from: node.id,
            to: partner.id,
            revalidatedPath: `/tree/${familyId}`,
          })
          setNode(partner)
          setModalMode(Mode.Read)
        }}
      >
        <div>
          <label htmlFor="relationship-select">Relationship type: </label>
          <select name="relationship" id="relationship-select">
            <option value={RelationshipTypeIds.Partner.Married}>Married</option>
            <option value={RelationshipTypeIds.Partner.Unmarried}>
              Unmarried
            </option>
            <option value={RelationshipTypeIds.Partner.Separated}>
              Seperated
            </option>
          </select>
        </div>
        <button onClick={onClose}>Cancel</button>
      </MemberForm>
    </div>
  )
}

export function ParentModal({
  familyId,
  node,
  onClose,
  getFamilyMember,
  getRelationships,
}: CreateModalProps) {
  const tmp: FamilyMember[] = []
  getRelationships(node.id).parents.forEach((p) => tmp.push(getFamilyMember(p)))
  const [parents, setParents] = React.useState<FamilyMember[]>(tmp)
  if (parents.length < 2) {
    return (
      <div>
        <h1>
          {" "}
          Add {parents.length < 1 ? <>first</> : <>second</>} parent of{" "}
          {`${node.first_name} ${node.second_name}`}
        </h1>
        <MemberForm
          familyId={familyId}
          formAction={async (fd: FormData) => {
            const death = fd.get("death_date")
            if (!death) {
              fd.delete("death_date")
            }
            const parent = await upsertFamilyMember(fd)
            await upsertRelationship({
              familyId,
              from: parent.id,
              to: node.id,
              fd,
            })
            setParents((prev) => [...prev, parent])
          }}
        >
          <div>
            This parent is the{" "}
            <select name="relationship" id="relationship-select">
              <option value={RelationshipTypeIds.Parent.Biological}>
                biological
              </option>
              <option value={RelationshipTypeIds.Parent.Adopted}>
                adopted
              </option>
            </select>{" "}
            parent of {node.first_name} {node.second_name}
          </div>
        </MemberForm>
      </div>
    )
  }
  return (
    <div>
      <h1>
        What is the relationship between the parents of {node.first_name}{" "}
        {node.second_name}?
      </h1>
      <form
        action={async (fd: FormData) => {
          await upsertRelationship({
            familyId,
            from: parents[0].id,
            to: parents[1].id,
            fd,
            revalidatedPath: `/tree/${familyId}`
          })
          onClose()
        }}
      >
        <label htmlFor="relationship-select">{`${parents[0].first_name} ${parents[0].second_name} and ${parents[1].first_name} ${parents[1].second_name} are: `}</label>
        <select name="relationship" id="relationship-select">
          <option value={RelationshipTypeIds.Partner.Married}>Married</option>
          <option value={RelationshipTypeIds.Partner.Unmarried}>
            Unmarried
          </option>
          <option value={RelationshipTypeIds.Partner.Separated}>
            Seperated
          </option>
        </select>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default function MemberModal({
  onClose,
  familyId,
  node,
  getRelationships,
  getFamilyMember,
  mode = Mode.Read,
}: Props) {
  const [modalMode, setModalMode] = React.useState(mode)
  const [n, setNode] = React.useState(node)
  return (
    <ModalWrapper>
      <Content
        modalMode={modalMode}
        node={n}
        familyId={familyId}
        setModalMode={setModalMode}
        setNode={setNode}
        getRelationships={getRelationships}
        getFamilyMember={getFamilyMember}
        onClose={onClose}
      />
    </ModalWrapper>
  )
}

function Content({
  familyId,
  modalMode,
  node,
  onClose,
  setModalMode,
  setNode,
  getFamilyMember,
  getRelationships,
}: Props & {
  modalMode: number
  setModalMode: (mode: number) => void
  setNode: (node: FamilyMember) => void
}) {
  switch (modalMode) {
    case Mode.Read:
      return <ReadMode node={node} onClose={onClose} onSetMode={setModalMode} />
    case Mode.Edit:
      return (
        <EditMode
          familyId={familyId}
          node={node}
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
          getFamilyMember={getFamilyMember}
          onClose={onClose}
          setNode={setNode}
          setModalMode={setModalMode}
          getRelationships={getRelationships}
        />
      )
    case Mode.Create.Partner:
      return (
        <PartnerModal
          familyId={familyId}
          node={node}
          onClose={onClose}
          setModalMode={setModalMode}
          setNode={setNode}
        />
      )
    case Mode.Create.Parent:
      return (
        <ParentModal
          familyId={familyId}
          node={node}
          getRelationships={getRelationships}
          getFamilyMember={getFamilyMember}
          setModalMode={setModalMode}
          onClose={onClose}
          setNode={setNode}
        />
      )
    default:
      return <ReadMode node={node} onClose={onClose} onSetMode={setModalMode} />
  }
}
