"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Bloquear el scroll al iniciar
    document.body.style.overflow = "hidden";

    // 2. Esperar 2.5 segundos (tiempo suficiente para el efecto drama)
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset"; // Desbloquear scroll
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cream-white"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }} // EL TELÓN SUBE
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Curva de animación elegante
        >
          {/* EL CONTENIDO DEL PRELOADER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center"
          >
            {/* ICONO QUE LATE */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-6xl md:text-8xl mb-6"
            >
              🧁
            </motion.div>

            {/* TEXTO ELEGANTE */}
            <h1 className="text-deep-rose font-script text-5xl md:text-6xl mb-4">
              Un Dulcito
            </h1>
            
            {/* BARRA DE CARGA FALSA */}
            <div className="w-48 h-1 bg-strawberry-milk/30 rounded-full mx-auto overflow-hidden">
                <motion.div 
                    className="h-full bg-deep-rose"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                />
            </div>
            
            <p className="text-warm-charcoal mt-4 text-sm tracking-widest uppercase animate-pulse">
              Horneando dulzura...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}