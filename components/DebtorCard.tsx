import React from 'react';
import { Debtor, TransactionType } from '../types';
import { User, DollarSign, ExternalLink } from 'lucide-react';

interface DebtorCardProps {
  debtor: Debtor;
  onClick: () => void;
}

const DebtorCard: React.FC<DebtorCardProps> = ({ debtor, onClick }) => {
  const totalDebt = debtor.transactions.reduce((acc, t) => {
    return t.type === TransactionType.DEBT ? acc + t.amount : acc - t.amount;
  }, 0);

  const lastTransaction = debtor.transactions.length > 0 
    ? debtor.transactions[debtor.transactions.length - 1] 
    : null;

  return (
    <div 
      onClick={onClick}
      className="bg-slate-800 rounded-xl p-5 border border-slate-700 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink size={16} className="text-slate-400" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg">
          {debtor.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white truncate max-w-[150px]">{debtor.name}</h3>
          <p className="text-xs text-slate-500">
            {debtor.transactions.length} registros
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-slate-400">Saldo Devedor</p>
        <div className="flex items-baseline gap-1">
            <span className="text-sm text-slate-400">R$</span>
            <span className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.abs(totalDebt).toFixed(2)}
            </span>
        </div>
      </div>

      {lastTransaction && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
           <p className="text-xs text-slate-500 italic truncate">
             Último: {lastTransaction.description} ({new Date(lastTransaction.date).toLocaleDateString()})
           </p>
        </div>
      )}
    </div>
  );
};

export default DebtorCard;