import React, { useState, useEffect } from 'react';
import { Hexagon, Shield, Users, Activity, Lock, AlertOctagon, RotateCw } from 'lucide-react';
import { INITIAL_NODES, INITIAL_LINKS, INITIAL_PROPOSALS } from './constants';
import { SystemState, VoteType, UserNode, Proposal } from './types';
import { NetworkVis } from './components/NetworkVis';
import { ProposalItem } from './components/ProposalItem';
import { CoherenceMetrics } from './components/CoherenceMetrics';

export default function App() {
  const [systemState, setSystemState] = useState<SystemState>(SystemState.ACTIVE);
  const [nodes, setNodes] = useState<UserNode[]>(INITIAL_NODES);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [currentUser, setCurrentUser] = useState<string>('2'); // Mock logged-in user (Bob)

  // System-wide invariants check
  useEffect(() => {
    // Fail-Closed Logic: If any active proposal has flags, or any node is flagged, HALT.
    const hasCoercionFlags = proposals.some(p => p.coercionFlags.length > 0);
    const hasNodeFlags = nodes.some(n => n.status === 'flagged');

    if (hasCoercionFlags || hasNodeFlags) {
      if (systemState !== SystemState.HALTED) {
        setSystemState(SystemState.HALTED);
      }
    } else {
       if (systemState === SystemState.HALTED) {
         // Manual reset required in real app, but for demo we stay halted until 'Reset' clicked
       }
    }
  }, [proposals, nodes, systemState]);

  const handleVote = (proposalId: string, userId: string, vote: VoteType) => {
    if (systemState === SystemState.HALTED) return;

    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votes: { ...p.votes, [userId]: vote }
        };
      }
      return p;
    }));
  };

  const handleFlagCoercion = (proposalId: string, userId: string) => {
    // Immediate Fail-Closed Trigger
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: 'halted',
          coercionFlags: [...p.coercionFlags, userId]
        };
      }
      return p;
    }));
    
    // Also visual update to node
    setNodes(prev => prev.map(n => n.id === userId ? { ...n, status: 'flagged' } : n));
  };

  const resetSystem = () => {
    setSystemState(SystemState.ACTIVE);
    setProposals(prev => prev.map(p => ({ ...p, status: 'voting', coercionFlags: [] })));
    setNodes(prev => prev.map(n => ({ ...n, status: 'active' })));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
               <Hexagon className={`w-8 h-8 ${systemState === SystemState.ACTIVE ? 'text-indigo-500' : 'text-red-500'}`} />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className={`w-2 h-2 rounded-full ${systemState === SystemState.ACTIVE ? 'bg-indigo-400' : 'bg-red-400'}`}></div>
               </div>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white leading-none">Merkabah Node</h1>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Governance Pilot v0.1</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* System Status Indicator */}
             <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
               systemState === SystemState.ACTIVE 
                ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' 
                : 'bg-red-900/20 border-red-800 text-red-400 animate-pulse'
             }`}>
                {systemState === SystemState.ACTIVE ? <Shield className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                <span className="text-xs font-bold">{systemState}</span>
             </div>
             
             {systemState === SystemState.HALTED && (
               <button 
                 onClick={resetSystem}
                 className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                 title="Reset System (Admin)"
               >
                 <RotateCw className="w-4 h-4" />
               </button>
             )}

             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold border-2 border-slate-800">
               Bob
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Context & Data */}
        <div className="lg:col-span-4 space-y-6">
          {/* Network Graph */}
          <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
             <div className="p-4 border-b border-slate-800 flex items-center gap-2">
               <Users className="w-4 h-4 text-indigo-400" />
               <h2 className="text-sm font-semibold text-slate-200">Governance Topology</h2>
             </div>
             <div className="p-1">
               <NetworkVis nodes={nodes} links={INITIAL_LINKS} systemState={systemState} />
             </div>
             <div className="p-3 bg-slate-950/50 text-xs text-slate-500 flex justify-between">
               <span>7 Active Nodes</span>
               <span>Integrity: {systemState === SystemState.ACTIVE ? '100%' : 'Compromised'}</span>
             </div>
          </section>

          {/* Coherence Metrics */}
          <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
             <div className="p-4 border-b border-slate-800 flex items-center gap-2">
               <Activity className="w-4 h-4 text-emerald-400" />
               <h2 className="text-sm font-semibold text-slate-200">Resonant Field</h2>
             </div>
             <div className="p-4">
                <CoherenceMetrics />
             </div>
          </section>

          {/* Core Principles */}
          <section className="bg-gradient-to-br from-indigo-900/20 to-slate-900 rounded-xl border border-indigo-500/20 p-4">
            <h3 className="text-indigo-300 font-semibold mb-2 text-sm flex items-center gap-2">
              <Lock className="w-3 h-3" /> Invariants Active
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span><strong>Anti-Coercion:</strong> No entity can impose will.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span><strong>Fail-Closed:</strong> System halts on violation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span><strong>Balance:</strong> Agency = Harmony.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Right Column: Proposals & Actions */}
        <div className="lg:col-span-8 space-y-6">
          
          {systemState === SystemState.HALTED && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center animate-in zoom-in duration-300">
              <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">System Halted</h2>
              <p className="text-red-200 max-w-md mx-auto mb-6">
                A core invariant violation (Coercion) has been flagged. 
                All governance actions are frozen. 
                Initiating <strong>Diagnostic & Review Circle</strong>.
              </p>
              <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                View Incident Logs
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Active Proposals</h2>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${systemState === SystemState.HALTED ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
              disabled={systemState === SystemState.HALTED}
            >
              + New Proposal
            </button>
          </div>

          <div className="space-y-4">
            {proposals.map(proposal => (
              <ProposalItem 
                key={proposal.id} 
                proposal={proposal} 
                currentUserId={currentUser}
                onVote={handleVote}
                onFlagCoercion={handleFlagCoercion}
                systemState={systemState}
              />
            ))}
          </div>
          
          {/* Mock Footer for the list */}
          <div className="text-center pt-8 pb-4">
             <span className="text-slate-600 text-sm">End of active queue</span>
          </div>

        </div>
      </main>
    </div>
  );
}