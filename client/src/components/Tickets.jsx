import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [statusCounts, setStatusCounts] = useState({});
    const [selectedStatus, setSelectedStatus] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5555/tickets")
            .then(response => response.json())
            .then(tickets => {
                setTickets(tickets);
                calculateStatusCounts(tickets);
            })
            .catch(error => console.log('Error fetching tickets', error));
    }, []);

    const calculateStatusCounts = (tickets) => {
        const counts = tickets.reduce((acc, ticket) => {
            const { status } = ticket;
            if (status) {
                acc[status] = (acc[status] || 0) + 1;
            }
            return acc;
        }, {});
        setStatusCounts(counts);
    };

    const handleStatusClick = (status) => {
        setSelectedStatus(status === selectedStatus ? null : status);
    };

    const filteredTickets = selectedStatus 
        ? tickets.filter(ticket => ticket.status === selectedStatus) 
        : tickets;

    return (    
        <div className="p-4 bg-light-green">
            <div className="mb-4">
                <h2>Status Counts</h2>
                <div className="mb-2">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => handleStatusClick(status)}
                            className={`mr-2 px-4 py-2 rounded ${status === selectedStatus ? 'bg-green text-black' : 'bg-forest-green'}`}
                        >
                            {status} ({count})
                        </button>
                    ))}
                    {selectedStatus && (
                        <button
                            onClick={() => handleStatusClick(null)}
                            className="ml-2 px-4 py-2 rounded bg-forest-green text-black"
                        >
                            Show All
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap justify-center">
                {filteredTickets.map(ticket => (
                    <div className="p-2 h-100 w-full md:w-1/3" key={ticket.id}>
                        <TicketCard ticketData={ticket} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tickets;
