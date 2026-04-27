import { useEffect, useRef, useState } from 'react'
import './App.css'
import { sendWS } from './utils/sendWS';
import { type Message, type SystemMessage, messageSchema } from 'my-shared-ws';


function App() {
  const [messages, setMessages] = useState<Message[]>([]);
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

  const buildConnectMessage = (): SystemMessage => ({
    type: "system",
    content: "Websocket connected!",
    timestamp: Date.now()
  })


  const buildDisconnectedMessage = (): SystemMessage => ({
    type: "system",
    content: "Websocket disconnected!",
    timestamp: Date.now(),
  })

  const simpleParseEventData = (data:string) => {
    try {
      const parsed = messageSchema.safeParse(JSON.parse(data));
      if (!parsed.success) return null;
      return parsed.data;
    } catch (error) {
      return null
    }
  }

  const handleConnect = () => {
    const name = nameInputRef.current?.value || '';
    if (name.trim().length === 0 || isConnected) return;
    if (wsRef.current) return;
    const ws = new WebSocket(`ws://localhost:8080/chat?username=${name}`);
    wsRef.current = ws;
    ws.onopen = () => {
      const defaultConnectedMessage = buildConnectMessage();
      setMessages(prev => [...prev, defaultConnectedMessage])
      setIsConnected(true);
    }
    ws.onmessage = (event) => {
      const parsed = simpleParseEventData(event.data);
      if (!parsed) return;
      setMessages(prev => [...prev, parsed])
    }

    ws.onclose = () => {
      const disconnectMessage = buildDisconnectedMessage();
      setMessages(prev => [...prev, disconnectMessage])
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
          {messages.map((msg, idx) => {
            if (msg.type === 'system') {
              return (
                <div key={idx} style={{ marginBottom: '5px', border: '1px solid yellow', padding: '5px', color: 'floralwhite' }}>
                  {msg.content}
                </div>
              )
            }
            if (msg.type === 'message') {
              return (
                <div key={idx} style={{ marginBottom: '5px', border: '1px solid white', padding: '5px', color: 'gold' }}>
                  {msg.sender}: {msg.content}
                </div>
              )
            }

          })}
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
