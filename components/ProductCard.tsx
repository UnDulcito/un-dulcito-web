"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductModal from "./ProductModal"; // Asegúrate de tener este componente

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  features?: string[];
}

export default function ProductCard(props: ProductCardProps) {
  const { id, name, price, image, category } = props;
  const { addToCart, openCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    // Evitamos que al dar click en añadir al carrito se abra el modal también
    e?.stopPropagation();

    const cartId = typeof id === 'string' ? new Date().getTime() + Math.random() : id;

    addToCart({ 
        id: cartId as number,
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
    <>
      <div 
        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-strawberry-milk/30 flex flex-col h-full"
      >
        {/* IMAGEN: Ahora tiene cursor-pointer y abre el modal */}
        <div 
            className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => setShowModal(true)}
        >
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
          <div className="flex-1 cursor-pointer" onClick={() => setShowModal(true)}>
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
              className="bg-warm-charcoal text-white p-3 rounded-full hover:bg-deep-rose transition-colors shadow-md hover:shadow-lg active:scale-95 group/btn z-10"
              title="Añadir al carrito"
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

      {/* MODAL */}
      <ProductModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        product={props} 
      />
    </>
  );
}