"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; 

export default function CartDrawer() {
  const { items, removeFromCart, total, isOpen, closeCart, clearCart } = useCart();
  const [bcvRate, setBcvRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  useEffect(() => {
    if (isOpen) {
        fetchBcvRate();
    }
  }, [isOpen]);

  const fetchBcvRate = async () => {
    try {
        setLoadingRate(true);
        const res = await fetch("/api/bcv");
        const data = await res.json();
        if (data.rate) {
            setBcvRate(data.rate);
        }
    } catch (error) {
        console.error("Error obteniendo BCV");
    } finally {
        setLoadingRate(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D45D79', '#FFD1DC', '#FFD700'] 
    });

    // Encabezado formal sin emojis
    let message = "Hola Un Dulcito! \nQuisiera realizar el siguiente pedido:\n\n";
    
    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*TOTAL A PAGAR: €${total.toFixed(2)}*`;
    
    if (bcvRate) {
        message += `\n(Ref. BCV: Bs. ${(total * bcvRate).toFixed(2)})`;
    }
    
    message += "\n\nQuedo atento para coordinar el pago y la entrega. Gracias!";

    const encodedMessage = encodeURIComponent(message);
    
    setTimeout(() => {
        window.open(`https://wa.me/584227186334?text=${encodedMessage}`, "_blank");
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-cream-white">
              <h2 className="text-2xl font-script text-deep-rose">Tu Pedido 🛒</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-strawberry-milk/20 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* CUERPO DEL CARRITO (ARREGLADO) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
              
              {/* MENSAJE DE VACÍO (Solo aparece si no hay items) */}
              {items.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-50 z-0">
                  <span className="text-6xl mb-4">🍪</span>
                  <p>Tu carrito está vacío.</p>
                  <button onClick={closeCart} className="mt-4 text-deep-rose font-bold hover:underline">
                    Ir al menú
                  </button>
                </div>
              )}

              {/* LISTA DE ITEMS (Siempre montada para permitir animaciones de salida) */}
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0, zIndex: 10 }} // zIndex alto para que pase por encima del mensaje de vacío
                    exit={{ opacity: 0, x: -100, zIndex: 10 }} // Se va a la izquierda
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex gap-4 items-center bg-white relative z-10"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-warm-charcoal text-sm">{item.name}</h3>
                      <p className="text-gray-500 text-xs">€{item.price.toFixed(2)} c/u</p>
                      <div className="flex items-center gap-3 mt-2 bg-gray-50 w-fit px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold text-deep-rose">Cant: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-warm-charcoal">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-400 hover:text-red-600 underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 relative z-20">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-xs text-gray-400 bg-white p-2 rounded-lg border border-gray-200">
                        <span>Tasa BCV (Euro):</span>
                        {loadingRate ? (
                            <span className="animate-pulse text-deep-rose">Consultando...</span>
                        ) : bcvRate ? (
                            <span className="font-mono font-bold text-warm-charcoal">{bcvRate.toFixed(2)} Bs/€</span>
                        ) : (
                            <span className="text-red-400">Sin conexión</span>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <span className="text-gray-500">Total Euros</span>
                        <span className="text-2xl font-bold text-warm-charcoal">€{total.toFixed(2)}</span>
                    </div>

                    {bcvRate && (
                        <div className="flex justify-between items-end text-deep-rose animate-fade-in-up">
                            <span className="font-bold text-sm">Total Bolívares</span>
                            <span className="text-xl font-bold">Bs. {(total * bcvRate).toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={clearCart}
                        className="px-4 py-3 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors font-bold text-sm"
                        title="Vaciar carrito"
                    >
                        🗑️
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Completar en WhatsApp</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}