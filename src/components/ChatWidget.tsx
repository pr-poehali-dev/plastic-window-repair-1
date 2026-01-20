import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Здравствуйте! Чем могу помочь?', isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, isBot: false }]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: 'Спасибо за обращение! Мы свяжемся с вами в течение рабочего дня. Для более быстрой связи звоните по телефону: +8 (902) 145-49-42',
        isBot: true
      }]);
    }, 1000);
  };

  return (
    <>
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-2xl z-50 overflow-hidden">
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">Чат поддержки</h3>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
              <Icon name="X" size={20} />
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[75%] p-3 rounded-lg ${msg.isBot ? 'bg-white text-slate-900' : 'bg-primary text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t flex gap-2">
            <Input
              placeholder="Введите сообщение..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} size="icon">
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50"
        size="icon"
      >
        <Icon name={isOpen ? 'X' : 'MessageCircle'} size={24} />
      </Button>
    </>
  );
};

export default ChatWidget;