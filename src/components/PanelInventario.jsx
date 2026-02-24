import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './PanelAdmin.css';

function PanelInventario() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ sabor: '', precio: '', categoria: 'Clásica', url: '', desc: '' });
  const [editandoId, setEditandoId] = useState(null);

  const cargar = async () => {
    const snapshot = await getDocs(collection(db, "productos"));
    setProductos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    const datos = { sabor: form.sabor, precio: Number(form.precio), categoria: form.categoria, descripcion: form.desc, imagenes: [form.url] };
    if (editandoId) {
      await updateDoc(doc(db, "productos", editandoId), datos);
    } else {
      await addDoc(collection(db, "productos"), datos);
    }
    setForm({ sabor: '', precio: '', categoria: 'Clásica', url: '', desc: '' }); setEditandoId(null); cargar();
  };

  const borrar = async (id) => { if (window.confirm("¿Borrar?")) { await deleteDoc(doc(db, "productos", id)); cargar(); } };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div className="tarjeta-panel" style={{ flex: '1 1 300px' }}>
        <h3 style={{ color: editandoId ? '#3498db' : 'white', margin: '0 0 15px 0' }}>{editandoId ? '✏️ Editar' : '➕ Añadir'} Sabor</h3>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input className="input-panel" placeholder="Sabor" value={form.sabor} onChange={e => setForm({...form, sabor: e.target.value})} required />
          <input className="input-panel" type="number" step="0.5" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
          <select className="input-panel" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
            <option>Clásica</option><option>Especial</option><option>Box</option>
          </select>
          <input className="input-panel" placeholder="URL Foto" value={form.url} onChange={e => setForm({...form, url: e.target.value})} required />
          <button className={`btn-accion ${editandoId ? 'btn-azul' : 'btn-verde'}`}>{editandoId ? 'Actualizar' : 'Guardar'}</button>
          {editandoId && <button type="button" className="btn-accion btn-rojo" onClick={() => {setEditandoId(null); setForm({sabor:'', precio:'', categoria:'Clásica', url:'', desc:''})}}>Cancelar</button>}
        </form>
      </div>

      <div className="tarjeta-panel" style={{ flex: '2 1 400px', overflowX: 'auto' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>📦 Inventario</h3>
        <table className="tabla-panel">
          <thead><tr><th>Sabor</th><th>Precio</th><th>Acciones</th></tr></thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.sabor}</td><td>S/ {p.precio.toFixed(2)}</td>
                <td>
                  <button className="btn-accion btn-amarillo" style={{marginRight: '5px'}} onClick={() => {setEditandoId(p.id); setForm({sabor: p.sabor, precio: p.precio, categoria: p.categoria, url: p.imagenes[0], desc: p.descripcion})}}>Editar</button>
                  <button className="btn-accion btn-rojo" onClick={() => borrar(p.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default PanelInventario;