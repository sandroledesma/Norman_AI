import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NormanLogo from '../assets/Norman_logo.png';


function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [status, setStatus] = useState('');
    const [tag, setTag] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const [updateTag, setUpdateTag] = useState('');
    const [showAIGentBox, setShowAIGentBox] = useState(false);
    const [aiResponse, setAIResponse] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [editedResponse, setEditedResponse] = useState('');

    const statusOptions = ['Open', 'Pending', 'Assigned', 'In Process', 'Priority', 'Closed'];
    const tagOptions = ['Engineering', 'Product', 'Design', 'Quality', 'Service'];

    useEffect(() => {
        fetch(`http://127.0.0.1:5555/tickets/${id}`)
            .then(response => response.json())
            .then(data => {
                setTicket(data);
                setStatus(data.status);
                setTag(data.tag);
            })
            .catch(error => console.error('Error fetching ticket data:', error));
    }, [id]);

    const handleStatusChange = (e) => {
        setUpdateStatus(e.target.value);
    };

    const handleTagChange = (e) => {
        setUpdateTag(e.target.value);
    };

    const handleStatusSubmit = () => {
        fetch(`http://127.0.0.1:5555/tickets/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: updateStatus }),
        })
        .then(response => response.json())
        .then(() => {
            setStatus(updateStatus);
            setUpdateStatus('');
        })
        .catch(error => console.error('Error updating status:', error));
    };

    const handleTagSubmit = () => {
        fetch(`http://127.0.0.1:5555/tickets/${id}/tag`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tag: updateTag }),
        })
        .then(response => response.json())
        .then(() => {
            setTag(updateTag);
            setUpdateTag('');
        })
        .catch(error => console.error('Error updating tag:', error));
    };

    const handleAIGentClick = () => {
        setShowAIGentBox(!showAIGentBox);
        if (!showAIGentBox) {
            setAIResponse('');
            setEditedResponse('');
        }
    };

    const generateAIResponse = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('http://127.0.0.1:5555/generate-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: ticket.description }),
            });
            const data = await response.json();
            setAIResponse(data.response);
            setEditedResponse(data.response);
            setIsGenerating(false);
        } catch (error) {
            console.error('Error generating AI response:', error);
            setIsGenerating(false);
        }
    };

    const handleResponseChange = (e) => {
        setEditedResponse(e.target.value);
    };

    const handleApprove = () => {
        console.log('Response approved:', editedResponse);
    };

    const handleEdit = () => {
        console.log('Response edited:', editedResponse);
    };

    const handleRerun = () => {
        generateAIResponse();
    };

    if (!ticket) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-row h-full max-w-full mx-auto rounded-lg shadow-lg p-6 space-x-4">
            {/* Ticket Information Column */}
            <div className="bg-white shadow-md rounded w-1/2 p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Ticket Information</h2>
                <div className="mb-6">
                    <p><strong>Status:</strong> {status}</p>
                    <p><strong>Ticket ID:</strong> {ticket.id}</p>
                    <p><strong>Timestamp:</strong> {new Date(ticket.timestamp).toLocaleString()}</p>
                    <p><strong>Assigned To:</strong> {ticket.assigned_to_firstname} {ticket.assigned_to_lastname}</p>
                    <p><strong>Tag:</strong> {tag}</p>
                    <p><strong>Description:</strong> {ticket.description}</p>
                    <p><strong>Consumer Name:</strong> {ticket.consumer_name}</p>
                    <p><strong>Consumer Email:</strong> {ticket.consumer_email}</p>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Update Status</h3>
                    <div className="flex items-center">
                        <select value={updateStatus} onChange={handleStatusChange} className="p-2 border rounded w-64">
                            <option value="">Select status</option>
                            {statusOptions.map((statusOption, index) => (
                                <option key={index} value={statusOption}>{statusOption}</option>
                            ))}
                        </select>
                        <button onClick={handleStatusSubmit} className="bg-blue-500 text-white p-2 rounded ml-4">Submit</button>
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Update Tag</h3>
                    <div className="flex items-center">
                        <select value={updateTag} onChange={handleTagChange} className="p-2 border rounded w-64">
                            <option value="">Select tag</option>
                            {tagOptions.map((tagOption, index) => (
                                <option key={index} value={tagOption}>{tagOption}</option>
                            ))}
                        </select>
                        <button onClick={handleTagSubmit} className="bg-blue-500 text-white p-2 rounded ml-4">Submit</button>
                    </div>
                </div>
            </div>
    
            {/* Ticket AI-GENT Column */}
            <div className="bg-white shadow-md rounded w-1/2 p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Ticket AI-GENT</h2>
                {isGenerating ? (
                    <p className="text-center">Generating response...</p>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <button onClick={handleRerun} className="bg-red-500 text-white p-2 rounded">GENERATE RESPONSE</button>
                        </div>
                        <textarea 
                            value={editedResponse} 
                            onChange={handleResponseChange} 
                            className="w-full h-96 p-2 border rounded mb-4"
                            placeholder="Response will be generated here..."
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={handleApprove} className="bg-green-500 text-white p-2 rounded">Approve</button>
                            <button onClick={handleEdit} className="bg-yellow-500 text-white p-2 rounded">Edit</button>
                            <button onClick={handleRerun} className="bg-red-500 text-white p-2 rounded">Rerun</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}    

export default TicketDetail;
    
