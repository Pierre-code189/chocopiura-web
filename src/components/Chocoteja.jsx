import './Chocoteja.css'

function Chocoteja({ producto, alAgregar, alVerDetalles }) { 
  // 🧠 LÓGICA INTELIGENTE: Revisa el array, si no, revisa imagenUrl, si no, usa la foto por defecto
  // 🧠 NUEVA PRIORIDAD: El CRM manda (imagenUrl). Si no hay, busca el array viejo.
  const imagenPrincipal = producto.imagenUrl 
    ? producto.imagenUrl 
    : (producto.imagenes && producto.imagenes.length > 0)
      ? producto.imagenes[0]
      : "https://images.unsplash.com/photo-1511381939415-e440c88218ce?auto=format&fit=crop&w=400&q=80";

  // Si por error olvidamos poner el precio, evitamos que la app se rompa
  const precioSeguro = producto.precio ? producto.precio : 0;

  return (
    <div className="tarjeta-chocoteja">
      <img 
        src={imagenPrincipal} 
        alt={`Chocoteja de ${producto.sabor || 'Producto'}`} 
        className="imagen-chocoteja" 
        onClick={alVerDetalles}
        style={{cursor: 'pointer'}} 
      />
      
      <h3>Chocoteja de {producto.sabor}</h3>
      <p>Precio: S/ {precioSeguro.toFixed(2)}</p>
      
      <div className="botones-tarjeta" style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
        <button 
          className="btn-secundario-pequeno" 
          onClick={alVerDetalles}
          style={{backgroundColor: 'transparent', color: '#5C3A21', border: '1px solid #5C3A21', width: '50%'}}
        >
          Detalles
        </button>
        <button 
          onClick={() => alAgregar(producto.sabor, precioSeguro)}
          style={{width: '50%', margin: '0'}}
        >
          Añadir
        </button>
      </div>
    </div>
  );
}

export default Chocoteja;