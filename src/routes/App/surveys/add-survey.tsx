import { createFileRoute } from "@tanstack/react-router"
import EditorHeader from "@/components/EditorSection/EditorHeader"
import EditorSettingsSideBar from "@/components/EditorSettingsSideBar/EditorSettingsSideBar"

export const Route = createFileRoute("/app/surveys/add-survey")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid h-full grid-cols-4 gap-4">
      <div className="col-span-3 pt-4">
        <EditorHeader />
      </div>
      <EditorSettingsSideBar />
    </div>
  )
}
