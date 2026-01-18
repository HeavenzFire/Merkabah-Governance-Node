export enum VoteType {
  YES = 'YES',
  NO = 'NO',
  CLARIFY = 'CLARIFY',
  ABSTAIN = 'ABSTAIN'
}

export enum SystemState {
  ACTIVE = 'ACTIVE',
  HALTED = 'HALTED', // Fail-closed state
  DIAGNOSTIC = 'DIAGNOSTIC'
}

export interface UserNode {
  id: string;
  name: string;
  role: 'Member' | 'Guardian' | 'Facilitator';
  coherenceScore: number; // 0-100
  status: 'active' | 'flagged';
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'voting' | 'passed' | 'rejected' | 'halted';
  votes: Record<string, VoteType>;
  coercionFlags: string[]; // List of user IDs who flagged coercion
  createdAt: string;
}

export interface Link {
  source: string;
  target: string;
  strength: number;
}

export interface MerkabahGraphData {
  nodes: UserNode[];
  links: Link[];
}