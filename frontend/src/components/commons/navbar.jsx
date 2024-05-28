import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"

import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
        <>
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link to= "/home"><NavigationMenuTrigger>Home</NavigationMenuTrigger></Link>
                    <NavigationMenuTrigger><Link to= "/problems">Problem</Link></NavigationMenuTrigger>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        </>
    )
}

export default Navbar;