import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './PanelAdmin.css';

function PanelDashboard() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const cargarPedidos = async () => {
      const snapshot = await getDocs(collection(db, "pedidos"));
      setPedidos(snapshot.docs.map(doc => doc.data()));
    };
    cargarPedidos();
  }, []);

  const totalPedidos = pedidos.length;
  const ingresosTotales = pedidos.reduce((suma, p) => suma + p.totalPagado, 0);
  const ticketPromedio = totalPedidos > 0 ? (ingresosTotales / totalPedidos) : 0;
  const entregados = pedidos.filter(p => p.estado.includes('Entregado')).length;

  return (
    <div>
      <h2 style={{ color: '#C28F5B', marginTop: 0, marginBottom: '25px' }}>Visión General</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        <div className="tarjeta-dashboard" style={{ borderLeft: '5px solid #2ecc71', backgroundColor: '#2C1A0B' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#A67B4D' }}>💰 Ingresos Totales</h4>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>S/ {ingresosTotales.toFixed(2)}</p>
        </div>

        <div className="tarjeta-dashboard" style={{ borderLeft: '5px solid #3498db', backgroundColor: '#2C1A0B' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#A67B4D' }}>📦 Pedidos</h4>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{totalPedidos}</p>
          <div style={{ fontSize: '0.85rem', color: '#95a5a6' }}>
            <span style={{ color: '#2ecc71' }}>{entregados} Listos</span> | <span style={{ color: '#f39c12' }}>{totalPedidos - entregados} Pendientes</span>
          </div>
        </div>

        <div className="tarjeta-dashboard" style={{ borderLeft: '5px solid #f1c40f', backgroundColor: '#2C1A0B' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#A67B4D' }}>📊 Ticket Promedio</h4>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>S/ {ticketPromedio.toFixed(2)}</p>
        </div>

      </div>
    </div>
  );
}
export default PanelDashboard;