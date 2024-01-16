import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { UlMensajes, LiMensaje } from './ui-components';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [usuario, setUsuario] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('solicitar_usuario', () => {
      const nombreUsuario = prompt('Ingresa tu nombre de usuario:');
      setUsuario(nombreUsuario);
      socket.emit('usuario', nombreUsuario);
    });

    socket.on('chat_message', (data) => {
      setMensajes((mensajes) => [...mensajes, data]);
    });

    return () => {
      socket.off('connect');
      socket.off('solicitar_usuario');
      socket.off('chat_message');
    };
  }, []);

  const enviarMensaje = () => {
    socket.emit('chat_message', {
      usuario: usuario,
      mensaje: nuevoMensaje,
    });
  };

  return (
    <div className="App">
      <div className="panel">
        <h2>{isConnected ? 'CONECTADO' : 'NO CONECTADO'}</h2>
        <UlMensajes className="UlMensajes">
          {mensajes.map((mensaje, index) => (
            <LiMensaje key={index} className="LiMensaje">
              {mensaje.usuario}: {mensaje.mensaje}
            </LiMensaje>
          ))}
        </UlMensajes>
        <input
          type="text"
          onChange={(e) => setNuevoMensaje(e.target.value)}
          className="inputMensaje"
        />
        <button onClick={enviarMensaje} className="buttonEnviar">
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;
