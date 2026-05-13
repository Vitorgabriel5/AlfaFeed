import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildProfilePath } from '../utils/profileRoutes';

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Beatriz Ferreira',
    username: '@biaads',
    avatar: 'https://i.pravatar.cc/120?img=47',
    online: true,
    typing: true,
    lastMessage: 'Bora revisar cálculo hoje às 19h?',
    messages: [
      { id: 11, fromMe: false, type: 'text', content: 'Oi! Você vai no grupo de estudos hoje?', time: '18:24' },
      { id: 12, fromMe: true, type: 'text', content: 'Vou sim! Estava esperando você confirmar 😄', time: '18:26', seen: true },
      { id: 13, fromMe: false, type: 'text', content: 'Bora revisar cálculo hoje às 19h?', time: '18:27' },
    ],
  },
  {
    id: 2,
    name: 'Lucas Matos',
    username: '@lucasmdev',
    avatar: 'https://i.pravatar.cc/120?img=59',
    online: false,
    typing: false,
    lastMessage: 'O post sobre IA ficou muito bom!',
    messages: [
      { id: 21, fromMe: false, type: 'text', content: 'O post sobre IA ficou muito bom!', time: 'ontem' },
      { id: 22, fromMe: true, type: 'text', content: 'Valeu! Depois te mando as referências.', time: 'ontem', seen: true },
    ],
  },
  {
    id: 3,
    name: 'Marina Costa',
    username: '@marinac',
    avatar: 'https://i.pravatar.cc/120?img=5',
    online: true,
    typing: false,
    lastMessage: 'Você viu a atividade nova de Psicologia?',
    messages: [
      { id: 31, fromMe: false, type: 'text', content: 'Você viu a atividade nova de Psicologia?', time: '09:40' },
      { id: 32, fromMe: true, type: 'text', content: 'Vi sim, já comecei a rascunhar!', time: '09:52', seen: false },
    ],
  },
];

function Chat() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState(MOCK_CONVERSATIONS[0].id);
  const [messageInput, setMessageInput] = useState('');
  const imageInputRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [activeConversationId, conversations],
  );

  const updateConversationMessages = (updater) => {
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== activeConversationId) return conversation;
        const nextMessages = updater(conversation.messages);
        const last = nextMessages[nextMessages.length - 1];

        return {
          ...conversation,
          messages: nextMessages,
          lastMessage: last?.type === 'image' ? '📷 Imagem' : last?.content || conversation.lastMessage,
        };
      }),
    );
  };

  const handleSendText = () => {
    const content = messageInput.trim();
    if (!content) return;

    updateConversationMessages((messages) => [
      ...messages,
      {
        id: Date.now(),
        fromMe: true,
        type: 'text',
        content,
        time: 'agora',
        seen: false,
      },
    ]);
    setMessageInput('');
  };

  const handleSendImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const imageURL = URL.createObjectURL(file);

    updateConversationMessages((messages) => [
      ...messages,
      {
        id: Date.now() + 1,
        fromMe: true,
        type: 'image',
        content: imageURL,
        time: 'agora',
        seen: false,
      },
    ]);

    event.target.value = '';
  };

  const handleAddEmoji = () => {
    setMessageInput((prev) => `${prev}😊`);
  };

  if (!activeConversation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-3rem)] flex">
        <aside className="w-[30%] border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">AlfaChat</h1>
            <Link to="/feed" className="text-sm font-semibold text-orange-500 hover:underline">Voltar ao Feed</Link>
          </div>

          <div className="overflow-y-auto h-[calc(100%-4.5rem)]">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              return (
                <button
                  type="button"
                  key={conversation.id}
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={`w-full px-4 py-3 text-left border-b border-gray-100 flex items-center gap-3 transition ${
                    isActive ? 'bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <Link to={buildProfilePath(conversation.username)} className="relative" onClick={(event) => event.stopPropagation()}>
                    <img src={conversation.avatar} alt={conversation.name} className="h-12 w-12 rounded-full object-cover" />
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to={buildProfilePath(conversation.username)}
                      className="font-bold text-sm text-gray-800 truncate hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {conversation.name}
                    </Link>
                    <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="w-[70%] flex flex-col bg-gray-50">
          <header className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={buildProfilePath(activeConversation.username)}>
                <img src={activeConversation.avatar} alt={activeConversation.name} className="h-11 w-11 rounded-full object-cover" />
              </Link>
              <div>
                <Link to={buildProfilePath(activeConversation.username)} className="font-bold text-gray-800 hover:underline">
                  {activeConversation.name}
                </Link>
                <p className="text-xs text-gray-500">
                  {activeConversation.online ? 'Online agora' : 'Offline'}
                  {activeConversation.typing ? ' • digitando...' : ''}
                </p>
              </div>
            </div>
            <Link to={buildProfilePath(activeConversation.username)} className="text-sm text-gray-500 hover:text-orange-600">
              {activeConversation.username}
            </Link>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConversation.messages.map((message) => (
              <div key={message.id} className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md rounded-2xl px-4 py-2 text-sm shadow ${
                    message.fromMe ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-br-md' : 'bg-white text-gray-700 rounded-bl-md'
                  }`}
                >
                  {message.type === 'image' ? (
                    <img src={message.content} alt="Imagem enviada" className="max-h-52 rounded-lg object-cover" />
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <p className={`text-[10px] mt-1 ${message.fromMe ? 'text-orange-100' : 'text-gray-400'}`}>
                    {message.time}
                    {message.fromMe && message.seen ? ' • Visualizado' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddEmoji}
                className="h-10 w-10 rounded-full bg-orange-50 text-lg hover:bg-orange-100 transition"
                aria-label="Adicionar emoji"
              >
                😊
              </button>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="h-10 w-10 rounded-full bg-orange-50 text-lg hover:bg-orange-100 transition"
                aria-label="Enviar imagem"
              >
                🖼️
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSendImage}
              />

              <input
                type="text"
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSendText();
                  }
                }}
                placeholder="Digite uma mensagem..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={handleSendText}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-5 rounded-xl hover:opacity-90 transition"
              >
                Enviar
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Chat;
