import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/App/dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello Form dashboard</div>
}
