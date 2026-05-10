import { Link, createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/app/surveys/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="flex justify-end">
        <Link to="/app/surveys/add-survey">
          <Button>
            <Plus /> <span className="mr-2">Add Survey</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
