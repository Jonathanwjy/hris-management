import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowBigDownIcon, BookmarkCheck, Calendar1Icon, DollarSign, FolderClosed, LayoutGrid, LucideBaggageClaim, UserRound } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Task',
        url: '/task',
        icon: BookmarkCheck,
    },

    {
        title: 'Presences',
        url: '/precense',
        icon: Calendar1Icon,
    },
    {
        title: 'Payrolls',
        url: '/payroll',
        icon: DollarSign,
    },
    {
        title: 'Leave Request',
        url: '/leave',
        icon: ArrowBigDownIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Departments',
        url: '/department',
        icon: LucideBaggageClaim,
    },
    {
        title: 'Roles',
        url: '/role',
        icon: FolderClosed,
    },
    {
        title: 'Employees',
        url: '/employee',
        icon: UserRound,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    const isAdmin = props.auth.isAdmin;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                {isAdmin && <NavFooter items={footerNavItems} className="mt-auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
