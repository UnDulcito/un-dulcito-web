"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number | string;
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string; // Ahora recibimos esto
    features?: string[];  // Y esto
  };
  onAddToCart: () => void;
}

export default function ProductModal({ isOpen, onClose, product, onAddToCart }: ProductModalProps) {
  if (!isOpen) return null;

  // Valores por defecto por si el producto es viejo y no tiene estos datos
  const description = product.description || "Una explosión de sabor artesanal. Elaborado con ingredientes seleccionados, sin conservantes y con el toque secreto de la casa.";
  
  const features = product.features || [
    "100% Natural",
    "Hecho en Casa",
    "Calidad Premium",
    "Delivery Disponible"
  ];

  // Iconos fijos para mantener el diseño, pero el texto cambia
  const icons = ["🌿", "🏠", "⭐", "🚚"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-warm-charcoal/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden pointer-events-auto flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Lado Izquierdo: Imagen */}
              <div className="md:w-1/2 relative bg-gray-100 h-64 md:h-auto">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={onClose}
                  className="absolute top-4 left-4 bg-white/80 p-2 rounded-full md:hidden"
                >
                  <svg className="w-6 h-6 text-warm-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Lado Derecho: Info */}
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-rose font-bold uppercase tracking-widest text-xs">
                    {product.category}
                  </span>
                  <button onClick={onClose} className="hidden md:block hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h2 className="text-3xl md:text-4xl font-sans font-bold text-warm-charcoal mb-4">
                  {product.name}
                </h2>
                
                <p className="text-deep-rose font-extrabold text-3xl mb-6">
                  €{product.price.toFixed(2)}
                </p>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {description}
                </p>

                {/* Características Dinámicas */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="text-xl">{icons[index] || "✨"}</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    onAddToCart();
                    onClose();
                  }}
                  className="w-full bg-deep-rose text-white font-bold py-4 rounded-xl shadow-lg hover:bg-rose hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Añadir al Carrito - €{product.price.toFixed(2)}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}