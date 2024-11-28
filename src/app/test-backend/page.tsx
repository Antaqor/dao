"use client";

import React, { useState } from 'react';

const TestBackendPage = () => {
    const [responseMessage, setResponseMessage] = useState<string | null>(null);

    const handleTestConnection = async () => {
        try {
            const res = await fetch('http://152.42.243.146:5000/api/test');
            if (!res.ok) {
                throw new Error(`Failed to connect to backend: ${res.statusText}`);
            }

            // Define type inline or with an interface
            const data: { message: string; success: boolean } = await res.json();

            if (data.success) {
                setResponseMessage(data.message);
            } else {
                setResponseMessage('Backend returned failure response.');
            }
        } catch (error) {
            console.error('Error connecting to backend:', error);
            setResponseMessage('Failed to connect to backend.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Test Backend</h1>
            <button
                onClick={handleTestConnection}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Test Connection
            </button>
            {responseMessage && (
                <p className="mt-4 text-green-600">Response: {responseMessage}</p>
            )}
        </div>
    );
};

export default TestBackendPage;