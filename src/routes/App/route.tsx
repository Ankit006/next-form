import { Outlet, createFileRoute } from "@tanstack/react-router"
import AppSidebar from "@/components/common/AppSidebar"
import Header from "@/components/common/Header"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export const Route = createFileRoute("/App")({
  component: MainLayout,
})

function MainLayout() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="px-8 py-4">
          <SidebarTrigger />
          <Header />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  )
}
