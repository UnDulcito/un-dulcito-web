"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// 1. ACTUALIZAMOS LA INTERFAZ AQUÍ
interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  features?: string[];
  stock?: number; // <--- ¡ESTO FALTABA! Agregado para que no de error
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: () => void; // Recordamos que esto es obligatorio ahora
}

export default function ProductModal({ isOpen, onClose, product, onAddToCart }: ProductModalProps) {
  
  // Lógica para cerrar si stock es 0 (seguridad extra)
  const isOutOfStock = (product.stock || 0) === 0;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all relative">
                
                {/* Botón Cerrar */}
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Imagen */}
                  <div className="h-64 md:h-full bg-gray-100 relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold rotate-12 border-2 border-white shadow-lg">AGOTADO</span>
                        </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-deep-rose uppercase tracking-wider bg-rose-50 px-2 py-1 rounded-md">
                            {product.category}
                         </span>
                         {/* Mostrar Stock en el Modal también */}
                         {(product.stock || 0) > 0 && (product.stock || 0) < 10 && (
                             <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                                ¡Quedan {product.stock}!
                             </span>
                         )}
                      </div>
                      
                      <Dialog.Title
                        as="h3"
                        className="text-2xl md:text-3xl font-bold text-warm-charcoal mb-4 font-script"
                      >
                        {product.name}
                      </Dialog.Title>
                      
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {product.description || "Una deliciosa creación artesanal hecha con los mejores ingredientes y mucho amor. Perfecta para endulzar tu día."}
                      </p>

                      {/* Características */}
                      <div className="space-y-2 mb-8">
                        {(product.features || ["Hecho en casa", "Ingredientes Premium"]).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer con Precio y Botón */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Precio</span>
                        <span className="text-3xl font-bold text-deep-rose font-script">
                          €{product.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                            if (!isOutOfStock) {
                                onAddToCart();
                                onClose(); // Cerramos al agregar
                            }
                        }}
                        disabled={isOutOfStock}
                        className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                            isOutOfStock 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-warm-charcoal text-white hover:bg-deep-rose hover:shadow-xl'
                        }`}
                      >
                        {isOutOfStock ? (
                            "Agotado"
                        ) : (
                            <>
                                <span>Agregar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}