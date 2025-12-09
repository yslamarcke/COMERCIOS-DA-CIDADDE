import React, { useState, useEffect } from 'react';
import { Debtor, Transaction, TransactionType, AIParsedTransaction } from './types';
import DebtorCard from './components/DebtorCard';
import SmartAdd from './components/SmartAdd';
import DebtorModal from './components/DebtorModal';
import { LoginScreen } from './components/LoginScreen';
import { PlusCircle, Wallet, Users, FileSpreadsheet, LogOut, Store } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const USERS_DB_KEY = 'ta_no_prego_users_db';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // App State
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  // --- Auth Handlers ---
  
  const handleLogin = async (user: string, pass: string): Promise<boolean> => {
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    if (usersDb[user] && usersDb[user] === pass) {
        setCurrentUser(user);
        return true;
    }
    return false;
  };

  const handleRegister = async (user: string, pass: string): Promise<boolean> => {
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    if (usersDb[user]) {
        return false; // User exists
    }
    usersDb[user] = pass;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
    setCurrentUser(user);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setDebtors([]); // Clear current memory state
    setSelectedDebtorId(null);
  };

  // --- Data Persistence (Per User) ---

  // Load data when user logs in
  useEffect(() => {
    if (!currentUser) return;
    
    // Unique storage key for this specific business/user
    const storageKey = `data_v2_${currentUser}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        setDebtors(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load data", e);
        setDebtors([]);
      }
    } else {
        // Empty state for new users
        setDebtors([]); 
    }
  }, [currentUser]);

  // Save data when debtors change (only if logged in)
  useEffect(() => {
    if (!currentUser) return;

    const storageKey = `data_v2_${currentUser}`;
    localStorage.setItem(storageKey, JSON.stringify(debtors));
  }, [debtors, currentUser]);


  // --- App Logic ---

  // Global Stats
  const totalReceivable = debtors.reduce((acc, d) => {
    const debt = d.transactions.reduce((tAcc, t) => tAcc + t.amount, 0);
    return acc + debt;
  }, 0);

  const totalPeople = debtors.length;

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    
    const newDebtor: Debtor = {
      id: uuidv4(),
      name: newPersonName.trim(),
      transactions: [],
      updatedAt: new Date().toISOString()
    };
    
    setDebtors([newDebtor, ...debtors]);
    setNewPersonName('');
    setIsAddingPerson(false);
  };

  const handleAddTransaction = (debtorId: string, t: Omit<Transaction, 'id' | 'date'>) => {
    setDebtors(prev => prev.map(d => {
      if (d.id === debtorId) {
        return {
          ...d,
          transactions: [...d.transactions, { ...t, id: uuidv4(), date: new Date().toISOString() }],
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const handleDeleteTransaction = (debtorId: string, tId: string) => {
    setDebtors(prev => prev.map(d => {
        if(d.id === debtorId) {
            return {
                ...d,
                transactions: d.transactions.filter(t => t.id !== tId),
                updatedAt: new Date().toISOString()
            };
        }
        return d;
    }));
  };

  const handleClearAllTransactions = (debtorId: string) => {
    setDebtors(prev => prev.map(d => {
      if (d.id === debtorId) {
        return {
          ...d,
          transactions: [],
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const handleDeleteDebtor = (id: string) => {
      setDebtors(prev => prev.filter(d => d.id !== id));
      setSelectedDebtorId(null);
  };

  const handleAIParsed = (data: AIParsedTransaction) => {
    let debtor = debtors.find(d => d.name.toLowerCase().includes(data.name.toLowerCase()) || data.name.toLowerCase().includes(d.name.toLowerCase()));
    
    if (debtor) {
      handleAddTransaction(debtor.id, {
        amount: data.amount,
        description: data.description,
        type: TransactionType.DEBT
      });
      alert(`Adicionado item: "${data.description}" (R$ ${data.amount}) na planilha de ${debtor.name}.`);
    } else {
      const newId = uuidv4();
      const newDebtor: Debtor = {
        id: newId,
        name: data.name,
        updatedAt: new Date().toISOString(),
        transactions: [{
          id: uuidv4(),
          amount: data.amount,
          description: data.description,
          type: TransactionType.DEBT,
          date: new Date().toISOString()
        }]
      };
      setDebtors([newDebtor, ...debtors]);
      alert(`Criada nova planilha para ${data.name} com R$ ${data.amount}`);
    }
  };

  const selectedDebtor = debtors.find(d => d.id === selectedDebtorId);

  // If not logged in, show login screen
  if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 bg-opacity-95 backdrop-blur shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                    <Store size={20} className="text-yellow-500" />
               </div>
               <div>
                   <h1 className="text-xl font-bold text-white leading-tight">
                     {currentUser}
                   </h1>
                   <p className="text-xs text-slate-500">Tá no Prego!</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Total a Receber</p>
                    <p className="text-xl font-bold text-yellow-400 font-mono">R$ {totalReceivable.toFixed(2)}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    title="Sair"
                >
                    <LogOut size={20} />
                </button>
            </div>
          </div>
          
          <SmartAdd onParsed={handleAIParsed} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalPeople}</p>
                <p className="text-xs text-slate-400">Clientes</p>
              </div>
           </div>
           <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                    {debtors.reduce((acc, d) => acc + d.transactions.length, 0)}
                </p>
                <p className="text-xs text-slate-400">Itens na conta</p>
              </div>
           </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-200">Clientes Devedores</h2>
            <button 
                onClick={() => setIsAddingPerson(!isAddingPerson)}
                className="bg-yellow-600 hover:bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors"
            >
                <PlusCircle size={18} />
                Novo Cliente
            </button>
        </div>

        {isAddingPerson && (
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 animate-fade-in-down">
                <form onSubmit={handleAddPerson} className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Nome do cliente..."
                        value={newPersonName}
                        onChange={(e) => setNewPersonName(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 text-white focus:outline-none focus:border-yellow-500"
                        autoFocus
                    />
                    <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                        Adicionar
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsAddingPerson(false)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {debtors.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                  <FileSpreadsheet size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium text-slate-400">Sua lista está vazia</p>
                  <p className="text-sm">Comece adicionando um cliente ou use a IA no topo.</p>
              </div>
          ) : (
            debtors.map(debtor => (
                <DebtorCard 
                    key={debtor.id} 
                    debtor={debtor} 
                    onClick={() => setSelectedDebtorId(debtor.id)} 
                />
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedDebtor && (
        <DebtorModal 
            debtor={selectedDebtor} 
            onClose={() => setSelectedDebtorId(null)}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onClearAllTransactions={handleClearAllTransactions}
            onDeleteDebtor={handleDeleteDebtor}
        />
      )}
    </div>
  );
};

export default App;