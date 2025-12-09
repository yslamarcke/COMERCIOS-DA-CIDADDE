import React, { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { parseTransactionFromText } from '../services/geminiService';
import { AIParsedTransaction } from '../types';

interface SmartAddProps {
  onParsed: (data: AIParsedTransaction) => void;
}

const SmartAdd: React.FC<SmartAddProps> = ({ onParsed }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleParse = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const result = await parseTransactionFromText(input);
      if (result) {
        onParsed(result);
        setInput('');
      } else {
        alert("Não entendi. Tente: 'Sandro deve 30 reais da pizza'");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-1">
      <form onSubmit={handleParse} className="relative flex items-center">
        <div className="absolute left-4 text-blue-400 animate-pulse">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="IA: 'Matias aumentou 50 da cerveja hoje'..."
          className="w-full bg-transparent border-none text-white placeholder-blue-200/50 py-4 pl-12 pr-14 focus:ring-0 focus:outline-none text-lg font-medium"
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default SmartAdd;