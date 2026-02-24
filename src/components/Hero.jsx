import './Hero.css';

function Hero() {
  return (
    <section id="inicio" className="seccion relative-section">
      <div className="contenido-inicio">
        <h1 className="animacion-subir">Artesanía en cada mordisco</h1>
        <p className="animacion-subir retraso-1">Descubre el verdadero sabor de Piura. Nuestras chocotejas están elaboradas con chocolate premium y rellenos que derretirán tu paladar.</p>
        <a href="#productos" className="btn-primario animacion-subir retraso-2">Ver Catálogo</a>
      </div>
      <a href="#productos" className="flecha-rebote">↓</a>

      {/* --- ONDA DECORATIVA (Chocolate oscuro) --- */}
      <div className="ola-decorativa">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
          <path d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#38220F' }}></path>
        </svg>
      </div>
    </section>
  );
}
export default Hero;