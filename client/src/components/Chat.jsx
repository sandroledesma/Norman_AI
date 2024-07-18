import React, { useState, useEffect } from 'react';

function ChatBot() {
    const [messages, setMessages] = useState([
        { text: "Hello! I am Norman, how may I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[500px] max-w-sm mx-auto bg-white rounded-lg shadow-lg">
            {/* Chat Header */}
            <div className="bg-blue-500 text-white text-center py-3 rounded-t-lg">
                <h2 className="text-xl font-bold">Norman - AI ChatBot</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="flex p-4 border-t border-gray-300">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded-l-lg"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatBot;
