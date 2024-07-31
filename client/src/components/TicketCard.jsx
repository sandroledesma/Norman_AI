import React from 'react';
import { useNavigate } from 'react-router-dom';

function TicketCard({ ticketData }) {
    const navigate = useNavigate();

    const handleOpenTicket = () => {
        navigate(`/tickets/${ticketData.id}`);
    };

    return (
        <div className="ticket-card border p-4 mb-4 rounded shadow-lg">
            <h3 className="text-xl font-bold">Ticket ID: {ticketData.id}</h3>
            <p><strong>Status:</strong> {ticketData.status}</p>
            <p><strong>Tag:</strong> {ticketData.tag}</p>
            <p><strong>Description:</strong> {ticketData.description}</p>
            <button 
                className="bg-blue-500 text-black px-4 py-2 rounded mt-4" 
                onClick={handleOpenTicket}
            >
                OPEN
            </button>
        </div>
    );
}

export default TicketCard;