import { motion } from "framer-motion";

const ElegantSpinner = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Main Spinning Glowing Orb */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer Glow Ring */}
        <div className="absolute w-20 h-20 border-4 border-transparent rounded-full animate-spin bg-customDarkBlue shadow-lg shadow-blue-500/50"></div>

        {/* Inner Core Pulse */}
        <div className="absolute w-10 h-10 bg-white rounded-full shadow-lg shadow-blue-500/50 animate-ping"></div>

        {/* Small Orbiting Balls */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-md"
            animate={{
              x: [0, Math.sin((i * Math.PI) / 2) * 30, 0],
              y: [0, Math.cos((i * Math.PI) / 2) * 30, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Inner Ring with Smooth Spin */}
        <div className="w-full h-full border-4 border-transparent border-t-blue-400 rounded-full animate-spin-slow"></div>
      </div>

      {/* Smooth Animated Text */}
      <motion.p
        className="text-white mt-4 font-semibold text-lg"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        Processing
        <span className="inline-block">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="text-white text-lg"
              animate={{
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              .
            </motion.span>
          ))}
        </span>
      </motion.p>
    </div>
  );
};

export default ElegantSpinner;
