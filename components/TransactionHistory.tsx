import React from 'react';
import { Transaction } from '../types';
import { Check, Trash2 } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onDelete }) => {
  // Sort by date desc
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) {
    return (
        <div className="text-slate-500 text-center py-10 italic border border-dashed border-slate-700 rounded-lg">
            Nenhum item pendente. <br/> A planilha está limpa!
        </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-800 text-slate-200 uppercase font-medium">
          <tr>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Descrição</th>
            <th className="px-4 py-3 text-right">Valor</th>
            <th className="px-4 py-3 text-center">Pagar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {sorted.map((t) => (
            <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(t.date).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-white font-medium">
                {t.description}
              </td>
              <td className="px-4 py-3 text-right font-mono text-red-400">
                R$ {t.amount.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <button 
                  onClick={() => {
                    if(confirm("Confirmar pagamento deste item? Ele será removido da lista.")) {
                        onDelete(t.id);
                    }
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                  title="Marcar como Pago (Remover)"
                >
                  <Check size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-800/50 font-bold text-white">
            <tr>
                <td colSpan={2} className="px-4 py-3 text-right">TOTAL</td>
                <td className="px-4 py-3 text-right text-red-400">
                    R$ {sorted.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </td>
                <td></td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionHistory;