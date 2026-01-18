import { UserNode, Proposal, VoteType, Link } from './types';

export const INITIAL_NODES: UserNode[] = [
  { id: '1', name: 'Alice', role: 'Facilitator', coherenceScore: 92, status: 'active' },
  { id: '2', name: 'Bob', role: 'Member', coherenceScore: 88, status: 'active' },
  { id: '3', name: 'Charlie', role: 'Guardian', coherenceScore: 95, status: 'active' },
  { id: '4', name: 'Diana', role: 'Member', coherenceScore: 85, status: 'active' },
  { id: '5', name: 'Evan', role: 'Member', coherenceScore: 78, status: 'active' },
  { id: '6', name: 'Fiona', role: 'Member', coherenceScore: 90, status: 'active' },
  { id: '7', name: 'George', role: 'Member', coherenceScore: 82, status: 'active' },
];

export const INITIAL_LINKS: Link[] = [
  { source: '1', target: '2', strength: 0.8 },
  { source: '1', target: '3', strength: 0.9 },
  { source: '2', target: '4', strength: 0.5 },
  { source: '3', target: '5', strength: 0.6 },
  { source: '4', target: '6', strength: 0.7 },
  { source: '5', target: '7', strength: 0.4 },
  { source: '6', target: '1', strength: 0.3 },
  { source: '7', target: '2', strength: 0.5 },
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'p1',
    title: 'Resource Allocation: Community Garden',
    description: 'Allocate 20% of the surplus budget to the new permaculture plot. Participation is voluntary.',
    author: 'Alice',
    status: 'voting',
    votes: {
      '2': VoteType.YES,
      '3': VoteType.YES,
    },
    coercionFlags: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'Mandatory Morning Alignment',
    description: 'All members must attend the 6AM alignment session or face token deduction.',
    author: 'Evan',
    status: 'voting',
    votes: {
      '1': VoteType.NO,
    },
    coercionFlags: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];