import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './PanelAdmin.css';

function PanelMensajes() {
  const [mensajes, setMensajes] = useState([]);

  const cargar = async () => {
    const snapshot = await getDocs(collection(db, "mensajes"));
    setMensajes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  useEffect(() => { cargar(); }, []);

  const borrar = async (id) => { if(window.confirm("¿Eliminar mensaje?")) { await deleteDoc(doc(db, "mensajes", id)); cargar(); } };

  return (
    <div className="tarjeta-panel">
      <h3 style={{ margin: '0 0 15px 0', color: '#3498db' }}>✉️ Bandeja de Entrada</h3>
      <table className="tabla-panel">
        <thead><tr><th>Fecha</th><th>Cliente</th><th>Mensaje</th><th>Acción</th></tr></thead>
        <tbody>
          {mensajes.map(m => (
            <tr key={m.id}>
              <td style={{ fontSize: '0.85rem' }}>{m.fecha}</td>
              <td><strong>{m.nombre}</strong><br/><span style={{ fontSize: '0.8rem', color: '#D4A373' }}>{m.email}</span></td>
              <td>{m.mensaje}</td>
              <td><button className="btn-accion btn-rojo" onClick={() => borrar(m.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default PanelMensajes;