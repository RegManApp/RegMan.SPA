import React from 'react';

export default function ConversationList({ conversations = [], onSelect, selectedId }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>
      <ul>
        {conversations.map((c) => (
          <li
            key={c.conversationId}
            onClick={() => onSelect(c)}
            className={`p-3 rounded mb-2 cursor-pointer ${selectedId === c.conversationId ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <div className="font-medium">{c.conversationDisplayName || 'Unknown'}</div>
            <div className="text-sm text-gray-600">{c.lastMessageSnippet}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
