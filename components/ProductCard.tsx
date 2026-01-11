"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductModal from "./ProductModal"; 

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  features?: string[];
  stock?: number; 
}

export default function ProductCard(props: ProductCardProps) {
  const { id, name, price, image, category, stock = 0 } = props;
  const { addToCart, items } = useCart();
  const [showModal, setShowModal] = useState(false);

  // Cuántos tenemos ya en el carrito
  const cartItem = items.find((item) => item.id === id);
  const currentQty = cartItem ? cartItem.quantity : 0;
  
  // ¿Está agotado?
  const isOutOfStock = stock === 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Que no abra el modal si le damos al botón

    // VALIDACIÓN ESTRICTA VISIBLE
    if (currentQty >= stock) {
        toast.error(`¡Ups! Solo nos quedan ${stock} unidades de ${name} 😅`, {
            style: {
                background: '#FFE5E5',
                color: '#D8000C',
                border: '1px solid #D8000C'
            },
            icon: '🛑'
        });
        return;
    }

    addToCart({ 
        id: id, 
        name, 
        price, 
        image,
        stock 
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
    
    if (showModal) setShowModal(false);
  };

  return (
    <>
      <div 
        className={`bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 group border border-transparent flex flex-col h-full relative ${
            isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-2xl hover:border-strawberry-milk/30'
        }`}
      >
        <div 
            className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => !isOutOfStock && setShowModal(true)}
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-deep-rose shadow-sm uppercase tracking-wider">
            {category}
          </div>
          
          {/* ETIQUETA DE STOCK VISIBLE PARA EL CLIENTE */}
          {!isOutOfStock && (
             <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm border border-white/20">
                📦 Stock: {stock}
             </div>
          )}

          {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold rotate-12 border-4 border-white shadow-xl text-lg">
                      AGOTADO
                  </span>
              </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 cursor-pointer" onClick={() => !isOutOfStock && setShowModal(true)}>
            <h3 className="text-xl font-bold text-warm-charcoal mb-2 group-hover:text-deep-rose transition-colors font-sans">
              {name}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {props.description || "Deliciosa preparación artesanal con el toque secreto de Yola."}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-2xl font-script text-deep-rose font-bold">
              €{price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-3 rounded-full transition-colors shadow-md flex items-center justify-center relative ${
                  isOutOfStock
                  ? 'bg-gray-200 cursor-not-allowed text-gray-400' 
                  : 'bg-warm-charcoal text-white hover:bg-deep-rose hover:shadow-lg active:scale-95'
              }`}
              title={isOutOfStock ? "Agotado" : `Añadir al carrito (Quedan ${stock})`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
          </div>
        </div>
      </div>

      {!isOutOfStock && (
          <ProductModal 
            isOpen={showModal} 
            onClose={() => setShowModal(false)} 
            product={{...props, stock}} 
            onAddToCart={() => handleAddToCart()} 
          />
      )}
    </>
  );
}