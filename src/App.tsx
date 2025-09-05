import { useState, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

import StarField from "./components/StarField"
import MemoryPanel from "./components/MemoryPanel"
import BackgroundParticles from "./components/BackgroundParticles"
import CreateMemoryForm from "./components/CreateMemoryForm"
import FilterPanel from "./components/FilterPanel"

import { useMemoryStore } from "./store/memoryStore"

export default function App() {
  const memories = useMemoryStore((s) => s.memories)
  const addMemory = useMemoryStore((s) => s.addMemory)

  const [selected, setSelected] = useState<string | null>(null)
  const deleteMemory = useMemoryStore((s) => s.deleteMemory)
  // Фильтры
  const [filterEmotion, setFilterEmotion] = useState<string>("all")
  const [tagFilterInput, setTagFilterInput] = useState("")
  const [tagFilters, setTagFilters] = useState<string[]>([])
  // теги для формы создания
  const [tags, setTags] = useState<string[]>([])

  const selectedMemory = useMemoryStore((s) =>
    selected ? s.getById(selected) : null
  )

  // сбор уникальных тегов для подсказок
  const uniqueTags = useMemo(() => {
    const s = new Set<string>()
    for (const m of memories) {
      for (const t of m.tags || []) s.add(t)
    }
    return Array.from(s)
  }, [memories])

  // подсказки для текущего ввода
  const tagSuggestions = useMemo(() => {
    const q = tagFilterInput.trim().toLowerCase()
    if (!q) return uniqueTags.slice(0, 8)
    return uniqueTags
      .filter((t) => t.toLowerCase().includes(q) && !tagFilters.includes(t))
      .slice(0, 8)
  }, [tagFilterInput, uniqueTags, tagFilters])

  const addTagFilter = (t: string) => {
    const v = t.trim()
    if (!v) return
    if (tagFilters.includes(v)) return
    setTagFilters((s) => [...s, v])
    setTagFilterInput("")
  }

  const removeTagFilter = (t: string) =>
    setTagFilters((s) => s.filter((x) => x !== t))

  // фильтрация воспоминаний по выбранным фильтрам
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (filterEmotion !== "all" && m.emotion !== filterEmotion) return false
      if (tagFilters.length > 0) {
        // требует все выбранные теги
        const norm = (m.tags || []).map((t) => t.trim().toLowerCase())
        for (const tf of tagFilters) {
          const n = tf.trim().toLowerCase()
          if (!norm.includes(n)) return false
        }
      }
      return true
    })
  }, [memories, filterEmotion, tagFilters])

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* левая панель */}
      <CreateMemoryForm
        addMemory={addMemory}
        uniqueTags={uniqueTags}
        tags={tags}
        setTags={setTags}
      />

      {/* 3D сцена */}
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <OrbitControls />

        <BackgroundParticles />

        <StarField
          memories={filteredMemories}
          onSelect={(id) => setSelected(id)}
        />
      </Canvas>

      {/* нижняя панель */}
      <FilterPanel
        tagFilters={tagFilters}
        tagFilterInput={tagFilterInput}
        setTagFilterInput={setTagFilterInput}
        tagSuggestions={tagSuggestions}
        addTagFilter={addTagFilter}
        removeTagFilter={removeTagFilter}
        filterEmotion={filterEmotion}
        setFilterEmotion={setFilterEmotion}
      />

      {/* правая панель */}
      <MemoryPanel
        memory={selectedMemory}
        onClose={() => setSelected(null)}
        onDelete={(id) => {
          deleteMemory(id)
          setSelected(null)
        }}
      />
    </div>
  )
}
