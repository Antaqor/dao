// pages/test-backend.tsx

'use client';

import React, { useState } from 'react';

const TestBackendPage = () => {
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const testBackend = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/ping', {  // Updated port to 5001
                method: 'GET',
            });

            if (!res.ok) {
                throw new Error(`Failed to connect to backend: ${res.statusText}`);
            }

            const data: { message: string } = await res.json();
            setResponse(data.message);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setResponse(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Test Backend</h1>
            <button
                onClick={testBackend}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Test Connection
            </button>

            {response && (
                <div className="mt-4 text-green-700">
                    <p>Response: {response}</p>
                </div>
            )}

            {error && (
                <div className="mt-4 text-red-600">
                    <p>Error: {error}</p>
                </div>
            )}
        </div>
    );
};

export default TestBackendPage;