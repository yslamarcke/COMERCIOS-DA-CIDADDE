import React, { useState } from 'react';
import { Debtor, Transaction, TransactionType } from '../types';
import TransactionHistory from './TransactionHistory';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface DebtorModalProps {
  debtor: Debtor;
  onClose: () => void;
  onAddTransaction: (debtorId: string, t: Omit<Transaction, 'id' | 'date'>) => void;
  onDeleteTransaction: (debtorId: string, transactionId: string) => void;
  onClearAllTransactions: (debtorId: string) => void;
  onDeleteDebtor: (debtorId: string) => void;
}

const DebtorModal: React.FC<DebtorModalProps> = ({ debtor, onClose, onAddTransaction, onDeleteTransaction, onClearAllTransactions, onDeleteDebtor }) => {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const totalDebt = debtor.transactions.reduce((acc, t) => acc + t.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return;
    onAddTransaction(debtor.id, {
      amount: parseFloat(amount),
      description: desc,
      type: TransactionType.DEBT
    });
    setAmount('');
    setDesc('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-slate-900 font-bold text-xl">
                 {debtor.name.charAt(0).toUpperCase()}
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white">{debtor.name}</h2>
                <p className="text-slate-400 text-xs">Planilha de contas</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Quick Add Form */}
            <form onSubmit={handleAdd} className="flex gap-2 items-end bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Descrição do Item</label>
                    <input 
                        type="text" 
                        required
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        placeholder="Ex: Cerveja, Uber..."
                    />
                </div>
                <div className="w-32">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Valor</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500">R$</span>
                        <input 
                            type="number" 
                            step="0.01" 
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            placeholder="0,00"
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="bg-yellow-600 hover:bg-yellow-500 text-slate-900 p-2.5 rounded-lg transition-colors flex items-center justify-center"
                    title="Adicionar"
                >
                    <Plus size={20} />
                </button>
            </form>

            {/* Spreadsheet Table */}
            <div>
                 <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Itens Pendentes</h3>
                 <TransactionHistory transactions={debtor.transactions} onDelete={(tid) => onDeleteTransaction(debtor.id, tid)} />
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-slate-500 text-sm">
                    Total Devedor: <strong className="text-red-400 text-lg ml-2">R$ {totalDebt.toFixed(2)}</strong>
                </span>
                
                <div className="flex items-center gap-3">
                    {totalDebt > 0 && (
                        <button 
                            onClick={() => {
                                if(confirm(`Confirmar o pagamento TOTAL de R$ ${totalDebt.toFixed(2)} para ${debtor.name}? Isso limpará a lista.`)) {
                                    onClearAllTransactions(debtor.id);
                                }
                            }}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors shadow-lg shadow-green-900/20"
                        >
                            <CheckCircle2 size={16} /> Quitar Tudo
                        </button>
                    )}

                    <button 
                        onClick={() => {
                            if(confirm('Tem certeza que deseja apagar essa pessoa e zerar a planilha?')) {
                                onDeleteDebtor(debtor.id);
                                onClose();
                            }
                        }}
                        className="text-red-500 text-sm hover:bg-red-950/30 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        title="Excluir Planilha"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DebtorModal;