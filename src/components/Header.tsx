import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { fetchData } from "@/utils/commonFunction";
import { BACKEND_API_URL } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Clear token immediately to prevent issues
      localStorage.removeItem("token");

      // Attempt to call backend logout endpoint
      const response = await fetchData("get", `${BACKEND_API_URL}/auth/logout`);

      if (response.status === 200) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", response.data);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if backend logout fails, we've already cleared the token
    }

    // Always navigate to landing page regardless of backend response
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-brand-dark/60 fixed top-0 z-5 w-full backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h1 className="text-2xl font-bold text-white">FemFit</h1>
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              className="rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={toggleDropdown}
            >
              <User className="h-6 w-6" />
            </Button>

            {/* Profile dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right overflow-hidden rounded-md bg-white shadow-lg">
                <div className="py-2">
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
