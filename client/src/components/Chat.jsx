import React, { useState } from 'react';

function ChatBot() {
    const [messages, setMessages] = useState([
        { text: "Hello! I am Norman, how may I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim()) {
            const newMessages = [...messages, { text: input, sender: 'user' }];
            setMessages(newMessages);
            setInput('');

            try {
                const response = await fetch('http://127.0.0.1:5555/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ messages: newMessages }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(prevMessages => [...prevMessages, { text: data.response, sender: 'bot' }]);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col bg-green h-[800px] max-w-xl mx-auto rounded-lg shadow-lg">
            {/* Chat Header */}
            <div className="bg-blue-500 text-black text-center py-3 rounded-t-lg bg-forest-green border-b">
                <h2 className="text-xl font-bold">NORMAN AI CHATBOT</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 bg-white overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-black' : 'bg-gray-200 text-black'}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="flex p-4 border-t border-gray-300 bg-forest-green rounded-md gap-2">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-4 border rounded-l-lg"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-black p-4 rounded-r-lg hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatBot;

