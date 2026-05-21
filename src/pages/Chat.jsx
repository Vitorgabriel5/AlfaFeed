import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import EmojiPicker from 'emoji-picker-react';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';

function timeLabel(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function Chat() {
  const currentUser = getCurrentUser();
  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadMap, setUnreadMap] = useState({});
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const activeUserIdRef = useRef(activeUserId);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        setConnected(true);
        client.subscribe('/user/queue/messages', (message) => {
          const msg = JSON.parse(message.body);
          if (msg.senderId === activeUserIdRef.current || msg.receiverId === activeUserIdRef.current) {
            setMessages(prev => [...prev, msg]);
          } else {
            setUnreadMap(prev => ({ ...prev, [msg.senderId]: (prev[msg.senderId] || 0) + 1 }));
          }
        });
      },
      onDisconnect: () => setConnected(false),
      reconnectDelay: 3000,
    });
    client.activate();
    stompClient.current = client;
    return () => client.deactivate();
  }, []);

  useEffect(() => { activeUserIdRef.current = activeUserId; }, [activeUserId]);

  useEffect(() => {
    api.get(`/follow/${currentUser.id}/following`)
      .then(res => {
        setConversations(res.data);
        if (res.data.length > 0) setActiveUserId(res.data[0].id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (conversations.length === 0) return;
    conversations.forEach(conv => {
      api.get(`/chat/conversation/${conv.id}`)
        .then(res => {
          const unread = res.data.filter(m => !m.seen && m.senderId === conv.id).length;
          setUnreadMap(prev => ({ ...prev, [conv.id]: unread }));
        })
        .catch(console.error);
    });
  }, [conversations]);

  useEffect(() => {
    if (!activeUserId) return;
    api.get(`/chat/conversation/${activeUserId}`)
      .then(res => setMessages(res.data))
      .catch(console.error);
    setUnreadMap(prev => ({ ...prev, [activeUserId]: 0 }));
  }, [activeUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeUserId),
    [activeUserId, conversations]
  );

  const handleSendText = async () => {
    const content = messageInput.trim();
    if (!content || !activeUserId) return;
    try {
      const res = await api.post(`/chat/send?receiverId=${activeUserId}&content=${encodeURIComponent(content)}&type=text`);
      setMessages(prev => [...prev, res.data]);
      setMessageInput('');
      setShowEmojiPicker(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const uploadRes = await api.post('/users/upload-profile-picture', formData);
      const imageUrl = uploadRes.data.profilePicture;
      const res = await api.post(`/chat/send?receiverId=${activeUserId}&content=${encodeURIComponent(imageUrl)}&type=image`);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
    event.target.value = '';
  };

  const onEmojiClick = (emojiData) => setMessageInput(prev => prev + emojiData.emoji);

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Siga alguém para começar uma conversa!</p>
          <Link to="/feed" className="text-orange-500 font-semibold mt-4 block hover:underline">
            Voltar ao Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-3rem)] flex">

        {/* Lista de conversas */}
        <aside className="w-[30%] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                AlfaChat
              </h1>
              <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            <Link to="/feed" className="text-sm font-semibold text-orange-500 hover:underline">
              Voltar ao Feed
            </Link>
          </div>

          <div className="overflow-y-auto h-[calc(100%-4.5rem)]">
            {conversations.map((conv) => (
              <button
                type="button"
                key={conv.id}
                onClick={() => setActiveUserId(conv.id)}
                className={`w-full px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 transition ${
                  activeUserId === conv.id
                    ? 'bg-orange-50 dark:bg-orange-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.profilePicture
                      ? `http://localhost:8080${conv.profilePicture}`
                      : `https://i.pravatar.cc/120?u=${conv.id}`}
                    alt={conv.nome}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {unreadMap[conv.id] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadMap[conv.id] > 9 ? '9+' : unreadMap[conv.id]}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${
                    unreadMap[conv.id] > 0
                      ? 'font-extrabold text-gray-900 dark:text-white'
                      : 'font-bold text-gray-800 dark:text-gray-200'
                  }`}>
                    {conv.nome}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{conv.username}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Área de mensagens */}
        <section className="w-[70%] flex flex-col bg-gray-50 dark:bg-gray-900">
          {activeConversation && (
            <>
              <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3">
                <img
                  src={activeConversation.profilePicture
                    ? `http://localhost:8080${activeConversation.profilePicture}`
                    : `https://i.pravatar.cc/120?u=${activeConversation.id}`}
                  alt={activeConversation.nome}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <Link
                    to={buildProfilePath('@' + activeConversation.username)}
                    className="font-bold text-gray-800 dark:text-white hover:underline"
                  >
                    {activeConversation.nome}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">@{activeConversation.username}</p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const fromMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md rounded-2xl px-4 py-2 text-sm shadow ${
                        fromMe
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-bl-md'
                      }`}>
                        {msg.type === 'image' ? (
                          <img src={`http://localhost:8080${msg.content}`} alt="Imagem"
                            className="max-h-52 rounded-lg object-cover" />
                        ) : (
                          <p>{msg.content}</p>
                        )}
                        <p className={`text-[10px] mt-1 ${fromMe ? 'text-orange-100' : 'text-gray-400 dark:text-gray-400'}`}>
                          {timeLabel(msg.createdAt)}
                          {fromMe && msg.seen ? ' • Visualizado' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative">
                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      height={400}
                      width={320}
                      searchPlaceholder="Buscar emoji..."
                      theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)}
                    className="h-10 w-10 rounded-full bg-orange-50 dark:bg-gray-700 text-lg hover:bg-orange-100 dark:hover:bg-gray-600 transition">
                    😊
                  </button>
                  <button type="button" onClick={() => imageInputRef.current?.click()}
                    className="h-10 w-10 rounded-full bg-orange-50 dark:bg-gray-700 text-lg hover:bg-orange-100 dark:hover:bg-gray-600 transition">
                    🖼️
                  </button>
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleSendImage} />
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendText(); } }}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button type="button" onClick={handleSendText}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-5 rounded-xl hover:opacity-90 transition">
                    Enviar
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Chat;