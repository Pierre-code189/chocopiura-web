// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaInicio from './components/PaginaInicio'; 
import PanelAdmin from './components/PanelAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para la tienda pública */}
        <Route path="/" element={<PaginaInicio />} />
        
        {/* Ruta para el panel de administración */}
        <Route path="/admin" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;