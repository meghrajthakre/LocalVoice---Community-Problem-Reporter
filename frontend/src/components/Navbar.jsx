import { Globe } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white shadow">
      
      <div className="flex items-center gap-2 text-xl font-bold text-blue-700">
        <span className="text-2xl">LV</span> LocalVoice
      </div>

      <div className="flex items-center gap-8">
        <a className="font-medium text-gray-700">Services</a>
        <a className="font-medium text-gray-700">Resources</a>

        <div className="flex items-center gap-2 border px-3 py-1 rounded">
          <Globe size={16}/>
          English
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Report an Issue
        </button>
      </div>

    </div>
  );
};

export default Navbar;

