"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-white flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      
      {/* CÍRCULO DECORATIVO DE FONDO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-strawberry-milk/20 rounded-full blur-3xl -z-0 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {/* EMOJI GIGANTE ANIMADO */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-9xl mb-4 block"
        >
          🍪💔
        </motion.div>

        {/* TÍTULO DRAMÁTICO */}
        <h1 className="text-8xl font-script text-deep-rose mb-2">
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-bold text-warm-charcoal mb-6">
          ¡Ups! Se nos quemó el pastel...
        </h2>
        
        <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
          La página que buscas no existe, se la comió nuestro perro o está en el horno todavía.
        </p>

        {/* BOTÓN DE RESCATE */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-deep-rose text-white rounded-full font-bold shadow-lg hover:bg-rose hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver a lo Dulce
        </Link>
      </motion.div>

      {/* FOOTER PEQUEÑO */}
      <div className="absolute bottom-10 text-sm text-gray-400">
        Error 404 | Un Dulcito
      </div>
    </div>
  );
}