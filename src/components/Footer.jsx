import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-bloque">
          <h3 className="footer-logo">ChocoPiura</h3>
          <p>Artesanía en cada mordisco. El verdadero sabor de Piura directamente a tu mesa.</p>
        </div>
        <div className="footer-bloque">
          <h4>Enlaces Rápidos</h4>
          <a href="#inicio">Inicio</a>
          <a href="#productos">Catálogo</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="footer-bloque">
          <h4>Síguenos</h4>
          <div className="redes-iconos">
            <a href="#" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
            <a href="#" target="_blank" rel="noopener noreferrer">🎵 TikTok</a>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} ChocoPiura. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
export default Footer;