export type CardType = 
  | 'credential-access'
  | 'initial-access'
  | 'privilege-escalation'
  | 'persistence'
  | 'detection'
  | 'response'
  | 'prevention'
  | 'defense-evasion'
  | 'lateral-movement'
  | 'execution'
  | 'exfiltration'
  | 'impact';  // Added for S3 ransomware attacks

export type Team = 'red' | 'blue';

export type Zone = 
  | 'EC2'
  | 'S3'
  | 'IAM'
  | 'Secrets'
  | 'Logging'
  | 'DNS'
  | 'Organization'
  | 'Network'
  | 'SSM'
  | 'Security';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  effect: string;
  successThreshold: number;
  team: Team;
  targetZone: Zone;
}

export interface Player {
  id: string;
  team: Team;
  resources: number;
  cards: Card[];
  position: Zone;
}

export interface GameState {
  players: Player[];
  currentTurn: number;
  activePlayer: string;
  gamePhase: 'resource-collection' | 'action' | 'defense-response';
  gameStatus: 'setup' | 'playing' | 'finished';
  winner: Team | null;
} 