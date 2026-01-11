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
  stock?: number; // Añadido
}

export default function Catalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar Categorías
    const qCategories = query(collection(db, "categories"), orderBy("name"));
    const unsubscribeCats = onSnapshot(qCategories, (snapshot) => {
      const catsData = snapshot.docs.map(doc => doc.data().name);
      setCategories(["Todos", ...catsData]);
    });

    // Escuchar Productos
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeProds = onSnapshot(qProducts, (snapshot) => {
      const prodsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      
      // FILTRO MAESTRO: Solo mostramos lo que tiene stock > 0
      // (Opcional: Si quieres mostrar "Agotado" en vez de ocultarlo, quita el .filter)
      // El requerimiento decía "que no aparezca en el catálogo".
      const availableProducts = prodsData.filter(p => (p.stock || 0) > 0);
      
      setProducts(availableProducts);
      setLoading(false);
    });

    return () => {
      unsubscribeCats();
      unsubscribeProds();
    };
  }, []);

  const filteredProducts = activeCategory === "Todos"
    ? products
    : products.filter((product) => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-cream-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-script text-deep-rose mb-4 animate-fade-in-up">
          Nuestro Menú
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto animate-fade-in-up delay-100">
          Explora nuestra selección. Solo mostramos lo que está recién salido del horno.
        </p>
      </div>

      {/* Pestañas */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
          {loading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-10 w-24 bg-strawberry-milk/20 rounded-full animate-pulse"></div>)
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

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1,2,3,4].map(i => <div key={i} className="bg-white h-96 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 opacity-60">
            <span className="text-6xl block mb-4">🍪💤</span>
            <p className="text-xl text-warm-charcoal">¡Vaya! Se agotó todo en esta categoría.</p>
            <p className="text-deep-rose">Vuelve pronto, Yola está horneando más.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                // Aseguramos que el stock pase, o 0 si no existe
                stock={product.stock || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}