import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  from: 'user' | 'admin';
  userId: string;
}

interface Chat {
  userId: string;
  messages: Message[];
  lastMessage: Date;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadChats();
    }
  }, []);

  const loadChats = () => {
    const storedChats = localStorage.getItem('admin_chats');
    if (storedChats) {
      const parsedChats = JSON.parse(storedChats);
      parsedChats.forEach((chat: Chat) => {
        chat.messages.forEach((msg: Message) => {
          msg.timestamp = new Date(msg.timestamp);
        });
        chat.lastMessage = new Date(chat.lastMessage);
      });
      setChats(parsedChats);
    }
  };

  const handleLogin = () => {
    if (password === 'admin2020') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      loadChats();
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    setPassword('');
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      timestamp: new Date(),
      from: 'admin',
      userId: selectedChat
    };

    setChats(prev => prev.map(chat => {
      if (chat.userId === selectedChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: new Date()
        };
      }
      return chat;
    }));

    setMessageInput('');

    setTimeout(() => {
      const updatedChats = chats.map(chat => {
        if (chat.userId === selectedChat) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: new Date()
          };
        }
        return chat;
      });
      localStorage.setItem('admin_chats', JSON.stringify(updatedChats));
    }, 100);
  };

  const selectedChatData = chats.find(chat => chat.userId === selectedChat);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Icon name="Lock" size={48} className="mx-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold">Вход в админ-панель</h1>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Админ-панель - Чаты</h1>
          <div className="flex gap-4 items-center">
            <a href="/" className="text-primary hover:underline">На главную</a>
            <Button onClick={handleLogout} variant="outline">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          <Card className="p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Диалоги ({chats.length})</h2>
            {chats.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Пока нет сообщений</p>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <button
                    key={chat.userId}
                    onClick={() => setSelectedChat(chat.userId)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedChat === chat.userId
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-semibold">Пользователь {chat.userId.slice(0, 8)}</div>
                    <div className="text-sm opacity-75">
                      {chat.messages[chat.messages.length - 1]?.text.slice(0, 50)}...
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {chat.lastMessage.toLocaleString('ru-RU')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="md:col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b bg-slate-50">
                  <h3 className="font-bold">Чат с пользователем {selectedChat.slice(0, 8)}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedChatData?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-lg ${
                          msg.from === 'admin'
                            ? 'bg-primary text-white'
                            : 'bg-slate-200 text-slate-900'
                        }`}
                      >
                        <div>{msg.text}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {msg.timestamp.toLocaleTimeString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t flex gap-2">
                  <Input
                    placeholder="Введите сообщение..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Выберите диалог для просмотра</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
