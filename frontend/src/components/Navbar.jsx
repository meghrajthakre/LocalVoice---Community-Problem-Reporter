import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-indigo-600 text-xl cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
              LV
            </div>
            <span className="tracking-tight">LocalVoice</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a className="font-medium text-gray-700 hover:text-indigo-600 transition">
              Services
            </a>
            <a className="font-medium text-gray-700 hover:text-indigo-600 transition">
              Resources
            </a>

            {/* Language */}
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <Globe size={16} />
              <span className="text-sm font-medium">English</span>
            </div>

            {/* Button */}
            <button className="bg-indigo-600 hover:bg-green-700 cursor-pointer transition text-white px-5 py-2 rounded-lg font-medium shadow-md">
              Report Issue
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)}>
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-5 space-y-4 shadow-lg">
          <a className="block font-medium text-gray-700 hover:text-indigo-600">
            Services
          </a>

          <a className="block font-medium text-gray-700 hover:text-indigo-600">
            Resources
          </a>

          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg w-fit">
            <Globe size={16} />
            English
          </div>

          <button className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium shadow">
            Report Issue
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
