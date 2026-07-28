'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MessageSquare, Send } from 'lucide-react';
import { useSocket } from '@/components/SocketProvider';

export default function MessagesDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [activeTeacherId, setActiveTeacherId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const socket = useSocket();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [msgRes, teachersRes] = await Promise.all([
        api.get('/messages'),
        api.get('/users/teachers')
      ]);
      setMessages(msgRes);
      setTeachers(teachersRes);
      if (teachersRes.length > 0) setActiveTeacherId(teachersRes[0].id);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!socket || !user) return;
    const eventName = `new_message_${user.id}`;
    
    const handleMessage = (msg: any) => {
      setMessages(prev => [...prev, msg]);
    };
    
    socket.on(eventName, handleMessage);
    return () => {
      socket.off(eventName, handleMessage);
    };
  }, [socket, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTeacherId) return;

    try {
      const res = await api.post('/messages', {
        receiverId: activeTeacherId,
        content: newMessage
      });
      setMessages(prev => [...prev, res]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  // Filter messages for active conversation
  const activeConversation = messages.filter(m => 
    (m.senderId === user?.id && m.receiverId === activeTeacherId) ||
    (m.receiverId === user?.id && m.senderId === activeTeacherId)
  );

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-fade-in font-body relative" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Liquid Abstract Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none -z-10"></div>
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none -z-10"></div>

      <header className="mb-6 flex-shrink-0">
        <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Direct Messages</h1>
        <p className="text-sm font-medium text-gray-600 mt-1">Communicate securely with school staff.</p>
      </header>

      <div className="flex-1 flex overflow-hidden bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
        {/* Sidebar (Contacts) */}
        <div className="w-[300px] border-r border-white/50 bg-white/30 overflow-y-auto flex flex-col">
          <div className="p-6 font-bold text-gray-900 font-display border-b border-white/50 flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-600" /> Contacts
          </div>
          <div className="flex-1 overflow-y-auto">
            {teachers.map(t => (
              <div 
                key={t.id}
                onClick={() => setActiveTeacherId(t.id)}
                className={`p-4 cursor-pointer flex items-center gap-4 transition-all border-b border-white/20 ${activeTeacherId === t.id ? 'bg-white/60 shadow-sm relative' : 'hover:bg-white/40'}`}
              >
                {activeTeacherId === t.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>
                )}
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm border border-indigo-200/50">
                  {t.name.charAt(0)}
                </div>
                <div className="font-bold text-gray-800 text-sm">{t.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/20 relative">
          {/* Chat History */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            {activeConversation.length === 0 ? (
              <div className="m-auto text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <MessageSquare size={40} />
                </div>
                <p className="text-xl font-bold font-display text-gray-900 mb-2">No messages yet.</p>
                <p className="text-sm font-medium text-gray-500">Send a message to start the conversation.</p>
              </div>
            ) : (
              activeConversation.map(m => {
                const isMine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                      isMine 
                        ? 'bg-indigo-600 text-white rounded-br-sm' 
                        : 'bg-white/80 backdrop-blur-md text-gray-800 border border-white rounded-bl-sm'
                    }`}>
                      <div className="text-sm font-medium leading-relaxed">{m.content}</div>
                      <div className={`text-[0.65rem] font-bold uppercase tracking-widest mt-2 text-right ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-white/40 border-t border-white/50 backdrop-blur-md">
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                type="text"
                className="flex-1 bg-white/60 border border-white shadow-inner rounded-2xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-gray-400 placeholder:font-medium"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-xl" 
                disabled={!newMessage.trim()}
              >
                <Send size={20} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
