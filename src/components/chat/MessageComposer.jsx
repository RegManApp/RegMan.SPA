import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

export default function MessageComposer({ onSend }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    await onSend(text.trim());
    setText('');
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="flex-1 chat-composer-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('chat.composer.placeholder')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <Button onClick={handleSend}>{t('chat.composer.send')}</Button>
    </div>
  );
}
