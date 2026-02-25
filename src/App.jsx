import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PaginaInicio from './components/PaginaInicio'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tu tienda pública */}
        <Route path="/" element={<PaginaInicio />} />
        
        {/* Regla comodín: Si escriben /admin o cualquier cosa rara, los devuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;