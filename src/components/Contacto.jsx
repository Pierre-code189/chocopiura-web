import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { collection, addDoc } from 'firebase/firestore'; /* <-- NUEVO IMPORT */
import { db } from '../firebase'; /* <-- NUEVO IMPORT */

function Contacto() {
  const form = useRef();
  const [estadoBoton, setEstadoBoton] = useState('normal'); 

  // --- FUNCIÓN MEJORADA: Doble Acción ---
  const enviarEmail = async (e) => {
    e.preventDefault(); 
    setEstadoBoton('enviando');

    try {
      // Acción 1: Guardar el mensaje en nuestra base de datos (Firebase)
      await addDoc(collection(db, "mensajes"), {
        nombre: form.current.user_name.value,
        email: form.current.user_email.value,
        mensaje: form.current.message.value,
        fecha: new Date().toLocaleString(), // Guardamos la fecha y hora exacta
        isDeleted: false
      });

      // Acción 2: Enviar la alerta a tu correo (EmailJS)
    emailjs.sendForm(
      'service_fologit',   // 1. Reemplaza aquí
      'template_241zpmn',  // 2. Reemplaza aquí
      form.current,
      '2LmGGuriJ9m7SaLLH'    // 3. Reemplaza aquí
    )

      setEstadoBoton('exito');
      form.current.reset(); 
      setTimeout(() => setEstadoBoton('normal'), 4000);

    } catch (error) {
      console.error("Error al procesar el mensaje:", error);
      setEstadoBoton('error');
      setTimeout(() => setEstadoBoton('normal'), 4000);
    }
  };

  return (
    <section id="contacto" className="seccion contacto-contenedor" style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div className="tarjeta-contacto" style={{ backgroundColor: '#FDFBF7', padding: '40px', borderRadius: '15px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ color: '#38220F', marginTop: 0 }}>Hablemos</h2>
        <p style={{ color: '#5C3A21', marginBottom: '30px' }}>
          ¿Tienes un evento especial o quieres hacer un pedido corporativo? Escríbenos y te responderemos lo más pronto posible.
        </p>

        <form ref={form} onSubmit={enviarEmail} className="contenedor-formulario" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="user_name" placeholder="Tu Nombre completo" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #C28F5B', outline: 'none' }} />
          <input type="email" name="user_email" placeholder="Tu Correo Electrónico" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #C28F5B', outline: 'none' }} />
          <textarea name="message" placeholder="¿En qué podemos ayudarte?" required rows="4" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #C28F5B', outline: 'none', resize: 'vertical' }} ></textarea>

          <button type="submit" disabled={estadoBoton === 'enviando'} style={{ padding: '15px', backgroundColor: estadoBoton === 'exito' ? '#2ecc71' : estadoBoton === 'error' ? '#e74c3c' : '#C28F5B', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: estadoBoton === 'enviando' ? 'wait' : 'pointer', transition: 'background-color 0.3s ease' }}>
            {estadoBoton === 'enviando' ? 'Enviando mensaje...' : estadoBoton === 'exito' ? '¡Mensaje Enviado! ✓' : estadoBoton === 'error' ? 'Error. Intenta de nuevo ✖' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contacto;