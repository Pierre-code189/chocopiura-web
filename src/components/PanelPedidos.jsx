import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './PanelAdmin.css';

function PanelPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');

  const cargarPedidos = async () => {
    const snapshot = await getDocs(collection(db, "pedidos"));
    setPedidos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { cargarPedidos(); }, []);

  const marcarEntregado = async (id) => {
    await updateDoc(doc(db, "pedidos", id), { estado: 'Entregado ✅' });
    cargarPedidos();
  };

  const filtrados = pedidos.filter(p => {
    if (filtro === 'Pendientes') return p.estado.includes('Pendiente');
    if (filtro === 'Entregados') return p.estado.includes('Entregado');
    return true;
  });

  return (
    <div className="tarjeta-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#2ecc71' }}>💰 Historial de Pedidos</h3>
        <select className="input-panel" style={{ width: 'auto' }} value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="Todos">Todos</option><option value="Pendientes">Pendientes</option><option value="Entregados">Entregados</option>
        </select>
      </div>
      
      <table className="tabla-panel">
        <thead>
          <tr><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {[...filtrados].reverse().map(p => (
            <tr key={p.id} style={{ opacity: p.estado.includes('Entregado') ? '0.6' : '1' }}>
              <td style={{ fontSize: '0.85rem' }}>{p.fecha}</td>
              <td><strong>{p.cliente}</strong><br/><span style={{ fontSize: '0.8rem', color: '#D4A373' }}>{p.zona}</span></td>
              <td>{p.productos}</td>
              <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>S/ {p.totalPagado.toFixed(2)}</td>
              <td>
                {p.estado.includes('Entregado') ? <span>{p.estado}</span> : 
                <button className="btn-accion btn-verde" onClick={() => marcarEntregado(p.id)}>Marcar Entregado</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default PanelPedidos;