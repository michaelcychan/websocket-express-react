import { useEffect, useRef, useState } from 'react'

import './App.css'

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<null | WebSocket>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/chat');
    wsRef.current = ws;
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setMessages(prev => [...prev, 'Websocket connected!'])
    }

    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      setMessages(prev => [...prev, event.data])
    }

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setMessages(prev => [...prev, 'Websocket disconnected!'])
    }

    return () => {
      ws.close();
      wsRef.current = null;
    }
  }, [])

  useEffect(() => {
    inputRef.current?.focus();
  },[])


  const handleSendMessage = () => {
    const input = document.getElementById('chat-input') as HTMLInputElement;
    const message = input.value.trim();
    if (message && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log(`Sending message: ${message}`);
      wsRef.current.send(message);
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
        <div id='chat-box' style={{ display: 'flex', flexDirection: 'column', height: '400px', width: '300px', border: '1px solid black', padding: '10px' }}>
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
