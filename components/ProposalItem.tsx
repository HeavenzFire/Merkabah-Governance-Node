import React, { useState } from 'react';
import { Proposal, VoteType, SystemState } from '../types';
import { analyzeProposalSafety } from '../services/aiService';
import { AlertTriangle, CheckCircle, BrainCircuit, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface ProposalItemProps {
  proposal: Proposal;
  currentUserId: string;
  onVote: (proposalId: string, userId: string, vote: VoteType) => void;
  onFlagCoercion: (proposalId: string, userId: string) => void;
  systemState: SystemState;
}

export const ProposalItem: React.FC<ProposalItemProps> = ({ 
  proposal, 
  currentUserId, 
  onVote, 
  onFlagCoercion,
  systemState 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isHalted = systemState === SystemState.HALTED || proposal.status === 'halted';
  const hasVoted = !!proposal.votes[currentUserId];
  const userVote = proposal.votes[currentUserId];
  const flagCount = proposal.coercionFlags.length;

  const handleAiCheck = async () => {
    setIsAnalyzing(true);
    const result = await analyzeProposalSafety(proposal.title, proposal.description);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className={`bg-slate-800 rounded-lg border transition-all ${isHalted ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-700 hover:border-slate-500'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="text-lg font-medium text-slate-100 flex items-center gap-2">
              {isHalted && <AlertTriangle className="w-5 h-5 text-red-500" />}
              {proposal.title}
            </h4>
            <div className="text-xs text-slate-400 mt-1">
              Proposed by <span className="text-indigo-400">{proposal.author}</span> • {new Date(proposal.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-1"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <p className={`text-slate-300 text-sm mb-4 ${!isExpanded && 'line-clamp-2'}`}>
          {proposal.description}
        </p>
        
        {isHalted ? (
          <div className="bg-red-900/20 border border-red-500/30 p-3 rounded mb-4 text-red-200 text-sm flex items-center gap-3">
             <ShieldAlert className="w-6 h-6 flex-shrink-0" />
             <div>
               <strong>System Halted:</strong> Coercion flagged by {flagCount} member{flagCount !== 1 ? 's' : ''}. 
               This proposal is frozen until a Review Circle clears the violation.
             </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-4">
             {/* Voting Buttons */}
             {Object.values(VoteType).map((type) => (
               <button
                 key={type}
                 onClick={() => onVote(proposal.id, currentUserId, type)}
                 disabled={hasVoted}
                 className={`px-3 py-1.5 rounded text-xs font-medium transition-colors
                   ${hasVoted && userVote === type 
                     ? 'bg-indigo-600 text-white' 
                     : hasVoted 
                       ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                       : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                   }`}
               >
                 {type}
               </button>
             ))}
             
             <div className="flex-grow"></div>

             {/* Fail-Closed Trigger */}
             <button
               onClick={() => onFlagCoercion(proposal.id, currentUserId)}
               className="px-3 py-1.5 rounded text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 flex items-center gap-1"
             >
               <AlertTriangle className="w-3 h-3" /> Flag Coercion
             </button>
          </div>
        )}

        {/* AI Guardian Section */}
        {isExpanded && !isHalted && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <BrainCircuit className="w-3 h-3" /> Merkabah Guardian AI
              </span>
              {!aiAnalysis && (
                <button 
                  onClick={handleAiCheck}
                  disabled={isAnalyzing}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Audit for Coercion'}
                </button>
              )}
            </div>
            {aiAnalysis && (
               <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm text-slate-300 animate-in fade-in duration-500">
                 <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};