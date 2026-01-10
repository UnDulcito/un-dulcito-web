import type { Metadata } from "next";
import { Nunito, Great_Vibes } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Preloader from "@/components/Preloader";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["300", "400", "600", "700", "800"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
});

// --- METADATOS PREMIUM (OPEN GRAPH) ---
export const metadata: Metadata = {
  title: {
    default: "Un Dulcito | Repostería Artesanal en Maracaibo",
    template: "%s | Un Dulcito"
  },
  description: "Los postres más deliciosos de Maracaibo. Cupcakes, tortas y galletas hechos con amor por Yola. ¡Pide tu dulcito hoy!",
  openGraph: {
    title: "Un Dulcito 🧁 | Date un gusto hoy",
    description: "Postres artesanales que enamoran. Mira nuestro catálogo y pide por WhatsApp.",
    url: "https://undulcito.com", // (Esto se actualizará cuando tengas dominio propio)
    siteName: "Un Dulcito",
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Un Dulcito 🧁",
    description: "Repostería artesanal en Maracaibo.",
  },
  icons: {
    icon: "/favicon.ico", // Busca automáticamente si tienes uno
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${nunito.variable} ${greatVibes.variable} antialiased bg-cream-white text-warm-charcoal`}
      >
        <CartProvider>
            {/* 1. Pantalla de carga inicial */}
            <Preloader />
            
            {/* 2. Sistema de Notificaciones */}
            <Toaster 
              position="bottom-center"
              toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '50px',
                  padding: '16px',
                },
                success: {
                  style: {
                    background: '#D45D79',
                  },
                  iconTheme: {
                    primary: 'white',
                    secondary: '#D45D79',
                  },
                },
              }}
            />

            {/* 3. Navegación Principal */}
            <Navbar />
            
            {/* 4. Contenido de la Página */}
            {children}
            
            {/* 5. Pie de Página */}
            <Footer />
            
            {/* 6. Botón Flotante de WhatsApp */}
            <FloatingWhatsapp />
            
            {/* 7. Cajón del Carrito */}
            <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}