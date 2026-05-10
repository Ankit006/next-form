import { Link } from "@tanstack/react-router"
import { LayoutDashboard, ListTodo } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* ----- Dashboard -------- */}
        <SidebarGroup>
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/app/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Surveys */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/app/surveys">
                  <ListTodo />
                  <span>Surveys</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
1
