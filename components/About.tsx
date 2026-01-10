export default function About() {
  return (
    // CAMBIO CLAVE: id="historia" y scroll-mt-28
    <section id="historia" className="py-24 bg-gradient-to-br from-strawberry-milk/20 to-cream-white overflow-hidden relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LADO IZQUIERDO: IMÁGENES */}
        <div className="relative">
          <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&q=80" alt="Decorando" className="w-full h-auto object-cover"/>
          </div>
          <div className="absolute -bottom-10 -right-10 z-20 w-48 h-48 rounded-full border-4 border-white shadow-xl overflow-hidden hidden md:block animate-pulse-slow">
            <img src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&q=80" alt="Ingredientes" className="w-full h-full object-cover"/>
          </div>
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
            <p><strong>Un Dulcito</strong> nació del amor simple por crear momentos felices. Lo que empezó en la cocina de casa se ha convertido en un sueño hecho realidad.</p>
            <p>Creemos que un postre no es solo comida, es un abrazo comestible. Por eso, Yola y su equipo seleccionan a mano cada ingrediente.</p>
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