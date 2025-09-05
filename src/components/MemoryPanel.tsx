import type { Memory } from "../types"
import { emotionLabels } from "../utils/emotionColors"

type Props = {
  memory: Memory | null
  onClose: () => void
  onDelete: (id: string) => void
}

export default function MemoryPanel({ memory, onClose, onDelete }: Props) {
  if (!memory) return null

  return (
    <div className="fixed top-6 right-6 w-80 p-5 glass z-50 pointer-events-auto shadow-xl rounded-2xl border border-gray-700 text-white">
      <h2 className="text-xl font-bold mb-2">Воспоминание</h2>

      <div className="mb-2">
        <p className="text-sm text-gray-300">Заголовок:</p>
        <p className="font-medium text-lg">{memory.title}</p>
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-300">Дата:</p>
        <p className="font-medium">{new Date(memory.date).toLocaleString()}</p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-300">Эмоция:</p>
        <p className="font-medium">{emotionLabels[memory.emotion]}</p>
      </div>

      {memory.tags && memory.tags.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-gray-300">Теги:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {memory.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 bg-gray-800/40 text-white rounded-full text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-gray-300">Описание:</p>
        <p>{memory.description}</p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-800/40 hover:bg-gray-800/50 transition"
        >
          Закрыть
        </button>

        <button
          onClick={() => onDelete(memory.id)}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Удалить
        </button>
      </div>
    </div>
  )
}
