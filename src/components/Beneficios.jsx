import './Beneficios.css';

function Beneficios() {
  return (
    <section className="seccion-beneficios">
      <div className="contenedor-beneficios">
        <div className="beneficio-item">
          <div className="beneficio-icono">🍫</div>
          <h3>Chocolate Premium</h3>
          <p>Seleccionamos el mejor cacao para garantizar una cobertura crujiente y de sabor intenso.</p>
        </div>
        <div className="beneficio-item">
          <div className="beneficio-icono">👩‍🍳</div>
          <h3>100% Artesanal</h3>
          <p>Elaboradas a mano todos los días. Sin preservantes, asegurando máxima frescura en cada bocado.</p>
        </div>
        <div className="beneficio-item">
          <div className="beneficio-icono">🛵</div>
          <h3>Delivery Rápido</h3>
          <p>Llevamos tus antojos directamente a tu puerta para que disfrutes sin salir de casa.</p>
        </div>
      </div>
    </section>
  );
}
export default Beneficios;