// src/components/PaginaInicio.jsx
import { useState, useEffect } from 'react';

// 1. Salimos de la carpeta components para buscar App.css en src
import "../App.css";

// 2. Quitamos "./components/" de las rutas porque ya estamos DENTRO de esa carpeta
import Navbar from './Navbar';
import Hero from './Hero';
import Beneficios from './Beneficios';
import Chocoteja from './Chocoteja';
import SkeletonChocoteja from './SkeletonChocoteja';
import Contacto from './Contacto';
import Footer from './Footer';

// 3. Lo mismo para los modales
import ModalProducto from './ModalProducto';
import ModalCarrito from './ModalCarrito';

// 4. Salimos de components para buscar firebase en src (un nivel arriba)
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 

// ... el resto de tu función PaginaInicio() sigue igual abajo ...

function PaginaInicio() {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = window.localStorage.getItem('carritoChocoPiura');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    const vigilante = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('revelar-mostrar');
        }
      });
    }, { threshold: 0.15 });

    const elementosOcultos = document.querySelectorAll('.revelar-oculto');
    elementosOcultos.forEach((el) => vigilante.observe(el));

    return () => vigilante.disconnect();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('carritoChocoPiura', JSON.stringify(carrito));
  }, [carrito]);

  const [listaProductos, setListaProductos] = useState([]); 
  const [cargando, setCargando] = useState(true); 
  
  const [isCarritoAbierto, setIsCarritoAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [toast, setToast] = useState({ visible: false, mensaje: '' });

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const productosRef = collection(db, "productos"); 
        const snapshot = await getDocs(productosRef); 
        const productosNube = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setListaProductos(productosNube); 
        setCargando(false); 
      } catch (error) { console.error("Error BD:", error); }
    };
    obtenerProductos(); 
  }, []); 

  const mostrarToast = (sabor) => {
    setToast({ visible: true, mensaje: `✅ ¡Chocoteja de ${sabor} añadida!` });
    setTimeout(() => setToast({ visible: false, mensaje: '' }), 3000);
  };

  const agregarAlCarrito = (sabor, precio) => {
    const item = carrito.find((i) => i.sabor === sabor);
    if (item) setCarrito(carrito.map((i) => i.sabor === sabor ? { ...i, cantidad: i.cantidad + 1 } : i ));
    else setCarrito([...carrito, { sabor, precio: Number(precio), cantidad: 1 }]);
    
    mostrarToast(sabor);
    setProductoSeleccionado(null);
  };

  const incrementarCantidad = (sabor) => setCarrito(carrito.map((i) => i.sabor === sabor ? { ...i, cantidad: i.cantidad + 1 } : i ));
  const decrementarCantidad = (sabor) => setCarrito(carrito.map((i) => i.sabor === sabor && i.cantidad > 1 ? { ...i, cantidad: i.cantidad - 1 } : i ));
  const eliminarDelCarrito = (sabor) => setCarrito(carrito.filter((i) => i.sabor !== sabor));
  const vaciarCarrito = () => { setCarrito([]); setIsCarritoAbierto(false); };

  const totalCalculado = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
  const cantidadTotalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  const productosFiltrados = listaProductos.filter((prod) => {
    const coincideCategoria = filtroCategoria === 'Todas' ? true : prod.categoria === filtroCategoria;
    const coincideBusqueda = prod.sabor.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="chocopiura-app">
      <Navbar cantidadTotalItems={cantidadTotalItems} totalCalculado={totalCalculado} abrirCarrito={() => setIsCarritoAbierto(true)} />
      
      <Hero />
      <Beneficios />
      
      <section id="productos" className="seccion revelar-oculto">
        <h2>Nuestras Creaciones</h2>
        <div className="controles-catalogo">
          <div className="filtros-categoria">
            {['Todas', 'Clásica', 'Especial', 'Box'].map((cat) => (
              <button key={cat} className={`btn-filtro ${filtroCategoria === cat ? 'activo' : ''}`} onClick={() => setFiltroCategoria(cat)}>
                {cat}
              </button>
            ))}
          </div>
          
          <div className="buscador-contenedor">
            <input 
              type="text" 
              placeholder="🔍 Buscar sabor (ej. Pecana)..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-buscador"
            />
          </div>
        </div>
        <div className="catalogo">
          {cargando ? (
            <>
              <SkeletonChocoteja /><SkeletonChocoteja /><SkeletonChocoteja />
            </>
          ) : productosFiltrados.length > 0 ? (
            productosFiltrados.map((prod) => (
              <Chocoteja 
                key={prod.id} 
                producto={prod} 
                alAgregar={agregarAlCarrito} 
                alVerDetalles={() => setProductoSeleccionado(prod)} 
              />
            ))
          ) : (
            <p style={{textAlign: 'center', width: '100%', color: '#8B4513'}}>No hay productos en esta categoría por ahora.</p>
          )}
        </div>
      </section>

      <div className="revelar-oculto"><Contacto /></div>
      <div className="revelar-oculto"><Footer /></div>

      <ModalProducto producto={productoSeleccionado} cerrarModal={() => setProductoSeleccionado(null)} agregarAlCarrito={agregarAlCarrito} />
      <ModalCarrito carrito={carrito} isCarritoAbierto={isCarritoAbierto} cerrarModal={() => setIsCarritoAbierto(false)} vaciarCarrito={vaciarCarrito} incrementarCantidad={incrementarCantidad} decrementarCantidad={decrementarCantidad} eliminarDelCarrito={eliminarDelCarrito} />

      <div className={`toast-notificacion ${toast.visible ? 'mostrar' : ''}`}>
        {toast.mensaje}
      </div>
    </div>
  );
}

export default PaginaInicio;