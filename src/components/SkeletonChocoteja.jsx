import './SkeletonChocoteja.css';

function SkeletonChocoteja() {
  return (
    <div className="tarjeta-chocoteja skeleton-tarjeta">
      {/* La caja de la foto */}
      <div className="skeleton-imagen"></div>
      
      {/* La caja del título */}
      <div className="skeleton-titulo"></div>
      
      {/* La caja del precio */}
      <div className="skeleton-precio"></div>
      
      {/* Las cajas de los botones */}
      <div className="skeleton-botones">
        <div className="skeleton-btn"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
}

export default SkeletonChocoteja;