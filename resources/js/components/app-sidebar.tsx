import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowBigDownIcon, BookmarkCheck, Calendar1Icon, DollarSign, FolderClosed, LayoutGrid, LucideBaggageClaim, UserRound } from 'lucide-react';
import AppLogo from './app-logo';

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
    const { isAdmin } = useAuth();

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
            url: isAdmin ? '/admin/presence' : '/user/presence',
            icon: Calendar1Icon,
        },
        {
            title: 'Payrolls',
            url: '/payroll',
            icon: DollarSign,
        },
        {
            title: 'Leave Request',
            url: isAdmin ? '/admin/leave' : '/user/leave',
            icon: ArrowBigDownIcon,
        },
    ];

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
