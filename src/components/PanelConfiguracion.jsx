import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Subimos un nivel para encontrar firebase.js

function PanelConfiguracion() {
  const [horaApertura, setHoraApertura] = useState(9);
  const [horaCierre, setHoraCierre] = useState(22);

  // Se carga solo cuando entras a esta pestaña
  useEffect(() => {
    const cargarConfiguracion = async () => {
      const docSnap = await getDoc(doc(db, "configuracion", "tienda"));
      if (docSnap.exists()) {
        setHoraApertura(docSnap.data().apertura);
        setHoraCierre(docSnap.data().cierre);
      } else {
        await setDoc(doc(db, "configuracion", "tienda"), { apertura: 9, cierre: 22 });
      }
    };
    cargarConfiguracion();
  }, []);

  const guardarHorarios = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "configuracion", "tienda"), { 
      apertura: Number(horaApertura), 
      cierre: Number(horaCierre) 
    });
    alert("¡Horario de atención actualizado!");
  };

  return (
    <div>
      <h2 style={{ color: '#C28F5B', marginTop: 0, marginBottom: '25px' }}>Configuración del Negocio</h2>
      
      <div style={{ backgroundColor: '#2C1A0B', padding: '25px', borderRadius: '12px', border: '1px solid #4A3018' }}>
        <h3 style={{ marginTop: 0, color: '#f39c12' }}>⏱️ Horario de Atención</h3>
        <p style={{ color: '#D4A373', fontSize: '0.9rem', marginBottom: '15px' }}>
          Usa formato de 24 horas (Ejemplo: 9 para 9:00 AM, 22 para 10:00 PM).
        </p>
        
        <form onSubmit={guardarHorarios} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#A67B4D', fontWeight: 'bold' }}>Hora de Apertura:</label>
            <input type="number" min="0" max="23" value={horaApertura} onChange={(e) => setHoraApertura(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #C28F5B', background: '#1A0F07', color: 'white', width: '100px', textAlign: 'center' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#A67B4D', fontWeight: 'bold' }}>Hora de Cierre:</label>
            <input type="number" min="0" max="23" value={horaCierre} onChange={(e) => setHoraCierre(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #C28F5B', background: '#1A0F07', color: 'white', width: '100px', textAlign: 'center' }} />
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#f39c12', color: '#1A0F07', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '40px' }}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default PanelConfiguracion;