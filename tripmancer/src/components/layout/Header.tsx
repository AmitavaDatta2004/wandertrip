import { Link } from "react-router-dom"
import { Globe } from "lucide-react"
import { Navigation } from "./Navigation"
import { ThemeToggle } from "./ThemeToggle"

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/95 dark:border-gray-800/40 transition-all duration-200">
      <div className="container flex h-14 sm:h-16 lg:h-18 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo Section - Responsive sizing */}
        <Link
          to="/"
          className="flex items-center space-x-2 sm:space-x-3 mr-4 sm:mr-6 lg:mr-8 group transition-all duration-200 hover:scale-105"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-tripmancer-purple to-tripmancer-blue-dark flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
            <Globe className="h-4 w-4 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
          </div>
          <span className="font-bold text-base sm:text-xl lg:text-2xl font-poppins bg-gradient-to-r from-tripmancer-purple-dark to-tripmancer-blue-dark bg-clip-text text-transparent">
            <span className="xs:inline">TripMancer</span>
            {/* <span className="xs:hidden">TM</span> */}
          </span>
        </Link>

        {/* Flexible spacer */}
        <div className="flex-1 min-w-0"></div>

        {/* Navigation and Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          <Navigation />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          {/* Mobile theme toggle */}
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
