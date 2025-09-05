import type { Dispatch, SetStateAction } from "react"

type Props = {
  tagFilters: string[]
  tagFilterInput: string
  setTagFilterInput: Dispatch<SetStateAction<string>>
  tagSuggestions: string[]
  addTagFilter: (t: string) => void
  removeTagFilter: (t: string) => void
  filterEmotion: string
  setFilterEmotion: Dispatch<SetStateAction<string>>
}

export default function FilterPanel({
  tagFilters,
  tagFilterInput,
  setTagFilterInput,
  tagSuggestions,
  addTagFilter,
  removeTagFilter,
  filterEmotion,
  setFilterEmotion,
}: Props) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 p-4 glass w-[640px] z-50 pointer-events-auto">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-gray-300">Фильтры</p>
        <div className="text-sm text-gray-400">
          Показывать звёзды по фильтрам
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <input
              value={tagFilterInput}
              onChange={(e) => setTagFilterInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault()
                  if (tagFilterInput.trim()) addTagFilter(tagFilterInput)
                } else if (e.key === "Backspace" && tagFilterInput === "") {
                  // удаление последнего тега
                }
              }}
              placeholder="Поиск тега..."
              className="form-control w-48"
            />

            {tagFilters.map((t) => (
              <span key={t} className="tag-chip">
                <span className="truncate">{t}</span>
                <button
                  type="button"
                  onClick={() => removeTagFilter(t)}
                  className="text-gray-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {tagSuggestions.length > 0 && tagFilterInput.trim().length > 0 && (
            <div className="mt-0 bg-gray-900/80 border border-gray-700 rounded-md p-2 text-sm max-h-40 overflow-auto">
              {tagSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTagFilter(s)}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-800/60 rounded"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Эмоция:</label>
          <select
            value={filterEmotion}
            onChange={(e) => setFilterEmotion(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="happy">Радость</option>
            <option value="calm">Спокойствие</option>
            <option value="sad">Грусть</option>
            <option value="excited">Волнение</option>
          </select>
        </div>
      </div>
    </div>
  )
}
