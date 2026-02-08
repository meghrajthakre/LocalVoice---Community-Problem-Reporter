import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      
      {/* background grid lines */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* blur circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-blue-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-purple-100 rounded-full blur-3xl opacity-30"></div>

      {/* content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* left content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            >
              Connecting Citizens.
              <span className="text-blue-600 block mt-2">
                Improving Communities
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 text-gray-600 text-lg max-w-lg"
            >
              A unified digital platform for civic engagement and public service 
              requests. Report issues, track progress, and make your city better 
              with LocalVoice.
            </motion.p>

            {/* buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md transition">
                Report Issue
                <ArrowRight size={18} />
              </button>

              <button className="border border-gray-300 hover:border-blue-600 px-6 py-3 rounded-xl font-semibold text-gray-700 hover:text-blue-600 transition">
                Track Requests
              </button>
            </motion.div>
          </div>

          {/* right side card UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 w-full max-w-md ml-auto">
              <h3 className="font-semibold text-gray-800 mb-4">
                Live Complaints
              </h3>

              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-gray-50 border">
                  🕳️ Pothole on College Road
                  <span className="block text-xs text-blue-600 mt-1">
                    In Progress
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border">
                  💡 Street light not working
                  <span className="block text-xs text-yellow-600 mt-1">
                    Pending
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border">
                  🚯 Garbage not collected
                  <span className="block text-xs text-green-600 mt-1">
                    Resolved
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
