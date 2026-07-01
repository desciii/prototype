import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Package, Truck, File, FileText, Import, ArrowLeftRight, ChartLine, Newspaper} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: ChartLine,
    },
  
  {
        title: 'Purchase Orders',
        href: '/po',
        icon: FileText,
    },

    {
        title: 'Suppliers',
        href: '/supplies',
        icon: Package,
    },
    
    {
        title: 'Deliveries',
        href: '/deliveries',
        icon: Truck,
    },

    {
        title: 'IAR Report',
        href: '/iar',
        icon: File,
    },

    {
    title: 'Import / Export CSV',
    href: '/importexport',
    icon: ArrowLeftRight, // import from lucide-react
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/desciii/prototype',
        icon: FolderGit2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
