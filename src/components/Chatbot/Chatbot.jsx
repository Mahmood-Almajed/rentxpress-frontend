import { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { AuthedUserContext } from '../../App';
import { Collapse } from 'react-collapse';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const Chatbot = () => {
  const user = useContext(AuthedUserContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Hi!👋 ${user?.username} I’m your CarXpress assistant. Ask me anything about cars, rentals, or dealer access!` },
  ]);
  
  const [messageHistory, setMessageHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [isOpen, setIsOpen] = useState(false);
  const [boxWidth, setBoxWidth] = useState(400);

  const handleMouseDown = (e) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    const newWidth = window.innerWidth - 20 - e.clientX;
    setBoxWidth(Math.max(300, Math.min(newWidth, 600)));
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messageHistory,
        }),
      });
      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.reply || 'Sorry, something went wrong.' };
      setMessages(prev => [...prev, botMessage]);
      setMessageHistory(data.history || []);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to AI. Try again later.' }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </div>
      
      <Collapse isOpened={isOpen}>
        <div className="chatbot-box shadow-lg" style={{ width: `${boxWidth}px` }}>
          <div className="resizable-handle" onMouseDown={handleMouseDown}></div>
          
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.sender}`}>
                <ReactMarkdown
  components={{
    a: ({ node, ...props }) => {
      const href = props.href;
      const isFullLink = href.startsWith('http');
      const isInternalDomain = href.includes('carxpress-frontend.vercel.app') || href.includes('localhost:5173');
      const carPathMatch = href.match(/\/cars\/[a-z0-9]+/i); 

      if (isFullLink && isInternalDomain && carPathMatch) {
        return (
          <span
            onClick={() => navigate(carPathMatch[0])}
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {props.children}
          </span>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007bff', textDecoration: 'underline' }}
        >
          {props.children}
        </a>
      );
    }
  }}
>
  {msg.text}
</ReactMarkdown>

              </div>
            ))}
            {loading && <div className="chatbot-message bot">Typing...</div>}
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              className="form-control"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="btn" style={{backgroundColor:"#06b4d8"}} onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Chatbot;
