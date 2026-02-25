import './ModalProducto.css';

function ModalProducto({ producto, cerrarModal, agregarAlCarrito }) {
  // Si no hay ningún producto seleccionado, no dibujamos la ventana
  if (!producto) return null; 

  // 🧠 UNIFICADOR DE IMÁGENES: Junta la lógica vieja y la nueva en una sola lista garantizada
  // 🧠 NUEVA PRIORIDAD: El CRM manda. 
  const fotosAMostrar = producto.imagenUrl
    ? [producto.imagenUrl] 
    : (producto.imagenes && producto.imagenes.length > 0)
      ? producto.imagenes
      : ["https://images.unsplash.com/photo-1511381939415-e440c88218ce?auto=format&fit=crop&w=400&q=80"];

  return (
    <div className="modal-fondo">
      <div className="modal-contenido modal-producto">
        
        {/* Botón para cerrar */}
        <button className="btn-cerrar" onClick={cerrarModal}>✖</button>
        
        {/* Etiqueta de la categoría (Clásica, Especial, Box) */}
        <span className={`badge-categoria ${producto.categoria.toLowerCase()}`}>
          {producto.categoria}
        </span>
        
        {/* Carrusel de imágenes (Ahora funciona con ambos sistemas) */}
        <div className="pasarela-fotos">
          {fotosAMostrar.map((imgUrl, index) => (
            <img 
              key={index} 
              src={imgUrl} 
              alt={`${producto.sabor} vista ${index + 1}`} 
              className="foto-carrusel" 
            />
          ))}
        </div>
        
        {/* Información del producto */}
        <div className="info-producto">
          <h3>Chocoteja de {producto.sabor}</h3>
          <p className="precio-modal">S/ {producto.precio.toFixed(2)}</p>
          <p className="descripcion-modal">{producto.descripcion}</p>
          
          <button 
            className="btn-primario" 
            style={{ width: '100%' }} 
            onClick={() => agregarAlCarrito(producto.sabor, producto.precio)}
          >
            Añadir al pedido
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalProducto;