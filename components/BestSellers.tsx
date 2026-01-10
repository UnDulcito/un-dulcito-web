"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  features?: string[];
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Traemos hasta 20 productos para tener variedad al elegir al azar
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(20));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Lógica: Mezclar (Shuffle) y tomar 5
      if (fetchedProducts.length > 0) {
        fetchedProducts = fetchedProducts.sort(() => 0.5 - Math.random()).slice(0, 5);
      }

      setProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    // Agregamos el ID para que el Hero pueda hacer scroll hasta aquí
    <section id="favoritos" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-script text-deep-rose mb-4">
          Nuestras Creaciones
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Los favoritos de la casa. Una selección aleatoria de lo que está saliendo del horno hoy.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-rose mx-auto mb-4"></div>
           <p className="text-gray-400">Consultando el horno...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 place-items-center">
          {products.map((product) => (
            <div key={product.id} className="w-full max-w-[280px]">
              <ProductCard 
                id={product.id as any}
                name={product.name}
                price={product.price}
                category={product.category}
                image={product.image}
                description={product.description}
                features={product.features}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
           <span className="text-5xl block mb-2">🧁</span>
           <p className="text-gray-500">Aún no hay productos destacados.</p>
        </div>
      )}

      {/* Botón para ver catálogo completo */}
      <div className="mt-16 text-center">
        <Link 
          href="/catalogo"
          className="inline-flex items-center gap-2 px-8 py-4 bg-warm-charcoal text-white rounded-full font-bold shadow-lg hover:bg-black transition-all group"
        >
          Ver Catálogo Completo
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}