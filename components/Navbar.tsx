"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext"; // Importamos el contexto
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  // CORRECCIÓN AQUÍ: Usamos 'openCart' que es como se llama en tu archivo
  const { cartCount, openCart } = useCart(); 
  
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función de navegación inteligente
  const handleNavigation = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    
    if (targetId === "catalogo") {
      router.push("/catalogo");
      return;
    }

    if (pathname === "/") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${targetId}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link 
            href="/" 
            onClick={(e) => handleNavigation(e, "inicio")}
            className="text-2xl md:text-3xl font-script text-deep-rose cursor-pointer"
        >
          Un Dulcito
        </Link>

        {/* MENÚ CENTRAL */}
        <div className="hidden md:flex gap-8 items-center">
          <button onClick={(e) => handleNavigation(e, "inicio")} className={`font-bold transition-colors ${isScrolled ? "text-warm-charcoal hover:text-deep-rose" : "text-deep-rose hover:text-rose"}`}>Home</button>
          <button onClick={(e) => handleNavigation(e, "catalogo")} className={`font-bold transition-colors ${isScrolled ? "text-warm-charcoal hover:text-deep-rose" : "text-deep-rose hover:text-rose"}`}>Catálogo</button>
          <button onClick={(e) => handleNavigation(e, "historia")} className={`font-bold transition-colors ${isScrolled ? "text-warm-charcoal hover:text-deep-rose" : "text-deep-rose hover:text-rose"}`}>Historia</button>
          <button onClick={(e) => handleNavigation(e, "contacto")} className={`font-bold transition-colors ${isScrolled ? "text-warm-charcoal hover:text-deep-rose" : "text-deep-rose hover:text-rose"}`}>Contacto</button>
        </div>

        {/* BOTÓN DEL CARRITO */}
        <button
          onClick={openCart} // <--- CORRECCIÓN AQUÍ: Llamamos a la función correcta
          className="relative p-2 hover:bg-strawberry-milk/20 rounded-full transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-7 h-7 ${isScrolled ? "text-warm-charcoal" : "text-deep-rose"}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-0 right-0 bg-deep-rose text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </nav>
  );
}