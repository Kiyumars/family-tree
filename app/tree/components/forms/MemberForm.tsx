import * as React from 'react'
import { FamilyMember } from "@/common.types"

export default function MemberForm({
    familyId,
    children,
    node,
    formAction,
  }: {
    familyId: number
    children?: React.ReactNode
    node?: FamilyMember
    formAction: (formData: FormData) => void
  }) {
    return (
      <form action={formAction}>
        <input type="number" hidden name="family_id" value={familyId} />
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