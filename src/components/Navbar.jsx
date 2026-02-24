import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar({ cantidadTotalItems, totalCalculado, abrirCarrito }) {
  const [scrolled, setScrolled] = useState(false);
  
  // 1. MEMORIA INTELIGENTE: Al cargar, lee si el usuario había elegido modo oscuro antes
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const modoGuardado = window.localStorage.getItem('temaChocoPiura');
    return modoGuardado === 'oscuro'; // Será true si guardó 'oscuro', falso si no.
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. VIGILANTE DE TEMA: Aplica los colores y guarda la decisión en la memoria del navegador
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('modo-oscuro');
      window.localStorage.setItem('temaChocoPiura', 'oscuro'); // Guarda la preferencia
    } else {
      document.body.classList.remove('modo-oscuro');
      window.localStorage.setItem('temaChocoPiura', 'claro'); // Guarda la preferencia
    }
  }, [isDarkMode]);

  return (
    // ... (Tu código del return se queda EXACTAMENTE igual a partir de aquí)
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-logo">ChocoPiura</div>
      <div className="nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#productos">Productos</a>
        <a href="#contacto">Contacto</a>
      </div>
      
      {/* 3. Contenedor para alinear el nuevo botón y el carrito */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        
        {/* El Botón Interruptor */}
        <button 
          className="btn-tema" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Cambiar tema"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <button className="carrito-btn-nav" onClick={abrirCarrito}>
          🛒 {cantidadTotalItems} (S/ {totalCalculado.toFixed(2)})
        </button>
      </div>
    </nav>
  );
}

export default Navbar;