import React from "react"

import Member, { Edge, Node } from "@/app/family/components/Members"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Member> = {
  component: Member,
}

export default meta
type Story = StoryObj<typeof Member>

export const Empty: Story = {
  render: () => <Member nodes={[]} edges={[]} />,
}

export const OneEntry: Story = {
  render: () => {
    const nodes: Node[] = [
      { id: 1, label: "Dean Martin", title: "Dean Martin" },
    ]
    return <Member nodes={nodes} edges={[]} />
  },
}

export const TwoUnlinkedEntries: Story = {
  render: () => {
    const nodes: Node[] = [
      { id: 1, label: "Dean Martin", title: "Dean Martin" },
      { id: 2, label: "Frank Sinatra", title: "Frank Sinatra" },
    ]
    return <Member nodes={nodes} edges={[]} />
  },
}

export const ParentChild: Story = {
  render: () => {
    const nodes: Node[] = [
      { id: 1, label: "Dean Martin", title: "Dean Martin" },
      { id: 2, label: "Frank Sinatra", title: "Frank Sinatra" },
    ]
    const edges: Edge[] = [{ from: 1, to: 2, label: "" }]
    return <Member nodes={nodes} edges={edges} />
  },
}

export const TwoChildren: Story = {
  render: () => {
    const nodes: Node[] = [
      { id: 1, label: "Dean Martin", title: "Dean Martin" },
      { id: 2, label: "Frank Sinatra", title: "Frank Sinatra" },
      { id: 3, label: "Sammy Davis Jr", title: "Sammy Davis Jr" },
    ]
    const edges: Edge[] = [
      { from: 1, to: 2, label: "" },
      { from: 1, to: 3, label: "" },
    ]
    return <Member nodes={nodes} edges={edges} />
  },
}

export const ParentsWithOneChild: Story = {
  render: () => {
    const nodes: Node[] = [
      { id: 1, label: "Zeus", title: "Zeus" },
      { id: 2, label: "Hera", title: "Hera" },
      { id: 3, label: "Ares", title: "Ares" },
    ]
    const edges: Edge[] = [
      { from: 2, to: 3, label: "" },
      { from: 1, to: 3, label: "" },
    ]
    return <Member nodes={nodes} edges={edges} />
  },
}

export const ManWithSpouseAndPreviousChild: Story = {
  render: () => {
    const nodes: Node[] = [
      { id: 1, label: "Zeus", title: "Zeus", level: -1 },
      { id: 2, label: "Hera", title: "Hera", level: -1 },
      { id: 3, label: "Ares", title: "Ares", level: 0 },
    ]
    const edges: Edge[] = [
      { from: 1, to: 3, label: "" },
      { from: 1, to: 2, label: "" },
      { from: 2, to: 1, label: "" },
    ]
    return <Member nodes={nodes} edges={edges} />
  },
}
