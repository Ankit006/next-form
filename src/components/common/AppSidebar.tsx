import { Plus } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupLabel, SidebarHeader } from "../ui/sidebar";

export default function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                {/* ----- Dashboard -------- */}
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Plus /> Add Project
                    </SidebarGroupAction>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
