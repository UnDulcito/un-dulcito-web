"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link"; // IMPORTANTE: Importar Link

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  features?: string[];
  bestSellerOrder?: number;
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const q = query(
            collection(db, "products"), 
            where("isBestSeller", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
        
        // Ordenar manualmente
        data.sort((a, b) => (a.bestSellerOrder || 99) - (b.bestSellerOrder || 99));

        setProducts(data.slice(0, 4));
        
      } catch (error) {
        console.error("Error cargando best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) {
      return (
        <section id="favoritos" className="py-20 bg-cream-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                 <div className="animate-pulse flex space-x-4 justify-center">
                    <div className="h-64 w-64 bg-strawberry-milk/20 rounded-3xl"></div>
                    <div className="h-64 w-64 bg-strawberry-milk/20 rounded-3xl hidden md:block"></div>
                    <div className="h-64 w-64 bg-strawberry-milk/20 rounded-3xl hidden lg:block"></div>
                 </div>
                 <p className="mt-4 text-deep-rose font-bold">Buscando los favoritos...</p>
            </div>
        </section>
      );
  }

  // Si no hay productos, no renderizamos nada
  if (products.length === 0) return null;

  return (
    <section id="favoritos" className="py-20 bg-cream-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-strawberry-milk/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-soft-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-deep-rose font-bold uppercase tracking-widest text-sm animate-fade-in">
            Los Favoritos de Todos
          </span>
          <h2 className="text-4xl md:text-5xl font-script text-warm-charcoal mt-2 mb-6 animate-fade-in delay-100">
            Los Más Pedidos
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in delay-200">
            Estas son las estrellas de la casa. Si no sabes qué pedir, con estos nunca fallas. 
            ¡Corre que se acaban! 🏃‍♀️💨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
             <ProductCard 
                key={product.id} 
                {...product} 
             />
          ))}
        </div>

        {/* BOTÓN VER CATÁLOGO COMPLETO (AÑADIDO) */}
        <div className="mt-16 text-center animate-fade-in-up delay-300">
            <Link 
              href="/catalogo"
              className="inline-block px-10 py-4 bg-transparent border-2 border-deep-rose text-deep-rose rounded-full font-bold text-lg hover:bg-deep-rose hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              Ver Menú Completo 🧁
            </Link>
        </div>
      </div>
    </section>
  );
}