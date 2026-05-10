import { Outlet, createFileRoute } from "@tanstack/react-router"
import AppSidebar from "@/components/common/AppSidebar"
import Header from "@/components/common/Header"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export const Route = createFileRoute("/app")({
  component: MainLayout,
})

function MainLayout() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-screen">
          <div className="flex items-center border-b border-gray-200 py-3">
            <SidebarTrigger />
            <Header />
          </div>
          <div className="pt-4 pr-8 pl-7">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
