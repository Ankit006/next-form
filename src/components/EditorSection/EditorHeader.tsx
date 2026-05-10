import { Edit } from "lucide-react"

export default function EditorHeader() {
  return (
    <div className="border-b border-gray-200 pb-2">
      <label className="mb-2 text-sm">Title</label>
      <div className="flex items-start gap-2">
        <h1 className="text-2xl">This is Editor section</h1>
        <button>
          <Edit size={15} />
        </button>
      </div>
    </div>
  )
}
