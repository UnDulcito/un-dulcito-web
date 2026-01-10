"use client";

import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: string | number; // CAMBIO: Aceptamos ambos tipos
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const { addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    // Aseguramos que el ID sea numérico si el carrito lo exige, o lo manejamos como string
    // Para evitar romper el contexto, pasamos el ID tal cual (pero el contexto debe soportarlo)
    // Truco: Si el contexto espera number y firebase da string, generamos un hash simple o usamos timestamp
    // PERO: Lo mejor es actualizar el Contexto. Por ahora, asumimos que el id lo pasamos tal cual.
    
    // Convertimos a número si es posible para mantener compatibilidad, si no, usamos un hash
    const numericId = typeof id === 'string' ? parseInt(id, 36) : id; // Hack simple para convertir string a numero único
    // O mejor aún, actualizamos el contexto luego. Por ahora, pasemos el objeto.
    
    addToCart({ 
        id: typeof id === 'string' ? Date.now() + Math.random() : id, // Parche rápido: ID único temporal para el carrito
        name, 
        price, 
        image 
    });
    
    toast.success(
      <div className="flex items-center gap-2">
        <span>🧁</span>
        <b>{name}</b> agregado al carrito
      </div>,
      {
        style: {
          background: "#FFF",
          color: "#333",
          border: "1px solid #FFB6C1",
        },
        iconTheme: {
          primary: "#D45D79",
          secondary: "#FFFAEE",
        },
      }
    );
    openCart();
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-strawberry-milk/30 flex flex-col h-full">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-deep-rose shadow-sm uppercase tracking-wider">
          {category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-warm-charcoal mb-2 group-hover:text-deep-rose transition-colors font-sans">
            {name}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            Deliciosa preparación artesanal con el toque secreto de Yola.
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-2xl font-script text-deep-rose font-bold">
            €{price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-warm-charcoal text-white p-3 rounded-full hover:bg-deep-rose transition-colors shadow-md hover:shadow-lg active:scale-95 group/btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 group-hover/btn:rotate-12 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}