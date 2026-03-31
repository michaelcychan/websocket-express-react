import { useEffect, useRef, useState } from 'react'
import './App.css'
import { sendWS } from './utils/sendWS';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<null | WebSocket>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    wsRef.current = null;
    setIsConnected(false);
  }

  const handleConnect = () => {
    const name = nameInputRef.current?.value || '';
    if (name.trim().length === 0 || isConnected) return;
    if (wsRef.current) return;
    const ws = new WebSocket(`ws://localhost:8080/chat?username=${name}`);
    wsRef.current = ws;
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setMessages(prev => [...prev, 'Websocket connected!'])
      setIsConnected(true);
    }
    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      setMessages(prev => [...prev, event.data])
    }

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setMessages(prev => [...prev, 'Websocket disconnected!'])
      wsRef.current = null;
      setIsConnected(false);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  useEffect(() => {
    return () => {
      handleDisconnect();
    }
  }, [])


  const handleSendMessage = () => {
    const input = document.getElementById('chat-input') as HTMLInputElement;
    const message = input.value.trim();
    if (message && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log(`Sending message: ${message}`);
      sendWS(wsRef.current, message);
      input.value = '';
      inputRef.current?.focus();
    }
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }

  return (
    <>
      <section id="center">
        <input type="text" ref={nameInputRef} placeholder='Enter username...' style={{ marginBottom: '10px' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleConnect()} style={{ marginBottom: '20px' }} disabled={isConnected}>
            Connect
          </button>
          <button onClick={() => handleDisconnect()} style={{ marginBottom: '20px' }} disabled={!isConnected}>
            Disconnect
          </button>
        </div>
        <div id='chat-box' style={{ display: 'flex', flexDirection: 'column', height: '400px', width: '300px', border: '1px solid white', padding: '10px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '5px', border: '1px solid black', padding: '5px' }}>
              {msg}
            </div>
          ))}
        </div>
        <input type="text" ref={inputRef} onKeyDown={onInputKeyDown} id='chat-input' style={{ width: '300px', marginTop: '10px' }} placeholder='Type your message here...' />
        <button id='send-button' style={{ marginTop: '10px' }} onClick={handleSendMessage}>
          Send
        </button>

      </section>



    </>
  )
}

export default App
