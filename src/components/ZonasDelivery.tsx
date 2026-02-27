import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Ajusta la ruta según la estructura de tus carpetas

export interface ZonaDelivery {
  id?: string;
  nombre: string;
  tarifa: number;
  activo: boolean;
}

interface ZonasDeliveryProps {
  tenantId: string;
}

const ZonasDelivery: React.FC<ZonasDeliveryProps> = ({ tenantId }) => {
  const [zonas, setZonas] = useState<ZonaDelivery[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zonaEditando, setZonaEditando] = useState<ZonaDelivery | null>(null);
  const [formData, setFormData] = useState({ nombre: '', tarifa: 0, activo: true });

  // 1️⃣ RUTA CORREGIDA: Apunta a la raíz de la colección según tu JSON
  const zonasRef = collection(db, 'zonas_delivery');

  useEffect(() => {
    cargarZonas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const cargarZonas = async () => {
    setCargando(true);
    try {
      const snapshot = await getDocs(zonasRef);
      const listaZonas: ZonaDelivery[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        nombre: docSnap.data().nombre,
        tarifa: docSnap.data().tarifa,
        // Fallback defensivo por si un registro antiguo no tiene el campo 'activo'
        activo: docSnap.data().activo !== undefined ? docSnap.data().activo : true, 
      }));
      setZonas(listaZonas);
    } catch (error) {
      console.error("Error al cargar las zonas de delivery:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleOpenModal = (zona?: ZonaDelivery) => {
    if (zona) {
      setZonaEditando(zona);
      setFormData({ nombre: zona.nombre, tarifa: zona.tarifa, activo: zona.activo });
    } else {
      setZonaEditando(null);
      setFormData({ nombre: '', tarifa: 0, activo: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZonaEditando(null);
  };

  const handleToggleActivo = async (id: string, estadoActual: boolean) => {
    try {
      // 2️⃣ RUTA CORREGIDA PARA ACTUALIZAR
      const zonaDocRef = doc(db, 'zonas_delivery', id);
      await updateDoc(zonaDocRef, { activo: !estadoActual });
      setZonas(zonas.map(z => z.id === id ? { ...z, activo: !estadoActual } : z));
    } catch (error) {
      console.error("Error al cambiar el estado de la zona:", error);
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.nombre.trim() === '' || formData.tarifa < 0) {
      alert("Por favor, ingresa un nombre válido y una tarifa igual o mayor a 0.");
      return;
    }

    try {
      if (zonaEditando && zonaEditando.id) {
        // 3️⃣ RUTA CORREGIDA PARA GUARDAR EDICIÓN
        const zonaDocRef = doc(db, 'zonas_delivery', zonaEditando.id);
        await updateDoc(zonaDocRef, {
          nombre: formData.nombre,
          tarifa: Number(formData.tarifa),
          activo: formData.activo
        });
      } else {
        // NUEVA ZONA
        await addDoc(zonasRef, {
          nombre: formData.nombre,
          tarifa: Number(formData.tarifa),
          activo: formData.activo
        });
      }
      handleCloseModal();
      cargarZonas();
    } catch (error) {
      console.error("Error al guardar la zona:", error);
    }
  };

  if (cargando) return <div className="p-4 text-center">Cargando zonas de delivery...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Zonas de Delivery</h2>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + Nueva Zona
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Nombre de Zona</th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tarifa (S/)</th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Estado</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {zonas.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-center text-gray-500">No hay zonas configuradas.</td></tr>
            ) : (
              zonas.map((zona) => (
                <tr key={zona.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium">{zona.nombre}</td>
                  <td className="py-3 px-4 border-b">S/ {zona.tarifa.toFixed(2)}</td>
                  <td className="py-3 px-4 border-b">
                    {/* 4️⃣ INDICADOR VISUAL ROBUSTO */}
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${zona.activo === true ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${zona.activo === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {zona.activo === true ? 'HABILITADA' : 'INACTIVA'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b text-center flex justify-center gap-3">
                    <button onClick={() => handleOpenModal(zona)} className="text-blue-500 hover:text-blue-700 font-medium">Editar</button>
                    <button onClick={() => handleToggleActivo(zona.id!, zona.activo)} className="text-gray-500 hover:text-gray-700 font-medium">
                      {zona.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">{zonaEditando ? 'Editar Zona' : 'Nueva Zona'}</h3>
            <form onSubmit={handleGuardar}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de la Zona/Distrito</label>
                <input 
                  type="text" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. Castilla"
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Costo de Envío (S/)</label>
                <input 
                  type="number" 
                  step="0.10"
                  min="0"
                  value={formData.tarifa} 
                  onChange={(e) => setFormData({...formData, tarifa: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
              <div className="mb-6 flex items-center bg-gray-50 p-3 rounded border">
                {/* 5️⃣ CHECKBOX GARANTIZADO */}
                <input 
                  type="checkbox" 
                  checked={!!formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  className="w-5 h-5 mr-3 accent-blue-600 cursor-pointer"
                  id="activoCheck"
                />
                <label className="text-sm text-gray-800 font-bold cursor-pointer select-none" htmlFor="activoCheck">
                  ¿Zona Habilitada? (Visible para el Bot)
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded text-gray-800 font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold shadow-sm transition-colors">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonasDelivery;