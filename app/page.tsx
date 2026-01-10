import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import Reviews from "@/components/Reviews";
import About from "@/components/About";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-white">
      {/* 1. Portada (Mantiene tu foto de la torta original) */}
      <Hero />
      
      {/* 2. Productos Destacados (Ahora con lógica Real) */}
      <BestSellers />

      {/* 3. Reseñas (Ahora con lógica Real) */}
      <Reviews />

      {/* 4. Historia (Restaurada) */}
      <About />
    </main>
  );
}