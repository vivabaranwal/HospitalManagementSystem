import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BedDouble,
  Stethoscope,
  Activity,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Appointments", url: "/appointments", icon: CalendarCheck },
  { title: "Doctors", url: "/doctors", icon: Stethoscope },
  { title: "Beds & Wards", url: "/beds", icon: BedDouble },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-9 w-9 shrink-0 overflow-hidden">
          <img src="/favicon.svg" alt="Logo" className="h-full w-full object-cover rounded-xl shadow-[0_0_15px_rgba(64,203,168,0.2)]" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <h1 className="font-bold text-sidebar-primary-foreground text-base leading-tight">MediCare</h1>
          <p className="text-xs text-sidebar-foreground/60">Hospital System</p>
        </div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
