import './ModalProducto.css';

function ModalProducto({ producto, cerrarModal, agregarAlCarrito }) {
  // Si no hay ningún producto seleccionado, no dibujamos la ventana
  if (!producto) return null; 

  return (
    <div className="modal-fondo">
      <div className="modal-contenido modal-producto">
        
        {/* Botón para cerrar */}
        <button className="btn-cerrar" onClick={cerrarModal}>✖</button>
        
        {/* Etiqueta de la categoría (Clásica, Especial, Box) */}
        <span className={`badge-categoria ${producto.categoria.toLowerCase()}`}>
          {producto.categoria}
        </span>
        
        {/* Carrusel de imágenes */}
        <div className="pasarela-fotos">
          {producto.imagenes && producto.imagenes.map((imgUrl, index) => (
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