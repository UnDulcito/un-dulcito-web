export default function About() {
  return (
    // id="historia" y scroll-mt-28 para que el enlace del menú funcione perfecto
    <section id="historia" className="py-24 bg-gradient-to-br from-strawberry-milk/20 to-cream-white overflow-hidden relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LADO IZQUIERDO: IMÁGENES */}
        <div className="relative">
          {/* FOTO GRANDE PRINCIPAL */}
          <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* CAMBIO: Ruta a la imagen local */}
            <img 
              src="/about-main.png" 
              alt="Decorando con amor" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* FOTO PEQUEÑA (CÍRCULO FLOTANTE) */}
          <div className="absolute -bottom-10 -right-10 z-20 w-48 h-48 rounded-full border-4 border-white shadow-xl overflow-hidden hidden md:block animate-pulse-slow">
            {/* CAMBIO: Ruta a la imagen local */}
            <img 
              src="/about-small.png" 
              alt="Detalle ingredientes" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decoración de fondo */}
          <div className="absolute top-10 -left-10 w-full h-full bg-deep-rose/10 rounded-[2rem] -z-0 transform rotate-3"></div>
        </div>

        {/* LADO DERECHO: TEXTO */}
        <div className="space-y-8">
          <div>
            <span className="text-deep-rose font-bold uppercase tracking-widest text-sm">Nuestra Historia</span>
            <h2 className="text-5xl text-warm-charcoal font-script mt-2 mb-6">Horneado con Pasión</h2>
            <div className="w-20 h-1 bg-deep-rose rounded-full"></div>
          </div>
          
          <div className="text-lg text-warm-charcoal/80 space-y-4 leading-relaxed font-sans">
            <p><strong>Un Dulcito</strong> comenzó en la cocina de casa y, con orgullo, ahí sigue nuestra magia. Mi misión es simple: me hace feliz hacerte feliz a través de un dulce.</p>
            <p>Cada postre que sale de mi horno está hecho artesanalmente y, sobre todo, con mucho amor.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-deep-rose">💓</div>
              <span className="font-bold text-warm-charcoal">Hecho con Amor</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-deep-rose">🧁</div>
              <span className="font-bold text-warm-charcoal">Fresco del Día</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}