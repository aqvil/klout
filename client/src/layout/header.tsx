import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, X, User, Settings, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { KloutLogo } from "@/components/ui/logo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActiveLink = (path: string) => {
    return location === path;
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <header className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <KloutLogo variant="light" size="md" />
              </Link>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link href="/rankings" className={`${isActiveLink('/rankings') ? 'text-white border-b-2 border-secondary' : 'text-neutral-300 hover:text-white'} px-3 py-2 text-sm font-medium`}>
                Rankings
              </Link>
              <Link href="/players" className={`${isActiveLink('/players') ? 'text-white border-b-2 border-secondary' : 'text-neutral-300 hover:text-white'} px-3 py-2 text-sm font-medium`}>
                Players
              </Link>
              <Link href="/about" className={`${isActiveLink('/about') ? 'text-white border-b-2 border-secondary' : 'text-neutral-300 hover:text-white'} px-3 py-2 text-sm font-medium`}>
                About
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className={`${isActiveLink('/admin') ? 'text-white border-b-2 border-secondary' : 'text-neutral-300 hover:text-white'} px-3 py-2 text-sm font-medium`}>
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search players..." 
                  className="bg-white/10 text-white placeholder-neutral-300 border border-transparent focus:border-secondary focus:ring-0 rounded-lg px-4 py-2 text-sm" 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-300" />
                </div>
              </div>
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-2 bg-white/10 hover:bg-white/20">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-white text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      {user.isAdmin && <p className="text-xs leading-none text-muted-foreground">Administrator</p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer w-full">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="ml-4 bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10">
            <div className="space-y-1 pb-3">
              <Link href="/rankings" className={`${isActiveLink('/rankings') ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium`}>
                Rankings
              </Link>
              <Link href="/players" className={`${isActiveLink('/players') ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium`}>
                Players
              </Link>
              <Link href="/about" className={`${isActiveLink('/about') ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium`}>
                About
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className={`${isActiveLink('/admin') ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium`}>
                  Admin
                </Link>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-white/10">
              <div className="px-2 space-y-1">
                <div className="relative mb-3">
                  <Input 
                    type="text" 
                    placeholder="Search players..." 
                    className="bg-white/10 text-white placeholder-neutral-300 border border-transparent focus:border-secondary focus:ring-0 rounded-lg px-4 py-2 text-sm w-full" 
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-neutral-300" />
                  </div>
                </div>
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center p-2 mb-2">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-secondary text-white text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{user.username}</p>
                        {user.isAdmin && <p className="text-xs text-neutral-300">Administrator</p>}
                      </div>
                    </div>
                    
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    
                    <Link href="/settings">
                      <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    
                    {user.isAdmin && (
                      <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    
                    <Button 
                      onClick={handleLogout} 
                      className="w-full bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg text-sm font-medium mt-2"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button className="w-full bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
