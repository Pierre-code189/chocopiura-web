import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'; /* <-- Añadimos doc y getDoc */
import { db } from '../firebase'; 
import './ModalCarrito.css';

const zonasDelivery = [
  { id: 'recojo', nombre: 'Recojo en Tienda', precio: 0 },
  { id: 'centro', nombre: 'Piura Centro', precio: 3.50 },
  { id: 'castilla', nombre: 'Castilla', precio: 5.00 },
  { id: 'miraflores', nombre: 'Miraflores', precio: 4.00 },
  { id: 'veintiseis', nombre: '26 de Octubre', precio: 6.00 }
];

function ModalCarrito({ 
  carrito, isCarritoAbierto, cerrarModal, vaciarCarrito, 
  incrementarCantidad, decrementarCantidad, eliminarDelCarrito 
}) {
  
  const [nombre, setNombre] = useState('');
  const [zonaEnvio, setZonaEnvio] = useState(zonasDelivery[0]);
  const [direccionExacta, setDireccionExacta] = useState('');
  const [metodoPago, setMetodoPago] = useState('Yape');
  const [estaProcesando, setEstaProcesando] = useState(false);

  const [cuponInput, setCuponInput] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const [mensajeCupon, setMensajeCupon] = useState({ texto: '', tipo: '' });
  const [validandoCupon, setValidandoCupon] = useState(false); 

  // --- NUEVO: HORARIOS DINÁMICOS DESDE FIREBASE ---
  const [horaApertura, setHoraApertura] = useState(9); // Valores por defecto
  const [horaCierre, setHoraCierre] = useState(22);
  const [cargandoHorario, setCargandoHorario] = useState(true);

  useEffect(() => {
    const fetchHorarios = async () => {
      if (isCarritoAbierto) {
        try {
          const docSnap = await getDoc(doc(db, "configuracion", "tienda"));
          if (docSnap.exists()) {
            setHoraApertura(docSnap.data().apertura);
            setHoraCierre(docSnap.data().cierre);
          }
        } catch (error) {
          console.error("Error cargando horarios:", error);
        } finally {
          setCargandoHorario(false);
        }
      }
    };
    fetchHorarios();
  }, [isCarritoAbierto]);

  const horaActual = new Date().getHours(); 
  // La tienda está abierta si no está cargando y la hora actual está dentro del rango
  const estaAbierto = !cargandoHorario && (horaActual >= horaApertura && horaActual < horaCierre);

  if (!isCarritoAbierto) return null;

  const subtotal = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
  let costoEnvio = zonaEnvio.precio;
  let descuentoMonto = 0;

  if (cuponAplicado) {
    if (cuponAplicado.tipo === 'porcentaje') {
      descuentoMonto = subtotal * cuponAplicado.valor;
    } else if (cuponAplicado.tipo === 'envio') {
      descuentoMonto = costoEnvio; 
    }
  }

  const totalCalculado = subtotal + costoEnvio - descuentoMonto;

  const manejarCupon = async () => {
    const codigo = cuponInput.trim().toUpperCase(); 
    if (codigo === '') return;
    setValidandoCupon(true);
    setMensajeCupon({ texto: 'Buscando cupón...', tipo: '' });

    try {
      const snapshot = await getDocs(collection(db, "cupones"));
      const listaCupones = snapshot.docs.map(doc => doc.data());
      const cuponEncontrado = listaCupones.find(c => c.codigo === codigo);

      if (cuponEncontrado) {
        setCuponAplicado(cuponEncontrado);
        setMensajeCupon({ texto: `¡Éxito! ${cuponEncontrado.descripcion}`, tipo: 'exito' });
      } else {
        setCuponAplicado(null);
        setMensajeCupon({ texto: 'Cupón inválido o expirado.', tipo: 'error' });
      }
    } catch (error) {
      setMensajeCupon({ texto: 'Error de conexión.', tipo: 'error' });
    }
    setValidandoCupon(false);
  };

  const quitarCupon = () => {
    setCuponAplicado(null); setCuponInput(''); setMensajeCupon({ texto: '', tipo: '' });
  };

  const manejarVaciarCarrito = () => {
    vaciarCarrito();
    setNombre(''); setDireccionExacta(''); setZonaEnvio(zonasDelivery[0]);
    quitarCupon(); 
  };

  const enviarPedidoWhatsApp = async () => {
    if (!estaAbierto) return; 
    if (nombre.trim() === '') { alert('Por favor, completa tu nombre.'); return; }
    if (zonaEnvio.precio > 0 && direccionExacta.trim() === '') { alert('Por favor, indica tu dirección exacta.'); return; }

    setEstaProcesando(true);

    try {
      const resumenItems = carrito.map(item => `${item.cantidad}x ${item.sabor}`).join(', ');

      await addDoc(collection(db, "pedidos"), {
        cliente: nombre,
        zona: zonaEnvio.nombre,
        direccion: direccionExacta || 'Recojo en tienda',
        metodoPago: metodoPago,
        productos: resumenItems,
        subtotal: subtotal,
        descuento: descuentoMonto,
        totalPagado: totalCalculado,
        fecha: new Date().toLocaleString(),
        estado: 'Pendiente ⏳',
        isDeleted: false
      });

      const numeroWhatsApp = "+51 975 075 015"; 
      const textoPedido = carrito.map((item) => `${item.cantidad}x ${item.sabor} (S/ ${(item.precio * item.cantidad).toFixed(2)})`).join('\n- ');
      const textoDescuento = descuentoMonto > 0 ? `*🏷️ Descuento (${cuponAplicado.codigo}):* - S/ ${descuentoMonto.toFixed(2)}\n` : '';

      const mensaje = `¡Hola! Soy *${nombre}*.\nQuiero hacer un pedido de ChocoPiura.\n\n` +
                      `*🛵 Entrega:* ${zonaEnvio.nombre} (S/ ${costoEnvio.toFixed(2)})\n` +
                      `*📍 Dirección:* ${direccionExacta || 'Pasará a recoger'}\n` +
                      `*💳 Pago:* ${metodoPago}\n\n` +
                      `*📦 MI PEDIDO:*\n- ${textoPedido}\n\n` +
                      `*Subtotal:* S/ ${subtotal.toFixed(2)}\n` +
                      `*Envío:* S/ ${costoEnvio.toFixed(2)}\n` +
                      textoDescuento +
                      `*💰 TOTAL A PAGAR: S/ ${totalCalculado.toFixed(2)}*`;
                      
      window.location.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
      
    } catch (error) {
      console.error("Error al registrar pedido:", error);
      alert("Hubo un problema registrando tu pedido. Intenta de nuevo.");
    } finally {
      setEstaProcesando(false);
    }
  };

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <button className="btn-cerrar" onClick={cerrarModal}>✖</button>
        {carrito.length > 0 ? (
          <>
            <h3 className="modal-titulo">Tu pedido actual</h3>
            <div className="lista-carrito">
              {carrito.map((item, index) => (
                <div key={index} className="item-carrito">
                  <div className="item-info">
                    <span className="item-nombre">{item.sabor}</span>
                    <span className="item-precio">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                  <div className="item-controles">
                    <button type="button" onClick={() => decrementarCantidad(item.sabor)}>-</button>
                    <span className="item-cantidad">{item.cantidad}</span>
                    <button type="button" onClick={() => incrementarCantidad(item.sabor)}>+</button>
                    <button type="button" className="btn-eliminar" onClick={() => eliminarDelCarrito(item.sabor)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="formulario-envio">
              <input type="text" placeholder="Tu Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={!estaAbierto} />
              <select value={zonaEnvio.id} onChange={(e) => { setZonaEnvio(zonasDelivery.find(z => z.id === e.target.value)); }} disabled={!estaAbierto}>
                {zonasDelivery.map(zona => ( <option key={zona.id} value={zona.id}>{zona.nombre} {zona.precio > 0 ? `(+ S/ ${zona.precio.toFixed(2)})` : '(Gratis)'}</option> ))}
              </select>
              {zonaEnvio.precio > 0 && ( <input type="text" placeholder="Avenida, calle, urbanización..." value={direccionExacta} onChange={(e) => setDireccionExacta(e.target.value)} disabled={!estaAbierto} /> )}
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} disabled={!estaAbierto}>
                <option value="Yape">Pago con Yape</option><option value="Plin">Pago con Plin</option><option value="Efectivo">Pago en Efectivo</option>
              </select>
            </div>

            <div className="seccion-cupon">
              {!cuponAplicado ? (
                <div className="contenedor-input-cupon">
                  <input type="text" placeholder="Código de descuento" value={cuponInput} onChange={(e) => setCuponInput(e.target.value)} className="input-cupon" disabled={!estaAbierto}/>
                  <button type="button" className="btn-cupon" onClick={manejarCupon} disabled={!estaAbierto || validandoCupon}>{validandoCupon ? '...' : 'Aplicar'}</button>
                </div>
              ) : (
                <div className="cupon-activo">
                  <span>🏷️ {cuponAplicado.codigo} aplicado</span>
                  <button type="button" className="btn-quitar-cupon" onClick={quitarCupon}>Quitar</button>
                </div>
              )}
              {mensajeCupon.texto && <p className={`mensaje-cupon ${mensajeCupon.tipo}`}>{mensajeCupon.texto}</p>}
            </div>

            <div className="resumen-pago">
              <div className="resumen-fila"><span>Subtotal:</span> <span>S/ {subtotal.toFixed(2)}</span></div>
              <div className="resumen-fila"><span>Delivery ({zonaEnvio.nombre}):</span> <span>S/ {costoEnvio.toFixed(2)}</span></div>
              {descuentoMonto > 0 && <div className="resumen-fila descuento"><span>Descuento ({cuponAplicado.codigo}):</span> <span>- S/ {descuentoMonto.toFixed(2)}</span></div>}
              <div className="resumen-fila total"><span>Total a Pagar:</span> <span>S/ {totalCalculado.toFixed(2)}</span></div>
            </div>

            <div className="botones-pedido" style={{marginTop: '15px'}}>
              {!estaAbierto && !cargandoHorario && (
                <div className="alerta-horario">
                  <p>🌙 <b>¡Estamos descansando!</b><br/> Nuestro horario es de {horaApertura}:00 a {horaCierre}:00. Tus chocotejas seguirán aquí al abrir.</p>
                </div>
              )}
              <button className="btn-vaciar" onClick={manejarVaciarCarrito}>Vaciar carrito</button>
              <button className={`btn-whatsapp ${!estaAbierto ? 'btn-desactivado' : ''}`} onClick={enviarPedidoWhatsApp} disabled={estaProcesando || !estaAbierto || cargandoHorario}>
                 {estaProcesando || cargandoHorario ? <span className="contenedor-spinner"><span className="spinner-icono"></span> Procesando...</span> : (!estaAbierto ? 'Cerrado por hoy' : 'Confirmar pedido')}
               </button>
            </div>
          </>
        ) : (
          <div className="carrito-vacio-animado">
            <div className="icono-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg></div>
            <h3 className="modal-titulo">Tu carrito está vacío</h3>
            <p>¡Aún no has elegido tus chocotejas! Anímate a probar nuestros deliciosos sabores.</p>
            <button className="btn-primario" style={{width: '100%'}} onClick={cerrarModal}>Descubrir Sabores</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalCarrito;