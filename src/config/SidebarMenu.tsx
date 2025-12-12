// src/config/sidebar.ts
import { ReactNode } from "react";
import { Home, Users, Briefcase, Building, UserCog, BriefcaseBusiness, CalendarClock, CheckCircle, ClipboardList, Umbrella, Plane, CalendarX, CalendarCheck, UserRoundCheck, ListTodo } from "lucide-react"; // contoh icon dari lucide-react

export interface SidebarItem {
  title: string;
  route?: string;
  icon?: ReactNode;
  permission?: string[];
  children?: SidebarItem[];
  isDynamic?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: <Home size={18} />,
    permission: ["all:all"], // admin bisa akses semua
  },
  {
    title: "Employee",
    route: "/employee-management",
    icon: <Users size={18} />,
    permission: [
      "employee-management:read",
      "employee-management:create",
      "employee-management:update",
      "employee-management:delete",
      "all:all",
    ],
  },
  {
    title: "Department",
    route: "/department-management",
    icon: <BriefcaseBusiness size={18} />,
    permission: [
      "department-management:read",
      "department-management:create",
      "department-management:update",
      "department-management:delete",
      "all:all",
    ],
  },
  {
    title: "Role & Permission",
    route: "/role-permission-management",
    icon: <UserCog size={18} />,
    permission: [
      "role-permission-management:read",
      "role-permission-management:create",
      "role-permission-management:update",
      "role-permission-management:delete",
      "all:all",
    ],
  },
  {
    title: "Shift Management",
    route: "/shift-management",
    icon: <CalendarClock size={18} />,
    permission: [
      "shift-management:read",
      "shift-management:create",
      "shift-management:update",
      "shift-management:delete",
      "all:all",
    ],
  },
  {
    title: "Attendance",
    route: "/attendance",
    icon: <CheckCircle size={18} />,
    permission: [
      "attendance:read",
      "attendance:create",
      "attendance:update",
      "attendance:delete",
      "all:all",
    ],
  },
  {
    title: "Data Attendance",
    route: "/attendance-management",
    icon: <ClipboardList size={18} />,
    permission: [
      "attendance-management:read",
      "attendance-management:create",
      "attendance-management:update",
      "attendance-management:delete",
      "all:all",
    ],
  },
  {
    title: "Work Leave",
    route: "/work-leave",
    icon: <CalendarX size={18} />,
    permission: [
      "work-leave:read",
      "work-leave:create",
      "work-leave:update",
      "work-leave:delete",
      "all:all",
    ],
  },

  {
    title: "Work Leave Management",
    route: "/work-leave-management",
    icon: <CalendarCheck size={18} />,
    permission: [
      "work-leave-management:read",
      "work-leave-management:create",
      "work-leave-management:update",
      "work-leave-management:delete",
      "all:all",
    ],
  },
  {
    title: "Job Vacancy",
    route: "/job-vacancy",
    icon: <Briefcase size={18} />,
    permission: [
      "job-vacancy-management:read",
      "job-vacancy-management:create",
      "job-vacancy-management:update",
      "job-vacancy-management:delete",
      "all:all",
    ],
  },
  {
    title: "Applicant Management",
    route: "/applicant-management",
    icon: <UserRoundCheck size={18} />,
    permission: [
      "job-vacancy-management:read",
      "job-vacancy-management:create",
      "job-vacancy-management:update",
      "job-vacancy-management:delete",
      "all:all",
    ],
  },
  {
    title: "Work Plan",
    icon: <ListTodo size={18} />,
    permission: [
      "work-plan:read",
      "work-plan:create",
      "work-plan:update",
      "work-plan:delete",
      "all:all",
    ],
    children: [], // ini akan di-inject runtime dari data user
    isDynamic: true, // penanda bahwa ini menu dinamis
  },
];
