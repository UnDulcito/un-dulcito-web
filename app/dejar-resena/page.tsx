"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function LeaveReviewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0); // 0 a 5 estrellas
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para manejar las estrellas
  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || rating === 0 || !comment) {
      toast.error("Por favor completa todos los campos y dános estrellitas ⭐");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Enviando tu opinión...");

    try {
      await addDoc(collection(db, "reviews"), {
        name,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });

      toast.success("¡Gracias por tu reseña! 💖", { id: toastId });
      router.push("/"); // Volver al inicio
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al enviar.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-white flex items-center justify-center p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-lg w-full rounded-3xl shadow-xl p-8 md:p-12 border border-strawberry-milk/20"
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-2">💌</span>
          <h1 className="text-3xl font-script text-deep-rose">Tu opinión importa</h1>
          <p className="text-gray-500 mt-2">Cuéntanos, ¿qué tal estuvo ese dulcito?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre y Apellido</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. María Pérez"
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-deep-rose focus:ring-1 focus:ring-deep-rose outline-none bg-gray-50"
            />
          </div>

          {/* Estrellas */}
          <div className="text-center">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Valoración</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`text-4xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tu Reseña</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Lo que más me gustó fue..."
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-deep-rose focus:ring-1 focus:ring-deep-rose outline-none bg-gray-50 h-32 resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-deep-rose text-white font-bold rounded-xl shadow-lg hover:bg-rose active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Publicar Reseña"}
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 text-gray-400 font-bold hover:text-warm-charcoal transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}