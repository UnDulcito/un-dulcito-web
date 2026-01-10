"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, onSnapshot } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  features?: string[];
}

interface Category {
  id: string;
  name: string;
}

export default function Catalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // Categorías dinámicas
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // 1. Cargar Categorías y Productos en tiempo real
  useEffect(() => {
    // Escuchar Categorías
    const qCategories = query(collection(db, "categories"), orderBy("name"));
    const unsubscribeCats = onSnapshot(qCategories, (snapshot) => {
      const catsData = snapshot.docs.map(doc => doc.data().name);
      // Siempre añadimos "Todos" al principio
      setCategories(["Todos", ...catsData]);
    });

    // Escuchar Productos
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeProds = onSnapshot(qProducts, (snapshot) => {
      const prodsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(prodsData);
      setLoading(false);
    });

    return () => {
      unsubscribeCats();
      unsubscribeProds();
    };
  }, []);

  // 2. Filtrar productos según la pestaña activa
  const filteredProducts = activeCategory === "Todos"
    ? products
    : products.filter((product) => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-cream-white pt-24 pb-12">
      {/* Encabezado */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-script text-deep-rose mb-4 animate-fade-in-up">
          Nuestro Menú
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto animate-fade-in-up delay-100">
          Explora nuestra selección de postres artesanales. Cada uno preparado con dedicación para endulzar tu día.
        </p>
      </div>

      {/* Pestañas de Categorías Dinámicas */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
          {loading ? (
            // Skeleton loader para las pestañas
            [1, 2, 3, 4].map((i) => (
               <div key={i} className="h-10 w-24 bg-strawberry-milk/20 rounded-full animate-pulse"></div>
            ))
          ) : (
            categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-sm border ${
                  activeCategory === cat
                    ? "bg-deep-rose text-white border-deep-rose scale-105"
                    : "bg-white text-gray-500 border-transparent hover:border-strawberry-milk hover:text-deep-rose"
                }`}
              >
                {cat}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Rejilla de Productos */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1,2,3,4].map(i => (
                 <div key={i} className="bg-white h-96 rounded-3xl animate-pulse"></div>
             ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 opacity-60">
            <span className="text-6xl block mb-4">🍪❓</span>
            <p className="text-xl text-warm-charcoal">No hay productos en esta categoría por ahora.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}