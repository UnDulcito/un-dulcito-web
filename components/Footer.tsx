import Link from "next/link";

export default function Footer() {
  return (
    // id="contacto" y scroll-mt-24 para navegación suave
    <footer id="contacto" className="bg-cream-white text-warm-charcoal py-12 border-t-2 border-strawberry-milk/20 mt-20 scroll-mt-24">
      {/* CAMBIO: De 4 columnas pasamos a 3, ya que quitamos "Ayuda" */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUMNA 1: INFO Y REDES */}
        <div className="md:col-span-1">
          <Link href="/" className="text-3xl font-script text-deep-rose mb-4 block hover:opacity-80 transition-opacity">
            Un Dulcito
          </Link>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Creando recuerdos dulces desde 2024. Cada postre está hecho a mano con amor, ingredientes de primera y una pizca de magia de Yola. 🧁✨
          </p>
          
          <div className="flex gap-4">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-deep-rose hover:bg-deep-rose hover:text-white hover:scale-110 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-deep-rose hover:bg-deep-rose hover:text-white hover:scale-110 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            {/* Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-deep-rose hover:bg-deep-rose hover:text-white hover:scale-110 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        {/* COLUMNA 2: EXPLORAR */}
        <div>
          <h3 className="font-bold text-deep-rose mb-6 text-lg">Explorar</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            <li><Link href="/" className="hover:text-deep-rose hover:translate-x-1 transition-all inline-block">Home</Link></li>
            <li><Link href="/catalogo" className="hover:text-deep-rose hover:translate-x-1 transition-all inline-block">Catálogo</Link></li>
            <li><Link href="/#historia" className="hover:text-deep-rose hover:translate-x-1 transition-all inline-block">Historia</Link></li>
            <li><Link href="/dejar-resena" className="hover:text-deep-rose hover:translate-x-1 transition-all inline-block">Dejar Reseña</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: CONTACTO (Actualizada) */}
        <div>
          <h3 className="font-bold text-deep-rose mb-6 text-lg">Contacto</h3>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              {/* Dirección actualizada a Parque Habitat */}
              <a href="https://www.google.com/maps/place/Parque+Habitat/@10.6414223,-71.6042253,18.5z/data=!4m15!1m8!3m7!1s0x8e89998e7a5bd625:0xce0904e0ea8de74b!2sMaracaibo,+Zulia!3b1!8m2!3d10.6410135!4d-71.607381!16zL20vMDFsMjYz!3m5!1s0x8e89985be6f8cf61:0x20f81c9f2e2d3d99!8m2!3d10.6418446!4d-71.6033389!16s%2Fg%2F11bw1yxc0h?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" target="_blank" rel="noopener noreferrer" className="hover:text-deep-rose transition-colors">
                Parque Habitat<br/>Maracaibo, Zulia
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">💌</span>
              {/* Correo actualizado */}
              <a href="mailto:yolaypb@gmail.com" className="hover:text-deep-rose transition-colors">yolaypb@gmail.com</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              {/* Teléfono actualizado */}
              <a href="tel:+584227186334" className="hover:text-deep-rose transition-colors">+58 422-7186334</a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">
          © {new Date().getFullYear()} Un Dulcito. Todos los derechos reservados.
        </p>
        <p className="text-deep-rose font-script text-lg mt-2 animate-pulse">
          Hecho con amor y sprinkles 🍭
        </p>
      </div>
    </footer>
  );
}