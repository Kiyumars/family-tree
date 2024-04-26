import React from "react"
import PropTypes from "prop-types"

interface Props {
  familyMembers: FamilyMember[]
}

export interface FamilyMember {
  uuid: string
  first_name: string
  second_name: string
}

export function Members({ familyMembers }: Props) {
  return (
    <div>
      <ul data-testid="members-list">
        {familyMembers.map((member) => {
          return (
            <li
              key={member.uuid}
            >{`${member.first_name} ${member.second_name}`}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default Members
