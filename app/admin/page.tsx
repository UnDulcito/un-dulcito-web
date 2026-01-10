"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("¡Bienvenida Jefa! 👩‍🍳");
      router.push("/admin/dashboard"); // Aún no creamos esta, pero hacia allá irá
    } catch (error) {
      toast.error("Datos incorrectos. Intenta de nuevo.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-white flex items-center justify-center px-6">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-strawberry-milk/30">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-3xl font-script text-deep-rose">Acceso Yola CEO</h1>
          <p className="text-gray-400 text-sm mt-2">Solo personal autorizado (y guapo)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-warm-charcoal font-bold mb-2 text-sm">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-deep-rose focus:ring-2 focus:ring-strawberry-milk/50 outline-none transition-all"
              placeholder="yola@undulcito.com"
              required
            />
          </div>

          <div>
            <label className="block text-warm-charcoal font-bold mb-2 text-sm">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-deep-rose focus:ring-2 focus:ring-strawberry-milk/50 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deep-rose text-white font-bold py-4 rounded-xl hover:bg-rose transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Entrar al Panel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}