import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAIHistory, sendAIMessage, deleteAIHistoryItem } from '../../api/ai';
import api from '../../api/axios';

const AIChat = () => {
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [tripId, setTripId] = useState('');
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [historyRes, tripsRes] = await Promise.all([
          getAIHistory(),
          api.get('/trips?limit=50')
        ]);
        setHistory(historyRes.data.data.history || []);
        setTrips(tripsRes.data.data.trips || []);
      } catch (err) {
        toast.error('Failed to load AI history');
      }
    };
    load();
  }, []);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const newMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, newMessage]);
    setPrompt('');

    try {
      const res = await sendAIMessage({ prompt: prompt, tripId: tripId || undefined });
      const aiResponse = res.data.data;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse.reply,
        suggestions: aiResponse.suggestions || []
      }]);
    } catch (err) {
      toast.error('Failed to get response');
    }
  };

  const handleDeleteHistory = async (chatId) => {
    try {
      await deleteAIHistoryItem(chatId);
      setHistory(prev => prev.filter(item => item.id !== chatId));
    } catch (err) {
      toast.error('Failed to delete history');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-5 space-y-4">
        <div>
          <h2 className="text-lg font-heading font-bold text-secondary-bg">Chat History</h2>
          <p className="text-xs text-neutral-text">Recent AI responses.</p>
        </div>
        <div className="space-y-3">
          {history.length === 0 && <div className="text-xs text-neutral-text">No history yet.</div>}
          {history.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-[14px] p-3 text-xs text-neutral-text group relative">
              <div className="font-semibold text-secondary-bg line-clamp-1">{item.prompt}</div>
              <div className="mt-1 line-clamp-2 opacity-60">{item.response?.reply}</div>
              <button 
                onClick={() => handleDeleteHistory(item.id)} 
                className="text-red-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0A1622] border border-white/5 rounded-[20px] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-secondary-bg">AI Assistant</h1>
            <p className="text-sm text-neutral-text">Ask for itinerary ideas, packing lists, and budgets.</p>
          </div>
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary-bg"
          >
            <option value="" className="bg-[#0A1622]">No trip context</option>
            {trips.map(trip => (
              <option key={trip.id} value={trip.id} className="bg-[#0A1622]">{trip.title}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <div className="text-sm text-neutral-text">Start a conversation with the AI assistant.</div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-[20px] text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent-blue text-[#0A1622] rounded-tr-none'
                    : 'bg-white/10 text-secondary-bg rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
              
              {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(suggestion);
                        // Trigger send automatically? Maybe better to let user edit.
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-text hover:border-accent-blue hover:text-accent-blue transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the AI..."
            className="flex-1 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-secondary-bg focus:outline-none"
          />
          <button onClick={handleSend} className="px-4 py-3 bg-accent-blue text-[#0A1622] rounded-[14px] text-sm font-semibold">Send</button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
