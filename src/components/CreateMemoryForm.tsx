import type { FormEvent } from "react"
import TagInput from "./TagInput"
import type { Emotion, Memory } from "../types"
import { normalizeTags } from "../utils/tags"

type NewMemory = Omit<Memory, "id" | "position"> & { connections?: string[] }

type Props = {
  addMemory: (m: NewMemory) => void
  uniqueTags: string[]
  tags: string[]
  setTags: (t: string[]) => void
}

export default function CreateMemoryForm({
  addMemory,
  uniqueTags,
  tags,
  setTags,
}: Props) {
  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const normalized = normalizeTags(tags)

    addMemory({
      title: (fd.get("title") as string) || "",
      description: (fd.get("description") as string) || "",
      date: (fd.get("date") as string) || new Date().toISOString(),
      emotion: fd.get("emotion") as unknown as Emotion,
      tags: normalized,
      connections: [],
    })

    e.currentTarget.reset()
    setTags([])
  }

  return (
    <div className="absolute top-6 left-6 p-5 glass w-[300px] z-50 pointer-events-auto">
      <form className="flex flex-col gap-3" onSubmit={handleAdd}>
        <input
          name="title"
          placeholder="Заголовок"
          required
          className="form-control"
        />
        <textarea
          name="description"
          placeholder="Описание"
          className="form-control"
        />
        <input type="date" name="date" className="form-control" />
        <select name="emotion" className="form-control">
          <option value="happy">Радость</option>
          <option value="calm">Спокойствие</option>
          <option value="sad">Грусть</option>
          <option value="excited">Волнение</option>
        </select>
        <TagInput
          tags={tags}
          setTags={setTags}
          placeholder="Тег (Enter)"
          suggestions={uniqueTags}
          name="tags"
        />
        <button
          type="submit"
          className="primary"
          title="Добавить воспоминание"
          aria-label="Добавить воспоминание"
        >
          Добавить воспоминание
        </button>
      </form>
    </div>
  )
}
