import React, { useState, useEffect } from 'react';
import { useParams } from  'react-router-dom';

function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [ticketDetails, setTicketDetails] = useState({});

    useEffect(() => {
        fetch(`http://127.0.0.1:5555/tickets/${id}`)
            .then(response => response.json())
            .then(data => setTicket(data))
            .catch(error => console.error('Error fetching ticket data:', error))
    }, [id]);

    if (!ticket) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2>{ticket.id}</h2>
            <p>{ticket.description}</p>
            <p>{ticket.assigned_to}</p>
        </div>
    )
}

export default TicketDetail;