"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; // <-- 1. Importamos la fiesta

export default function CartDrawer() {
  const { items, removeFromCart, total, isOpen, closeCart } = useCart();

  const PHONE_NUMBER = "584121289510"; 

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
        document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    // 2. DISPARAMOS EL CONFETI 🎊
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Confeti desde la izquierda y derecha
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // 3. Preparamos el mensaje de WhatsApp
    let message = "¡Hola Un Dulcito! 🧁\nQuisiera realizar el siguiente pedido:\n\n";
    items.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*TOTAL A PAGAR: $${total.toFixed(2)}*`;
    message += "\n\nQuedo atento para coordinar el pago y la entrega. ¡Gracias!";
    
    // Pequeño delay de 1 segundo para que disfrute el confeti antes de irse
    setTimeout(() => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-warm-charcoal/40 backdrop-blur-sm z-40"
            onClick={closeCart}
          />

          {/* CAJÓN DESLIZANTE */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* CABECERA */}
            <div className="p-6 flex justify-between items-center border-b border-strawberry-milk/30 bg-cream-white">
              <h2 className="text-2xl font-script text-deep-rose">Tu Pedido Dulce</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-strawberry-milk/20 rounded-full transition-colors group"
              >
                <svg className="w-6 h-6 text-warm-charcoal group-hover:text-deep-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 absolute inset-0 p-6"
                  >
                    <span className="text-6xl">🧁</span>
                    <p className="text-lg font-medium text-warm-charcoal">Tu carrito está vacío...</p>
                    <button onClick={closeCart} className="text-deep-rose font-bold hover:underline">
                      ¡Vamos a llenarlo!
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -150, transition: { duration: 0.2 } }} 
                      className="flex gap-4 items-center bg-cream-white/30 p-3 rounded-2xl border border-transparent hover:border-strawberry-milk/50 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-warm-charcoal text-lg font-sans">{item.name}</h4>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        <p className="text-deep-rose font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-rose/70 hover:text-deep-rose hover:bg-strawberry-milk/20 rounded-full transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* PIE DE PÁGINA */}
            {items.length > 0 && (
                <div className="p-6 border-t border-strawberry-milk/30 bg-cream-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-bold text-warm-charcoal">Total Estimado</span>
                        <motion.span 
                          key={total}
                          initial={{ scale: 1.5, color: "#25D366" }}
                          animate={{ scale: 1, color: "#D45D79" }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          className="text-3xl font-script text-deep-rose block"
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCheckout}
                        className="w-full py-4 bg-[#25D366] text-white rounded-full font-bold shadow-lg hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Pedir por WhatsApp
                        </span>
                    </motion.button>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}