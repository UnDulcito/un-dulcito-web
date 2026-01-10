"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";

interface Product {
  id: string; // Cambio a string porque Firebase usa IDs de texto
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
    const fetchBestSellers = async () => {
      try {
        // Consultamos productos marcados como Best Seller y ordenados por su número de orden
        const q = query(
            collection(db, "products"), 
            where("isBestSeller", "==", true),
            orderBy("bestSellerOrder", "asc"),
            limit(4) // Máximo 4 para no saturar el home
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
        
        setProducts(data);
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

  // Si Yola no ha configurado ninguno, mostramos mensaje o nada
  if (products.length === 0) return null;

  return (
    <section id="favoritos" className="py-20 bg-cream-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
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
          {products.map((product, index) => (
             // Pasamos el ID como número si es posible, o adaptamos ProductCard para aceptar string
             // Como solución rápida, hacemos un cast seguro, o ProductCard debe aceptar string en ID.
             // Nota: En Next.js con Firebase, los IDs son strings. Asegúrate que ProductCard lo acepte.
             // Si ProductCard espera number, tendrás que cambiarlo allí también.
             // Asumo que ProductCard ya lo maneja o que editamos ProductCard para aceptar string | number.
             <ProductCard 
                key={product.id} 
                {...product} 
                id={product.id as any} // Parche temporal si ProductCard es estricto con number
             />
          ))}
        </div>
      </div>
    </section>
  );
}