"use client"

import {
  upsertChildsParents,
  upsertEdges,
  upsertNode,
  upsertParents,
  upsertPartnerRelationships,
} from "@/app/actions"
import RelationshipIds from "@/app/tree/components/RelationshipIds"
import { FamilyMember, Relationship, RelationshipType, RelationshipUpsert } from "@/common.types"
import * as React from "react"
import { FullItem } from "vis-data/declarations/data-interface"
import styles from "./MemberModal.module.css"
import ModalWrapper from "./ModalWrapper"

interface Props {
  onClose: () => void
  familyId: number
  node: FamilyMember
  edges: Relationship[]
  getRelationship: (id: number) => RelationshipType
  getFamilyMember: (id: number) => FullItem<FamilyMember, "id"> | null
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
  children,
  node,
  formAction,
}: {
  children?: React.ReactNode
  node?: FamilyMember
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

      {children}

      <button type="submit">Submit</button>
    </form>
  )
}

function PartnerSelection({
  parent,
  partners,
  setPartners,
  onClose,
}: {
  parent: FullItem<FamilyMember, "id">
  partners: FullItem<FamilyMember, "id">[]
  setPartners: (partners: FullItem<FamilyMember, "id">[]) => void
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
          <div>
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
  edges,
  getRelationship,
  getFamilyMember,
  onClose,
  setModalMode,
  setNode,
}: CreateModalProps) {
  const tmp: FullItem<FamilyMember, "id">[] = []
  edges.forEach((edge) => {
    if (
      edge.from === node.id &&
      getRelationship(edge.relationship_type).type === "partner"
    ) {
      const partner = getFamilyMember(edge.to)
      if (partner) {
        tmp.push(partner)
      }
    }
  })
  const [partners, setPartners] = React.useState(tmp)

  if (partners.length < 1) {
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
  if (partners.length > 1) {
    return (
      <PartnerSelection
        parent={node}
        partners={partners}
        setPartners={setPartners}
        onClose={onClose}
      />
    )
  }

  return (
    <div>
      <h1>Add new child</h1>
      <Form
        formAction={async (fd: FormData) => {
          fd.append("family_id", familyId.toString())
          const death = fd.get("death_date")
          if (!death) {
            fd.delete("death_date")
          }

          const parentsFD = fd.getAll("parents")
          fd.delete("parents")
          const child = await upsertNode(fd)

          await upsertChildsParents({
            parents: parentsFD,
            familyId: familyId,
            childId: child.id,
            revalidatedPath: `/tree/${familyId}`,
          })
          setNode(child)
          setModalMode(Mode.Read)
        }}
      >
        <div>
          <p>These are the parents of the child</p>
          {[node, partners[0]].map((parent) => (
            <div>
              <label htmlFor={`parents-${parent.id}`}>
                {parent.first_name} {parent.second_name}
              </label>
              <select name="parents" id={`parents-${parent.id}`}>
                <option
                  value={`${parent.id}-${RelationshipIds.Parent.Biological}`}
                >
                  Biolgical
                </option>
                <option
                  value={`${parent.id}-${RelationshipIds.Parent.Adopted}`}
                >
                  Adopter
                </option>
              </select>
            </div>
          ))}
        </div>
      </Form>
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
}: Omit<CreateModalProps, "edges" | "getRelationship" | "getFamilyMember">) {
  return (
    <div>
      <h1>
        Add partner of {node.first_name} {node.second_name}
      </h1>
      <Form
        formAction={async (fd) => {
          fd.append("family_id", familyId.toString())
          const death = fd.get("death_date")
          if (!death) {
            fd.delete("death_date")
          }
          const partner = await upsertNode(fd)
          await upsertPartnerRelationships({
            fd,
            familyId,
            partners: [node.id, partner.id],
            revalidatedPath: `/tree/${familyId}`,
          })
          setNode(partner)
          setModalMode(Mode.Read)
        }}
      >
        <div>
          <label htmlFor="relationship-select">Relationship type: </label>
          <select name="relationship" id="relationship-select">
            <option value={RelationshipIds.Partner.Married}>Married</option>
            <option value={RelationshipIds.Partner.Unmarried}>
              Unmarried
            </option>
            <option value={RelationshipIds.Partner.Separated}>
              Seperated
            </option>
          </select>
        </div>
        <button onClick={onClose}>Cancel</button>
      </Form>
    </div>
  )
}

export function ParentModal({
  familyId,
  node,
  onClose,
  edges,
  getRelationship,
  getFamilyMember,
}: CreateModalProps) {
  const tmp: FullItem<FamilyMember, "id">[] = []
  edges.forEach((e) => {
    if (
      e.to === node.id &&
      getRelationship(e.relationship_type).type === "parent"
    ) {
      const parent = getFamilyMember(e.from)
      if (parent) {
        tmp.push(parent)
      }
    }
  })

  const [parents, setParents] = React.useState<FamilyMember[]>(tmp)
  if (parents.length < 2) {
    return (
      <div>
        <h1>
          {" "}
          Add {parents.length < 1 ? <>first</> : <>second</>} parent of{" "}
          {`${node.first_name} ${node.second_name}`}
        </h1>
        <Form
          formAction={async (formData: FormData) => {
            formData.append("family_id", familyId.toString())
            const death = formData.get("death_date")
            if (!death) {
              formData.delete("death_date")
            }
            const parent = await upsertNode(formData)
            const relationships: RelationshipUpsert[] =
              [
                {
                  family_id: familyId,
                  from: node.id,
                  to: parent.id,
                  relationship_type: RelationshipIds.Child.Biological,
                },
                {
                  family_id: familyId,
                  from: parent.id,
                  to: node.id,
                  relationship_type: RelationshipIds.Parent.Biological,
                },
              ]
            await upsertEdges(relationships)
            setParents((prev) => [...prev, parent])
          }}
        />
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
          await upsertParents(fd, familyId, parents, `/tree/${familyId}`)
          onClose()
        }}
      >
        <label htmlFor="relationship-select">{`${parents[0].first_name} ${parents[0].second_name} and ${parents[1].first_name} ${parents[1].second_name} are: `}</label>
        <select name="relationship" id="relationship-select">
          <option value={RelationshipIds.Partner.Married}>Married</option>
          <option value={RelationshipIds.Partner.Unmarried}>
            Unmarried
          </option>
          <option value={RelationshipIds.Partner.Separated}>
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
  edges = [],
  getRelationship,
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
        edges={edges}
        familyId={familyId}
        setModalMode={setModalMode}
        setNode={setNode}
        getRelationship={getRelationship}
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
  edges,
  onClose,
  setModalMode,
  setNode,
  getRelationship,
  getFamilyMember,
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
          edges={edges}
          getRelationship={getRelationship}
          getFamilyMember={getFamilyMember}
          onClose={onClose}
          setNode={setNode}
          setModalMode={setModalMode}
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
          edges={edges}
          getRelationship={getRelationship}
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
