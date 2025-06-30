import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  return (
    <header className="bg-brand-dark/60 fixed top-0 z-5 w-full backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h1 className="text-2xl font-bold text-white">FemFit</h1>
        <div className="flex items-center gap-2">
          <div className="group relative">
            <Button
              variant="ghost"
              className="rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <User className="h-6 w-6" />
            </Button>

            {/* Profile dropdown menu */}
            <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right scale-95 overflow-hidden rounded-md bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
              <div className="py-2">
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                  // onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
