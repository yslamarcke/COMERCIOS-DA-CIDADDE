import React, { useState } from 'react';
import { Lock, Store, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: string, pass: string) => Promise<boolean>;
  onRegister: (user: string, pass: string) => Promise<boolean>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if(!username || !password) {
        setError("Preencha todos os campos.");
        return;
    }

    setLoading(true);
    // Simulate network delay for better UX feel
    await new Promise(r => setTimeout(r, 600));

    try {
        const success = isRegistering 
            ? await onRegister(username, password)
            : await onLogin(username, password);
        
        if (!success) {
            setError(isRegistering ? "Este nome de comércio já existe." : "Nome ou senha incorretos.");
        }
    } catch (err) {
        setError("Erro ao processar.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 w-full max-w-md p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-orange-600"></div>
            
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500 border border-slate-700 shadow-lg">
                    <Store size={32} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Tá no Prego!</h1>
                <p className="text-slate-400">Gerenciador de Dívidas Empresarial</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
                        Nome do Comércio (Login)
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                            <Store size={18} />
                        </div>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            placeholder="ex: bar_do_ze"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
                        Senha de Acesso
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            placeholder="••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20"
                >
                    {loading ? (
                        <span className="animate-pulse">Aguarde...</span>
                    ) : (
                        isRegistering ? <><UserPlus size={20}/> Criar Conta</> : <><LogIn size={20}/> Acessar Planilhas</>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center pt-6 border-t border-slate-800">
                <button 
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                    }}
                    className="text-slate-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                    {isRegistering ? 'Já tem uma conta? Entrar' : 'Novo cliente? Registrar Comércio'} <ArrowRight size={14} />
                </button>
            </div>
        </div>
        
        <p className="fixed bottom-4 text-slate-600 text-xs">
            v2.2 • Sistema Multi-Empresas
        </p>
    </div>
  );
};