"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase"; 
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// Definimos la estructura completa del producto (igual que en Firebase)
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string; // Nuevo campo opcional
  features?: string[];  // Nuevo campo opcional
}

interface Category {
  id: string;
  name: string;
}

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estados de Datos
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [loading, setLoading] = useState(true);

  // 1. CONEXIÓN A FIREBASE (Tiempo Real)
  useEffect(() => {
    // A. Escuchar Productos
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    });

    // B. Escuchar Categorías
    const qCategories = query(collection(db, "categories"), orderBy("name"));
    const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
      const dbCats = snapshot.docs.map(doc => doc.data().name);
      
      // Categorías fijas + dinámicas
      const defaultCats = ["Cupcakes", "Tortas", "Macarons", "Galletas", "Donuts"];
      const uniqueCats = Array.from(new Set(["Todos", ...defaultCats, ...dbCats]));
      
      setCategories(uniqueCats);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  // 2. LÓGICA DE FILTRADO
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-cream-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl text-deep-rose font-script mb-6 drop-shadow-sm">
            Menú Dulce
          </h1>
          <p className="text-warm-charcoal text-xl max-w-2xl mx-auto mb-8">
            Explora nuestra colección completa de tentaciones.
          </p>

          {/* BUSCADOR */}
          <div className="max-w-md mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-deep-rose transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                type="text"
                placeholder="¿Qué se te antoja hoy?..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-strawberry-milk/30 bg-white focus:outline-none focus:border-deep-rose focus:ring-4 focus:ring-strawberry-milk/20 transition-all shadow-sm text-warm-charcoal placeholder-gray-400"
            />
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-deep-rose"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
          </div>
        </motion.div>

        {/* FILTROS */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-6 py-2 rounded-full font-bold transition-colors duration-300 ${
                selectedCategory === cat ? "text-white" : "text-warm-charcoal hover:bg-strawberry-milk/50"
              }`}
            >
              {selectedCategory === cat && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-deep-rose rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* GRILLA DE PRODUCTOS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white h-80 rounded-3xl animate-pulse bg-strawberry-milk/20"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            <AnimatePresence mode="popLayout"> 
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* AQUÍ PASAMOS TODOS LOS DATOS NUEVOS */}
                    <ProductCard 
                        id={product.id as any}
                        name={product.name}
                        price={product.price}
                        category={product.category}
                        image={product.image}
                        description={product.description} // Pasamos la descripción
                        features={product.features}       // Pasamos los iconos
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full text-center py-20"
                >
                  <span className="text-6xl block mb-4">🍪❓</span>
                  <p className="text-2xl text-warm-charcoal font-bold">Ups, no encontramos nada aquí</p>
                  <button 
                      onClick={() => {setSearchQuery(""); setSelectedCategory("Todos")}}
                      className="mt-4 text-deep-rose font-bold hover:underline"
                  >
                      Ver todo el menú
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </main>
  );
}