import { useState, useRef, useEffect } from "react"
import { normalizeTag } from "../utils/tags"
import type { KeyboardEvent } from "react"

type Props = {
  tags: string[]
  setTags: (t: string[]) => void
  placeholder?: string
  suggestions?: string[]
  name?: string
}

export default function TagInput({
  tags,
  setTags,
  placeholder,
  suggestions = [],
}: Props) {
  const [value, setValue] = useState("")
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // очищаем внутренний инпут когда родитель сбрасывает теги
    if (tags.length === 0) {
      // откладываем setState, чтобы не дергать лишние рендеры
      setTimeout(() => setValue(""), 0)
    }
  }, [tags])

  const addTag = (raw: string) => {
    const tRaw = raw.trim()
    if (!tRaw) return
    const normalized = normalizeTag(tRaw)
    // не добавляем дубликаты, которые отличаются только регистром
    const existing = tags.map((x) => normalizeTag(x))
    if (existing.includes(normalized)) return
    setTags([...tags, tRaw])
    setValue("")
    ref.current?.focus()
  }

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t))

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (value) addTag(value)
    } else if (e.key === "Backspace" && value === "") {
      setTags(tags.slice(0, -1))
    }
  }

  const q = value.trim().toLowerCase()
  const filtered = q
    ? suggestions
        .filter(
          (s) =>
            s.toLowerCase().includes(q) &&
            !tags.map((x) => x.toLowerCase()).includes(s.toLowerCase())
        )
        .slice(0, 6)
    : []

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap gap-2 items-center bg-transparent w-full">
        {tags.map((t) => (
          <span key={t} className="tag-chip">
            <span className="truncate">{t}</span>
            <button
              type="button"
              onClick={() => removeTag(t)}
              className="text-gray-300 hover:text-white"
              aria-label={`Удалить тег ${t}`}
              title={`Удалить тег ${t}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (value) addTag(value)
          }}
          placeholder={placeholder || "Тег (Enter)"}
          className="form-control flex-1 min-w-0"
          aria-label="ввод тега"
          title="Ввод тега"
        />

        {typeof name === "string" && (
          <input type="hidden" name={name} value={tags.join(",")} />
        )}
      </div>

      {filtered.length > 0 && (
        <div className="mt-2 bg-gray-900/80 border border-gray-700 rounded-md p-2 text-sm">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="block w-full text-left px-2 py-1 hover:bg-gray-800/60 rounded"
              aria-label={`Добавить тег ${s}`}
              title={`Добавить тег ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
