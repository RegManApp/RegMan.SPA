import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

export default function MessageComposer({ onSend, onTypingStart, onTypingStop }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const isTypingRef = useRef(false);
  const stopTimerRef = useRef(null);

  const handleSend = async () => {
    if (!text.trim()) return;
    await onSend(text.trim());
    setText('');

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      if (typeof onTypingStop === 'function') {
        onTypingStop();
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="flex-1 chat-composer-input"
        value={text}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);

          if (typeof onTypingStart === 'function' && !isTypingRef.current && next.trim()) {
            isTypingRef.current = true;
            onTypingStart();
          }

          if (stopTimerRef.current) {
            clearTimeout(stopTimerRef.current);
            stopTimerRef.current = null;
          }

          if (typeof onTypingStop === 'function') {
            stopTimerRef.current = setTimeout(() => {
              if (isTypingRef.current) {
                isTypingRef.current = false;
                onTypingStop();
              }
            }, 900);
          }
        }}
        placeholder={t('chat.composer.placeholder')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <Button onClick={handleSend}>{t('chat.composer.send')}</Button>
    </div>
  );
}
