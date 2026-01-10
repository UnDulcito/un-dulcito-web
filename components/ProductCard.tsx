"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import ProductModal from "./ProductModal";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Actualizamos la interfaz para recibir los nuevos datos opcionales
interface ProductProps {
  id: number; // O string, dependiendo de cómo manejes el ID en el resto de la app
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string; // Nuevo
  features?: string[];  // Nuevo
}

export default function ProductCard(product: ProductProps) {
  const { id, name, price, category, image } = product;
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
    toast.success(`¡${name} añadido al carrito! 🧁`, {
      duration: 2000,
      position: "bottom-center",
    });
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -10 }} 
        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col"
      >
        <div 
          className="relative h-64 overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {/* Badge opcional si es nuevo (podrías lógica para esto luego) */}
          <span className="absolute top-4 left-4 z-10 bg-white/90 text-deep-rose text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Fresco
          </span>
          
          <motion.img
            whileHover={{ scale: 1.1 }} 
            transition={{ duration: 0.6 }}
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute -bottom-12 left-0 w-full p-4 transition-all duration-300 group-hover:bottom-0">
              <motion.button 
                  whileTap={{ scale: 0.9 }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className="w-full bg-deep-rose text-white font-bold py-3 rounded-xl shadow-lg hover:bg-rose transition-colors cursor-pointer"
              >
                  Añadir al Carrito
              </motion.button>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <p className="text-rose text-xs font-bold uppercase tracking-widest mb-2">
            {category}
          </p>
          <h3 
            className="text-warm-charcoal font-bold text-xl mb-2 font-sans cursor-pointer hover:text-deep-rose transition-colors leading-tight"
            onClick={() => setIsModalOpen(true)}
          >
            {name}
          </h3>
          <div className="mt-auto pt-2">
            <p className="text-deep-rose font-extrabold text-2xl">
                ${price.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Al abrir el modal, le pasamos TODOS los datos del producto (incluyendo description y features) */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product} 
        onAddToCart={handleAddToCart}
      />
    </>
  );
}