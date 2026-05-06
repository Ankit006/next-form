import { Outlet, createFileRoute } from "@tanstack/react-router"
import Header from "@/components/Header"

export const Route = createFileRoute("/App")({
  component: MainLayout,
})

function MainLayout() {
  return (
    <div>
      <Header />
      <div className="px-8 py-4">
        <Outlet />
      </div>
    </div>
  )
}
