import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './PanelAdmin.css';

function PanelPromociones() {
  const [cupones, setCupones] = useState([]);
  const [form, setForm] = useState({ codigo: '', tipo: 'porcentaje', valor: '', desc: '' });

  const cargar = async () => {
    const snapshot = await getDocs(collection(db, "cupones"));
    setCupones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "cupones"), { codigo: form.codigo.toUpperCase(), tipo: form.tipo, valor: form.tipo==='envio' ? 0 : Number(form.valor), descripcion: form.desc });
    setForm({ codigo: '', tipo: 'porcentaje', valor: '', desc: '' }); cargar();
  };

  const borrar = async (id) => { if(window.confirm("¿Desactivar cupón?")) { await deleteDoc(doc(db, "cupones", id)); cargar(); } };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div className="tarjeta-panel" style={{ flex: '1 1 300px' }}>
        <h3 style={{ color: '#f1c40f', margin: '0 0 15px 0' }}>🎟️ Crear Promoción</h3>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input className="input-panel" placeholder="CÓDIGO (Ej. MAMA20)" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} required />
          <select className="input-panel" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
            <option value="porcentaje">Descuento (%)</option><option value="envio">Envío Gratis</option>
          </select>
          {form.tipo === 'porcentaje' && <input className="input-panel" type="number" step="0.01" placeholder="Valor (Ej. 0.20)" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} required />}
          <input className="input-panel" placeholder="Descripción breve" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} required />
          <button className="btn-accion btn-amarillo">Activar Cupón</button>
        </form>
      </div>

      <div className="tarjeta-panel" style={{ flex: '2 1 400px', overflowX: 'auto' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>🏷️ Cupones Activos</h3>
        <table className="tabla-panel">
          <thead><tr><th>Código</th><th>Beneficio</th><th>Acción</th></tr></thead>
          <tbody>
            {cupones.map(c => (
              <tr key={c.id}>
                <td style={{ color: '#f1c40f', fontWeight: 'bold' }}>{c.codigo}</td>
                <td>{c.tipo === 'porcentaje' ? `-${c.valor * 100}%` : 'Envío Gratis'}</td>
                <td><button className="btn-accion btn-rojo" onClick={() => borrar(c.id)}>Desactivar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default PanelPromociones;