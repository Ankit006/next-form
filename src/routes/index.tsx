import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh w-full p-6">
      <div className="mx-auto flex flex-col items-center gap-2 leading-loose">
        <h1 className="text-3xl font-semibold">Welcome to Next survey</h1>
        <p>Click below button to go to the dashboard</p>
        <Link to="/app/dashboard">
          <Button className="text-lg">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
