import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        const response = await axios.post('/api/chat', { message: input });
        setMessages([...messages, { text: input, from: 'user' }, { text: response.data.message, from: 'bot' }]);
        setInput('');
    };

    return (
        <div>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.from}`}>{msg.text}</div>
                ))}
            </div>
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;