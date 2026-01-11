"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { motion } from "framer-motion"; // <--- Importamos el motor de movimiento

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MANTENEMOS TU LÓGICA DE FIREBASE INTACTA
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Fondo Decorativo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-strawberry-milk/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-script text-deep-rose mb-12">
          Lo que dicen nuestros clientes
        </h2>

        {loading ? (
           <div className="h-40 flex items-center justify-center">
             <div className="animate-pulse text-gray-400">Cargando comentarios de los vecinos...</div>
           </div>
        ) : reviews.length > 0 ? (
          // --- HAY RESEÑAS: MOSTRAR CARRUSEL CON FRAMER MOTION ---
          <div className="relative w-full overflow-hidden mb-12 mask-linear-fade">
             {/* Sombras laterales para suavizar la entrada/salida */}
             <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
             <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

            <motion.div 
              className="flex gap-6 py-4 w-max"
              // LA MAGIA MATEMÁTICA:
              // Movemos desde 0% hasta -50% (porque la lista está duplicada).
              // Al llegar a -50%, la segunda mitad está exactamente donde empezó la primera.
              // El reset es instantáneo e invisible.
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 40, // Ajusta esto: Más alto = Más lento. 40s es elegante.
              }}
            >
              {/* Duplicamos la lista real para el efecto infinito */}
              {[...reviews, ...reviews].map((review, index) => (
                <div 
                  key={`${review.id}-${index}`}
                  className="inline-block w-[300px] md:w-[400px] bg-cream-white p-6 rounded-3xl border border-strawberry-milk/20 whitespace-normal text-left shadow-sm shrink-0"
                >
                  <div className="flex text-yellow-400 mb-3 text-lg">
                    {"★".repeat(review.rating)}
                    {"★".repeat(5 - review.rating).split("").map((_, i) => (
                        <span key={i} className="text-gray-200">★</span>
                    ))}
                  </div>
                  <p className="text-warm-charcoal mb-4 italic text-sm md:text-base line-clamp-3">
                    "{review.comment}"
                  </p>
                  <p className="font-bold text-deep-rose text-sm">
                    — {review.name}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          // --- NO HAY RESEÑAS: INVITACIÓN ---
          <div className="py-10 mb-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <span className="text-6xl block mb-4">🤐</span>
            <p className="text-xl text-gray-500 mb-2">Aún nadie ha dejado su opinión.</p>
            <p className="text-deep-rose font-bold text-lg">¡Dile a Yola que mande el link a sus tías!</p>
          </div>
        )}

        {/* BOTÓN PARA DEJAR RESEÑA */}
        <div>
          <Link 
            href="/dejar-resena"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-deep-rose text-deep-rose rounded-full font-bold hover:bg-deep-rose hover:text-white transition-all shadow-sm active:scale-95"
          >
            <span className="text-xl">✍️</span> Dejar una reseña
          </Link>
        </div>
      </div>
    </section>
  );
}