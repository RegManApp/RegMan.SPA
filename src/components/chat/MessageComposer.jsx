import React, { useState } from 'react';

export default function MessageComposer({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    await onSend(text.trim());
    setText('');
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2 mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button className="btn btn-primary px-4 py-2" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}
