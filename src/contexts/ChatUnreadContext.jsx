import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { chatApi } from '../api';
import { useAuth } from './AuthContext';
import {
  startConnection,
  stopConnection,
  onReceiveMessage,
  offReceiveMessage,
  onConversationCreated,
  offConversationCreated,
} from '../api/signalrClient';

const ChatUnreadContext = createContext(null);

const getCurrentUserId = (user) => {
  return user?.userId || user?.id || '';
};

const buildUnreadState = (conversations = []) => {
  const byConversationId = {};
  let totalUnread = 0;

  (conversations || []).forEach((c) => {
    const id = c?.conversationId;
    if (!id) return;

    const count = typeof c?.unreadCount === 'number' ? c.unreadCount : 0;
    byConversationId[id] = count;
    totalUnread += count;
  });

  return { byConversationId, totalUnread };
};

export function ChatUnreadProvider({ children }) {
  const { user } = useAuth();
  const currentUserId = useMemo(() => getCurrentUserId(user), [user]);

  const [byConversationId, setByConversationId] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);

  const latestUserIdRef = useRef(currentUserId);
  useEffect(() => {
    latestUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const refresh = useCallback(async () => {
    if (!currentUserId) {
      setByConversationId({});
      setTotalUnread(0);
      return;
    }

    try {
      const res = await chatApi.getConversations();
      const convos = res.data?.conversations || [];
      const next = buildUnreadState(convos);
      setByConversationId(next.byConversationId);
      setTotalUnread(next.totalUnread);
    } catch {
      // Keep previous counts if refresh fails
    }
  }, [currentUserId]);

  const clearConversationUnread = useCallback((conversationId) => {
    if (!conversationId) return;

    setByConversationId((prev) => {
      const existing = prev?.[conversationId] || 0;
      if (existing <= 0) return prev;

      setTotalUnread((t) => Math.max(0, t - existing));
      return { ...prev, [conversationId]: 0 };
    });
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setByConversationId({});
      setTotalUnread(0);
      return;
    }

    let receiveHandler = (message) => {
      try {
        const me = latestUserIdRef.current;
        if (!me) return;

        const convoId = message?.conversationId;
        const senderId = message?.senderId;
        const isRead = !!message?.isRead;

        if (!convoId) return;
        if (senderId && senderId === me) return;
        if (isRead) return;

        setByConversationId((prev) => ({
          ...prev,
          [convoId]: (prev?.[convoId] || 0) + 1,
        }));
        setTotalUnread((prev) => prev + 1);
      } catch {
        // ignore
      }
    };

    let conversationCreatedHandler = async () => {
      await refresh();
    };

    startConnection()
      .then(() => {
        onReceiveMessage(receiveHandler);
        onConversationCreated(conversationCreatedHandler);
        refresh();
      })
      .catch(() => {
        // ignore; badges will just not live-update
      });

    return () => {
      try {
        offReceiveMessage(receiveHandler);
        offConversationCreated(conversationCreatedHandler);
        stopConnection();
      } catch {
        // ignore
      }
    };
  }, [currentUserId, refresh]);

  const value = useMemo(() => ({
    totalUnread,
    byConversationId,
    refresh,
    clearConversationUnread,
  }), [totalUnread, byConversationId, refresh, clearConversationUnread]);

  return <ChatUnreadContext.Provider value={value}>{children}</ChatUnreadContext.Provider>;
}

export function useChatUnread() {
  const ctx = useContext(ChatUnreadContext);
  return ctx || {
    totalUnread: 0,
    byConversationId: {},
    refresh: async () => {},
    clearConversationUnread: () => {},
  };
}
