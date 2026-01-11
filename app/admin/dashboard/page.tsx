"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db } from "@/lib/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const IMGBB_API_KEY = "311b995887253b03641cfaa6f53b3f96"; 

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  features?: string[];
  isBestSeller?: boolean; 
  bestSellerOrder?: number;
  stock: number; // NUEVO: Campo de Stock
}

interface Category {
  id: string;
  name: string;
}

const DEFAULT_FEATURES = ["100% Natural", "Hecho en Casa", "Calidad Premium", "Delivery Disponible"];

export default function Dashboard() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null); 
  
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados Categorías
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Estados Producto (Formulario)
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("0"); // NUEVO: Estado para Stock
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFeatures, setNewFeatures] = useState<string[]>([...DEFAULT_FEATURES]);
  
  // Estados Best Seller
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [bestSellerOrder, setBestSellerOrder] = useState(0);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); 
  const [currentImageUrl, setCurrentImageUrl] = useState(""); 
  const [isUploading, setIsUploading] = useState(false);

  // NUEVO: Estados para Modal de Venta Rápida
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleData, setSaleData] = useState({ productId: "", quantity: "1" });

  // 1. Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Data Listeners
  useEffect(() => {
    if (!user) return;

    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        stock: doc.data().stock || 0 // Aseguramos que stock exista
      })) as Product[];
      setProducts(productsData);
    });

    const qCategories = query(collection(db, "categories"), orderBy("name"));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const catsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      })) as Category[];
      setDbCategories(catsData);
      
      if (!editingId && catsData.length > 0) { 
          setNewCategory(prev => prev || catsData[0].name);
      }
    });

    return () => { unsubProducts(); unsubCategories(); };
  }, [user, editingId]);

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...newFeatures];
    updated[index] = value;
    setNewFeatures(updated);
  };

  // 3. FUNCIÓN MAESTRA: GUARDAR
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName || !newPrice) {
      toast.error("Faltan nombre o precio 📝");
      return;
    }
    
    if (dbCategories.length === 0 && !newCategory) {
        toast.error("¡Crea una categoría primero!");
        return;
    }
    
    if (!editingId && !imageFile) {
        toast.error("La foto es obligatoria para nuevos productos 📸");
        return;
    }

    setIsUploading(true);
    const toastId = toast.loading(editingId ? "Actualizando..." : "Creando...");

    try {
      let finalImageUrl = currentImageUrl; 

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!data.success) throw new Error("Error ImgBB");
        finalImageUrl = data.data.url; 
      }

      const productData = {
        name: newName,
        price: parseFloat(newPrice),
        category: newCategory || dbCategories[0]?.name,
        image: finalImageUrl,
        description: newDescription || "Una explosión de sabor artesanal.",
        features: newFeatures,
        isBestSeller: isBestSeller,
        bestSellerOrder: Number(bestSellerOrder),
        stock: parseInt(newStock) || 0, // NUEVO: Guardamos Stock
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        const productRef = doc(db, "products", editingId);
        await updateDoc(productRef, productData);
        toast.success("¡Producto actualizado! ✨", { id: toastId });
      } else {
        await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: serverTimestamp(), 
        });
        toast.success("¡Producto creado! 🧁", { id: toastId });
      }
      
      handleCancelEdit(); 

    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewName(product.name);
    setNewPrice(product.price.toString());
    setNewStock(product.stock?.toString() || "0"); // Cargar stock al editar
    setNewCategory(product.category);
    setNewDescription(product.description || "");
    setNewFeatures(product.features || [...DEFAULT_FEATURES]);
    
    setIsBestSeller(product.isBestSeller || false);
    setBestSellerOrder(product.bestSellerOrder || 0);

    setCurrentImageUrl(product.image);
    setImageFile(null); 
    
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    toast("Modo Edición Activado ✏️", { icon: '📝' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewName("");
    setNewPrice("");
    setNewStock("0"); // Reset stock
    setNewDescription("");
    setNewFeatures([...DEFAULT_FEATURES]);
    setIsBestSeller(false); 
    setBestSellerOrder(0); 
    setImageFile(null);
    setCurrentImageUrl("");
    if (dbCategories.length > 0) setNewCategory(dbCategories[0].name);
  };

  // NUEVO: Función para venta rápida
  const handleQuickSale = async (e: React.FormEvent) => {
      e.preventDefault();
      const { productId, quantity } = saleData;
      const qtyNum = parseInt(quantity);
      
      if (!productId || qtyNum <= 0) return;

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newStockVal = (product.stock || 0) - qtyNum;

      if (newStockVal < 0) {
          toast.error("¡No tienes suficiente stock para vender eso!");
          return;
      }

      try {
          const docRef = doc(db, "products", productId);
          await updateDoc(docRef, { stock: newStockVal });
          toast.success(`Venta registrada. Nuevo stock: ${newStockVal} 📉`);
          setIsSaleModalOpen(false);
          setSaleData({ productId: "", quantity: "1" });
      } catch (error) {
          toast.error("Error al registrar venta");
      }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    if (dbCategories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast.error("Esa categoría ya existe");
      return;
    }
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategoryName.trim(),
        createdAt: serverTimestamp()
      });
      toast.success(`Categoría "${newCategoryName}" añadida ✨`);
      setNewCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      toast.error("Error al crear categoría");
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("¿Seguro que quieres borrar esta categoría?")) return;
    try {
      await deleteDoc(doc(db, "categories", catId));
      toast.success("Categoría borrada 🗑️");
    } catch (error) {
      toast.error("Error al borrar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar este postre? No hay vuelta atrás.")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Producto eliminado 🗑️");
      if (editingId === id) handleCancelEdit(); 
    } catch (error) {
      toast.error("No se pudo borrar");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-white text-deep-rose font-bold">Cargando Panel...</div>;

  return (
    // FIX: Agregamos pt-28 md:pt-32 para que el Navbar fijo no tape los botones
    <div className="min-h-screen bg-cream-white px-6 pb-12 pt-28 md:px-12 md:pb-12 md:pt-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-script text-deep-rose">Panel de Control</h1>
          <p className="text-gray-500">Hola, {user?.email} 👋</p>
        </div>
        
        {/* FIX: relative z-10 para asegurar que los botones reciban clicks */}
        <div className="flex gap-3 relative z-10">
             <button 
                type="button"
                onClick={() => setIsSaleModalOpen(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer"
            >
                💰 Venta Rápida
            </button>
            <button 
                type="button"
                onClick={handleLogout} 
                className="bg-warm-charcoal text-white px-6 py-2 rounded-full hover:bg-black transition-colors text-sm font-bold shadow-sm cursor-pointer"
            >
                Cerrar Sesión
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="lg:col-span-1" ref={formRef}>
          <div className={`bg-white p-8 rounded-3xl shadow-xl sticky top-24 border border-strawberry-milk/20 max-h-[85vh] overflow-y-auto transition-colors ${editingId ? 'border-l-8 border-l-soft-gold' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-warm-charcoal flex items-center gap-2">
                <span>{editingId ? "✏️" : "✨"}</span> 
                {editingId ? "Editar Postre" : "Nuevo Postre"}
                </h2>
                {editingId && (
                    <button onClick={handleCancelEdit} className="text-xs text-gray-400 hover:text-red-500 underline">
                        Cancelar
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. Helado de Fresa" className="w-full p-3 rounded-xl border border-gray-200 focus:border-deep-rose focus:ring-1 focus:ring-deep-rose outline-none" />
              </div>

              {/* Precio y Stock (NUEVO LAYOUT) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Precio (€)</label>
                  <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="0.00" className="w-full p-3 rounded-xl border border-gray-200 focus:border-deep-rose outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Stock</label>
                   <input 
                        type="number" 
                        value={newStock} 
                        onChange={(e) => setNewStock(e.target.value)} 
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-deep-rose outline-none"
                        placeholder="0"
                    />
                </div>
              </div>

              {/* Categoría */}
              <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex justify-between items-center">
                    Categoría
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => { setIsDeletingCategory(!isDeletingCategory); setIsAddingCategory(false); }} 
                        className={`text-[10px] hover:underline ${isDeletingCategory ? 'text-red-600 font-bold' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        {isDeletingCategory ? "Listo" : "Borrar"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsAddingCategory(!isAddingCategory); setIsDeletingCategory(false); }} 
                        className="text-deep-rose hover:underline text-[10px]"
                      >
                        {isAddingCategory ? "Cancelar" : "+ Nueva"}
                      </button>
                    </div>
                  </label>

                  {/* LÓGICA DE INTERFAZ DE CATEGORÍAS */}
                  {isAddingCategory ? (
                    <div className="flex gap-1 animate-fadeIn">
                      <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Ej. Helados" className="w-full p-3 rounded-l-xl border border-deep-rose focus:outline-none text-sm" autoFocus />
                      <button type="button" onClick={handleCreateCategory} className="bg-deep-rose text-white px-3 rounded-r-xl font-bold hover:bg-rose">OK</button>
                    </div>
                  ) : isDeletingCategory ? (
                    <div className="flex flex-wrap gap-2 p-2 bg-red-50 rounded-xl border border-red-100 max-h-32 overflow-y-auto">
                      {dbCategories.length === 0 && <span className="text-xs text-gray-400">No hay categorías para borrar.</span>}
                      {dbCategories.map(cat => (
                        <span key={cat.id} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md text-xs text-warm-charcoal shadow-sm border border-gray-100">
                          {cat.name}
                          <button 
                            type="button" 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-500 hover:text-red-700 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-deep-rose outline-none bg-white">
                      {dbCategories.length === 0 && <option value="">¡Crea una categoría!</option>}
                      {dbCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  )}
              </div>

              {/* SECCIÓN BEST SELLER */}
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                 <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isBestSeller} 
                            onChange={(e) => setIsBestSeller(e.target.checked)} 
                            className="w-5 h-5 text-deep-rose rounded focus:ring-deep-rose"
                        />
                        <span className="text-sm font-bold text-warm-charcoal">¿Es un Best Seller? ⭐</span>
                    </label>
                 </div>
                 
                 {isBestSeller && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Orden de aparición</label>
                        <input 
                            type="number" 
                            value={bestSellerOrder} 
                            onChange={(e) => setBestSellerOrder(Number(e.target.value))} 
                            className="w-full p-2 rounded-lg border border-yellow-300 focus:border-deep-rose outline-none bg-white"
                            placeholder="Ej. 1 para salir de primero"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">1 = Primero, 2 = Segundo...</p>
                    </motion.div>
                 )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Escribe algo delicioso..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-deep-rose focus:ring-1 focus:ring-deep-rose outline-none h-24 resize-none"
                />
              </div>

              {/* Foto */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Foto {editingId && "(Opcional si ya tiene)"}
                </label>
                
                {editingId && !imageFile && currentImageUrl && (
                    <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                        <img src={currentImageUrl} alt="Actual" className="w-full h-full object-cover opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-bold">
                            Foto Actual
                        </div>
                    </div>
                )}

                <div className="border-2 border-dashed border-strawberry-milk/50 rounded-xl p-6 text-center hover:bg-strawberry-milk/10 transition-colors cursor-pointer relative group">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="text-center">
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📸</span>
                    <span className="text-sm text-gray-500 font-medium truncate max-w-full block">
                      {imageFile ? imageFile.name : (editingId ? "Toca para cambiar foto" : "Subir imagen")}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className={`w-full py-4 font-bold rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 text-white ${editingId ? 'bg-soft-gold hover:bg-yellow-500' : 'bg-deep-rose hover:bg-rose'}`}
              >
                {isUploading ? "Procesando..." : (editingId ? "Actualizar Producto" : "Guardar en Inventario")}
              </button>
              
              {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="w-full py-2 text-gray-400 text-sm hover:text-warm-charcoal">
                      Cancelar Edición
                  </button>
              )}
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: LISTA */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-warm-charcoal mb-6">Inventario Actual ({products.length})</h2>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-4xl block mb-2">🧁🧐</span>
              <p className="text-gray-400 text-lg">Aún no hay productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-white p-4 rounded-2xl shadow-sm border flex gap-4 group relative overflow-hidden transition-all ${editingId === product.id ? 'border-soft-gold ring-2 ring-soft-gold/20' : 'border-transparent hover:border-strawberry-milk/50'}`}
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-1 mb-1">
                          <span className="text-[10px] font-bold text-rose uppercase tracking-wide bg-rose/10 px-2 py-1 rounded-md w-fit">
                            {product.category}
                          </span>
                          
                          {/* INDICADOR STOCK (NUEVO) */}
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md w-fit ${
                              product.stock === 0 ? 'bg-red-100 text-red-600' :
                              product.stock < 5 ? 'bg-orange-100 text-orange-600' :
                              'bg-green-100 text-green-600'
                          }`}>
                            Stock: {product.stock}
                          </span>

                          {product.isBestSeller && (
                             <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md w-fit flex items-center gap-1">
                                ⭐ Top #{product.bestSellerOrder}
                             </span>
                          )}
                      </div>
                      <h3 className="font-bold text-warm-charcoal text-lg leading-tight">{product.name}</h3>
                      <p className="text-gray-500 font-medium mt-1">€{product.price.toFixed(2)}</p>
                    </div>

                    {/* Botonera de Acciones */}
                    <div className="absolute top-2 right-2 flex gap-2 md:translate-x-14 md:group-hover:translate-x-0 transition-transform duration-300">
                        <button 
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-white/90 hover:bg-soft-gold/10 text-gray-400 hover:text-soft-gold rounded-full shadow-sm border border-transparent hover:border-soft-gold"
                            title="Editar"
                        >
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full shadow-sm border border-transparent hover:border-red-200"
                            title="Borrar"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* MODAL VENTA RÁPIDA (NUEVO) */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  💰 Registrar Venta
              </h3>
              <form onSubmit={handleQuickSale}>
                  <label className="block text-sm text-gray-500 mb-1">Producto Vendido</label>
                  <select 
                      className="w-full border border-gray-300 p-3 rounded-lg mb-4 bg-gray-50 text-warm-charcoal"
                      value={saleData.productId}
                      onChange={(e) => setSaleData({...saleData, productId: e.target.value})}
                      required
                  >
                      <option value="">Selecciona un producto...</option>
                      {products.filter(p => p.stock > 0).map(p => (
                          <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                      ))}
                  </select>

                  <label className="block text-sm text-gray-500 mb-1">Cantidad Vendida</label>
                  <input 
                      type="number" 
                      min="1"
                      className="w-full border border-gray-300 p-3 rounded-lg mb-6"
                      value={saleData.quantity}
                      onChange={(e) => setSaleData({...saleData, quantity: e.target.value})}
                      required
                  />

                  <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsSaleModalOpen(false)}
                        className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                      >
                          Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 shadow-md"
                      >
                          Confirmar
                      </button>
                  </div>
              </form>
          </div>
        </div>
      )}

    </div>
  );
}