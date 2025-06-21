"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Globe, User, LogOut, PlusCircle, Package, Hotel, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

export const Navigation = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  const navigationLinks = [
    { to: "/", label: "Home", icon: Globe, showOnMobile: true },
    { to: "/packages", label: "Packages", icon: Package, showOnMobile: true },
    { to: "/hotels", label: "Hotels", icon: Hotel, showOnMobile: true },
    { to: "/generate", label: "Generate Trip", icon: PlusCircle, showOnMobile: true },
  ]

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile and small tablets */}
      <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6">
        {navigationLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-xs xl:text-sm font-medium transition-all duration-200 hover:text-primary dark:text-gray-200 hover:scale-105 flex items-center gap-1 xl:gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <link.icon className="h-3 w-3 xl:h-4 xl:w-4" />
            <span className="hidden xl:inline">{link.label}</span>
          </Link>
        ))}

        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-xs xl:text-sm font-medium transition-all duration-200 hover:text-primary dark:text-gray-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="hidden xl:inline">My Trips</span>
              <span className="xl:hidden">Trips</span>
            </Link>
            <div className="flex items-center space-x-1 xl:space-x-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium dark:text-gray-200 hover:scale-105 transition-transform duration-200"
              >
                <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full bg-tripmancer-purple/20 dark:bg-purple-900/20 flex items-center justify-center">
                  <User size={12} className="xl:w-4 xl:h-4 text-tripmancer-purple-dark dark:text-purple-400" />
                </div>
                <span className="hidden 2xl:inline max-w-20 truncate">{user.email?.split("@")[0]}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 h-6 w-6 xl:h-8 xl:w-8 p-0"
              >
                <LogOut className="h-3 w-3 xl:h-4 xl:w-4 dark:text-gray-300" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-xs xl:text-sm font-medium transition-all duration-200 hover:text-primary dark:text-gray-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="rounded-full px-3 xl:px-6 text-xs xl:text-sm bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark hover:opacity-90 dark:from-purple-700 dark:to-blue-700 transition-all duration-200 hover:scale-105"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/generate")}
          className="flex items-center space-x-1 rounded-full dark:text-gray-200 dark:border-gray-600 px-2 xl:px-4 text-xs xl:text-sm transition-all duration-200 hover:scale-105"
        >
          <PlusCircle className="h-3 w-3 xl:h-4 xl:w-4" />
          <span className="hidden xl:inline ml-1">New Trip</span>
        </Button>
      </nav>

      {/* Tablet Navigation - Visible on medium screens */}
      <nav className="hidden md:flex lg:hidden items-center space-x-3">
        {navigationLinks.slice(0, 3).map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm font-medium transition-all duration-200 hover:text-primary dark:text-gray-200 hover:scale-105 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <link.icon className="h-5 w-5" />
          </Link>
        ))}

        {user ? (
          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
            >
              <div className="w-7 h-7 rounded-full bg-tripmancer-purple/20 dark:bg-purple-900/20 flex items-center justify-center">
                <User size={16} className="text-tripmancer-purple-dark dark:text-purple-400" />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="rounded-full px-4 bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Navigation - Visible on small screens */}
      <nav className="flex md:hidden items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={closeMobileMenu}
            />

            {/* Menu Panel */}
            <div
              className={cn(
                "fixed top-0 right-0 z-50 h-full shadow-2xl transform transition-all duration-300 ease-out",
                "w-full max-w-sm sm:max-w-md",
                "bg-white dark:bg-gray-900", // Ensure solid background
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-gray-700 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark bg-clip-text text-transparent">
                  TripMancer
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 sm:p-6 space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className="block py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-tripmancer-purple/10 to-tripmancer-blue/10 group-hover:from-tripmancer-purple/20 group-hover:to-tripmancer-blue/20 transition-all duration-200">
                        <link.icon className="h-5 w-5 sm:h-6 sm:w-6 text-tripmancer-purple-dark" />
                      </div>
                      <span className="font-medium text-base sm:text-lg">{link.label}</span>
                    </div>
                  </Link>
                ))}

                {user && (
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="block py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-tripmancer-purple/10 to-tripmancer-blue/10 group-hover:from-tripmancer-purple/20 group-hover:to-tripmancer-blue/20 transition-all duration-200">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-tripmancer-purple-dark" />
                      </div>
                      <span className="font-medium text-base sm:text-lg">My Trips</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* User Section */}
              <div className="mt-auto p-4 sm:p-6 border-t dark:border-gray-700 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 py-2">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-tripmancer-purple/20 dark:bg-purple-900/20 flex items-center justify-center">
                        <User size={20} className="sm:w-6 sm:h-6 text-tripmancer-purple-dark dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{user.email?.split("@")[0]}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 sm:py-4 text-base sm:text-lg"
                    >
                      <LogOut className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <Link to="/login" onClick={closeMobileMenu} className="block">
                      <Button variant="outline" className="w-full py-3 sm:py-4 text-base sm:text-lg">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={closeMobileMenu} className="block">
                      <Button className="w-full bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark py-3 sm:py-4 text-base sm:text-lg">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  )
}
