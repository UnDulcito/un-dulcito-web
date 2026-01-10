"use client";

export default function Hero() {

  const scrollToFavorites = () => {
    const section = document.getElementById("favoritos");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // AGREGAMOS EL ID AQUÍ
    <section id="inicio" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-strawberry-milk via-soft-pink to-blush opacity-90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=1920&q=80" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-[15%] left-[5%] animate-bounce duration-[3000ms]">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="#D45D79" className="opacity-60">
                <circle cx="20" cy="20" r="8"/><circle cx="12" cy="15" r="5"/><circle cx="28" cy="15" r="5"/>
            </svg>
        </div>
        <div className="absolute bottom-[20%] right-[10%] animate-pulse duration-[2000ms]">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="#FFB6C1" className="opacity-80">
                <path d="M15 28C15 28 5 20 5 12C5 7 9 3 15 3C21 3 25 7 25 12C25 20 15 28 15 28Z"/>
            </svg>
        </div>
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mt-16">
        <p className="text-deep-rose font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in-up">
          Handcrafted with Love
        </p>
        <h1 className="text-deep-rose font-script text-7xl md:text-9xl mb-6 drop-shadow-sm animate-fade-in-up delay-100">
          Un Dulcito
        </h1>
        <p className="text-warm-charcoal text-xl md:text-2xl mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200">
          Donde cada bocado cuenta una historia de dulzura, creado con los ingredientes más finos y una pizca de magia.
        </p>
        
        <div className="animate-fade-in-up delay-300">
            <button 
              onClick={scrollToFavorites}
              className="inline-block px-10 py-4 bg-deep-rose text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform border-2 border-soft-gold cursor-pointer"
            >
                Ver Catálogo
            </button>
        </div>
      </div>

      <button 
        onClick={scrollToFavorites}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20 text-deep-rose cursor-pointer bg-transparent border-none"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </button>
    </section>
  );
}