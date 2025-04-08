import { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { AuthedUserContext } from '../../App';
import './Chatbot.css';

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const Chatbot = () => {
  const user = useContext(AuthedUserContext);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Hi!👋 ${user.username} I’m your RentXpress assistant. Ask me anything about cars, rentals, or dealer access!` },
  ]);

  const [messageHistory, setMessageHistory] = useState([]); // 🧠 for GPT's memory
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
          history: messageHistory, // 👈 Send memory
        }),
      });

      const data = await res.json();

      const botMessage = { sender: 'bot', text: data.reply || 'Sorry, something went wrong.' };
      setMessages(prev => [...prev, botMessage]);

      // 👇 Store updated memory from backend
      setMessageHistory(data.history || []);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to AI. Try again later.' }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-box shadow-lg">
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-message ${msg.sender}`}>
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }} />
                  )
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
          <button className="btn btn-warning" onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
