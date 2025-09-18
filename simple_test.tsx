// Simple React test file for Copilot instruction verification
import React from 'react';

// Missing TypeScript types, poor component structure
function BadComponent({ data }) {
    // Missing accessibility, no error handling
    return (
        <div>
            <button onClick={() => console.log('clicked')}>
                Click me
            </button>
            {data.map(item => (
                <span>{item.name}</span>  // Missing key prop
            ))}
        </div>
    );
}