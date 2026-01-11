import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

// Ignorar certificados vencidos del BCV (Truco de viejo lobo de mar)
const agent = new https.Agent({  
  rejectUnauthorized: false
});

export const dynamic = 'force-dynamic'; // Para que Vercel no guarde el precio viejo

export async function GET() {
  try {
    console.log("📡 Conectando con el BCV...");
    
    // 1. Petición al BCV disfrazados de navegador Chrome
    const { data } = await axios.get("http://www.bcv.org.ve", { 
      httpsAgent: agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 8000 // Le damos 8 segundos de paciencia
    });

    // 2. Leemos el HTML
    const $ = cheerio.load(data);
    
    // 3. Buscamos el ID "euro" que usa el BCV en su página
    let tasaEuroTexto = $("#euro strong").text().trim();
    
    // Convertimos la coma europea (60,00) a punto decimal (60.00)
    let tasaEuro = parseFloat(tasaEuroTexto.replace(",", "."));

    if (!tasaEuro || isNaN(tasaEuro)) {
        throw new Error("No se pudo leer la tasa del HTML");
    }

    console.log(`✅ Tasa BCV encontrada: ${tasaEuro} Bs/EUR`);

    return NextResponse.json({ 
      source: "BCV Oficial", 
      rate: tasaEuro, 
      lastUpdated: new Date().toISOString() 
    });

  } catch (error) {
    console.error("⚠️ El BCV está rebelde, activando Plan de Respaldo...", error);

    // PLAN B: Usamos una API pública que suele tener la data
    try {
        const response = await axios.get("https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv");
        const tasa = response.data.monitors.euro.price;

        return NextResponse.json({ 
            source: "API Respaldo", 
            rate: tasa, 
            lastUpdated: new Date().toISOString() 
        });

    } catch (err) {
        // PLAN Z: Si todo falla, no mostramos nada y que Yola calcule manual
        return NextResponse.json({ error: "Servicios no disponibles" }, { status: 503 });
    }
  }
}