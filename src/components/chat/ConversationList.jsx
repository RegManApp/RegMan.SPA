import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ConversationList({ conversations = [], onSelect, selectedId, unreadByConversationId = {} }) {
  const { t } = useTranslation();
  return (
    <div className="p-4 chat-panel">
      <h2 className="text-lg font-semibold mb-4">{t('chat.conversations.title')}</h2>
      <ul>
        {conversations.map((c) => {
          const unread =
            typeof unreadByConversationId?.[c.conversationId] === 'number'
              ? unreadByConversationId[c.conversationId]
              : typeof c.unreadCount === 'number'
                ? c.unreadCount
                : 0;

          return (
            <li
              key={c.conversationId}
              onClick={() => onSelect(c)}
              className={
                `mb-2 chat-list-item chat-panel-border ${
                  selectedId === c.conversationId ? 'chat-list-item-active' : ''
                }`
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(c);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.conversationDisplayName || t('common.notAvailable')}</div>
                  <div className="text-sm chat-muted truncate">{c.lastMessageSnippet}</div>
                </div>

                {unread > 0 ? (
                  <span className="chat-unread-badge" aria-hidden="true">
                    {Math.min(99, unread)}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
