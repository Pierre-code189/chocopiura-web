import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// 1. Salimos de la carpeta components para buscar a firebase en src
import { auth } from '../firebase'; 

// 2. Cargamos el CSS que ya está en la misma carpeta
import './PanelAdmin.css'; 

// 3. Importamos los demás paneles que viven exactamente en la misma carpeta
import PanelDashboard from './PanelDashboard';
import PanelPedidos from './PanelPedidos';
import PanelInventario from './PanelInventario';
import PanelPromociones from './PanelPromociones';
import PanelMensajes from './PanelMensajes';
import PanelConfiguracion from './PanelConfiguracion';

function PanelAdmin() {
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [vistaActiva, setVistaActiva] = useState('dashboard'); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUsuario(user));
    return () => unsubscribe();
  }, []);

  const iniciarSesion = async (e) => {
    e.preventDefault(); setError('');
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (error) { setError('Credenciales incorrectas.'); }
  };

  const estiloBotonNav = (activo) => ({
    padding: '12px 15px', backgroundColor: activo ? '#C28F5B' : 'transparent', color: activo ? '#1A0F07' : '#FDFBF7',
    border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', marginBottom: '5px'
  });

  if (!usuario) {
    return (
      <div className="panel-contenedor" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>🔒 Acceso Restringido</h2>
          <form onSubmit={iniciarSesion} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
            <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" className="input-panel" />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="input-panel" />
            {error && <p style={{ color: '#e74c3c', margin: 0 }}>{error}</p>}
            <button type="submit" className="btn-accion btn-amarillo">Entrar al Panel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-contenedor">
      <aside className="panel-sidebar">
        <h2 style={{ color: '#C28F5B', textAlign: 'center', margin: '0 0 5px 0' }}>⚙️ NovaWeb</h2>
        <p style={{ textAlign: 'center', color: '#A67B4D', fontSize: '0.8rem', marginBottom: '40px' }}>Admin Panel</p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <button onClick={() => setVistaActiva('dashboard')} style={estiloBotonNav(vistaActiva === 'dashboard')}>📊 Dashboard</button>
          <button onClick={() => setVistaActiva('pedidos')} style={estiloBotonNav(vistaActiva === 'pedidos')}>💰 Pedidos</button>
          <button onClick={() => setVistaActiva('inventario')} style={estiloBotonNav(vistaActiva === 'inventario')}>📦 Inventario</button>
          <button onClick={() => setVistaActiva('cupones')} style={estiloBotonNav(vistaActiva === 'cupones')}>🎟️ Promociones</button>
          <button onClick={() => setVistaActiva('mensajes')} style={estiloBotonNav(vistaActiva === 'mensajes')}>✉️ Mensajes</button>
          <button onClick={() => setVistaActiva('configuracion')} style={estiloBotonNav(vistaActiva === 'configuracion')}>⏱️ Configuración</button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #4A3018', paddingTop: '20px' }}>
          <a href="/" style={{ display: 'block', textAlign: 'center', color: '#FDFBF7', textDecoration: 'none', marginBottom: '15px' }}>👁️ Ver Tienda Pública</a>
          <button onClick={() => signOut(auth)} className="btn-accion btn-rojo" style={{ width: '100%' }}>Cerrar Sesión</button>
        </div>
      </aside>

      <main className="panel-main">
        {vistaActiva === 'dashboard' && <PanelDashboard />}
        {vistaActiva === 'pedidos' && <PanelPedidos />}
        {vistaActiva === 'inventario' && <PanelInventario />}
        {vistaActiva === 'cupones' && <PanelPromociones />}
        {vistaActiva === 'mensajes' && <PanelMensajes />}
        {vistaActiva === 'configuracion' && <PanelConfiguracion />}
      </main>
    </div>
  );
}

export default PanelAdmin;