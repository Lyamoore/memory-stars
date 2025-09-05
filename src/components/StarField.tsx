import { useMemo } from "react"
import Star from "./Star.tsx"
import type { Memory } from "../types"

export default function StarField({
  memories,
  onSelect,
}: {
  memories: Memory[]
  onSelect: (id: string) => void
}) {
  const stars = useMemo(() => memories, [memories])

  return (
    <>
      {stars.map((m) => (
        <Star key={m.id} memory={m} onSelect={onSelect} />
      ))}
    </>
  )
}
