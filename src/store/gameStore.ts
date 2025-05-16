import { create } from 'zustand';
import { GameState, Card, Player, Zone } from '../types/game';

interface GameStore extends GameState {
  redLog: string[];
  blueLog: string[];
  redScore: number;
  blueScore: number;
  redDeck: Card[];
  blueDeck: Card[];
  initializePlayers: (cards: Card[]) => void;
  handleZoneClick: (zoneId: Zone) => void;
  handleCardPlay: (card: Card) => void;
  handleResourceRoll: (roll: number) => void;
  handleNextPhase: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  currentTurn: 0,
  activePlayer: '',
  gamePhase: 'resource-collection',
  gameStatus: 'setup',
  winner: null,
  redLog: [],
  blueLog: [],
  redScore: 0,
  blueScore: 0,
  redDeck: [],
  blueDeck: [],

  initializePlayers: (cards: Card[]) => {
    const redDeck = cards.filter(card => card.team === 'red');
    const blueDeck = cards.filter(card => card.team === 'blue');
    const redPlayer: Player = {
      id: 'red',
      team: 'red',
      resources: 5,
      cards: redDeck.slice(0, 3),
      position: 'Network',
    };
    const bluePlayer: Player = {
      id: 'blue',
      team: 'blue',
      resources: 8,
      cards: blueDeck.slice(0, 3),
      position: 'Security',
    };
    set({
      players: [redPlayer, bluePlayer],
      currentTurn: 1,
      activePlayer: 'red',
      gamePhase: 'resource-collection',
      gameStatus: 'playing',
      winner: null,
      redDeck: redDeck.slice(3),
      blueDeck: blueDeck.slice(3),
      redLog: [],
      blueLog: [],
      redScore: 0,
      blueScore: 0,
    });
  },

  handleZoneClick: (zoneId: Zone) => {
    set((state) => {
      if (state.gameStatus !== 'playing' || state.gamePhase !== 'action') return state;

      const updatedPlayers = state.players.map(player => {
        if (player.id === state.activePlayer) {
          return { ...player, position: zoneId };
        }
        return player;
      });

      return { ...state, players: updatedPlayers };
    });
  },

  handleCardPlay: (card: Card) => {
    set((state) => {
      if (state.gameStatus !== 'playing' || state.gamePhase !== 'action') return state;

      const activePlayer = state.players.find(p => p.id === state.activePlayer);
      if (!activePlayer || activePlayer.resources < card.cost) return state;

      // Roll for success
      const roll = Math.floor(Math.random() * 6) + 1;
      const isSuccess = roll >= card.successThreshold;
      
      const updatedPlayers = state.players.map(player => {
        if (player.id === state.activePlayer) {
          return {
            ...player,
            resources: player.resources - card.cost,
            cards: player.cards.filter(c => c.id !== card.id),
          };
        }
        return player;
      });

      const logMsg = `${card.team === 'red' ? 'Red' : 'Blue'} played ${card.name} (Roll: ${roll}, ${isSuccess ? 'Success!' : 'Failed'})`;
      const effectMsg = isSuccess ? `Effect: ${card.effect}` : 'Effect: No effect due to failed roll';
      
      if (card.team === 'red') {
        return {
          ...state,
          players: updatedPlayers,
          redLog: [...state.redLog, logMsg, effectMsg],
          redScore: isSuccess ? state.redScore + 1 : state.redScore,
        };
      } else {
        return {
          ...state,
          players: updatedPlayers,
          blueLog: [...state.blueLog, logMsg, effectMsg],
          blueScore: isSuccess ? state.blueScore + 1 : state.blueScore,
        };
      }
    });
  },

  handleResourceRoll: (roll: number) => {
    set((state) => {
      if (state.gameStatus !== 'playing' || state.gamePhase !== 'resource-collection') return state;
      const updatedPlayers = state.players.map(player => {
        if (player.id === state.activePlayer) {
          const bonus = player.team === 'blue' ? 2 : 0;
          return {
            ...player,
            resources: Math.min(10, player.resources + roll + bonus),
          };
        }
        return player;
      });
      // Draw/refill cards for the active player
      let redDeck = state.redDeck;
      let blueDeck = state.blueDeck;
      const playersWithCards = updatedPlayers.map(player => {
        if (player.id === state.activePlayer) {
          let hand = [...player.cards];
          if (player.team === 'red') {
            while (hand.length < 3 && redDeck.length > 0) {
              hand.push(redDeck[0]);
              redDeck = redDeck.slice(1);
            }
          } else {
            while (hand.length < 3 && blueDeck.length > 0) {
              hand.push(blueDeck[0]);
              blueDeck = blueDeck.slice(1);
            }
          }
          return { ...player, cards: hand };
        }
        return player;
      });
      const nextPhase = state.gamePhase === 'resource-collection' ? 'action' : 'defense-response';
      const nextPlayer = state.activePlayer === 'red' ? 'blue' : 'red';
      const nextTurn = nextPlayer === 'red' ? state.currentTurn + 1 : state.currentTurn;
      return {
        ...state,
        players: playersWithCards,
        gamePhase: nextPhase,
        activePlayer: nextPlayer,
        currentTurn: nextTurn,
        redDeck,
        blueDeck,
        redLog: [...state.redLog, `Red rolled for resources: ${roll}`],
        blueLog: [...state.blueLog, `Blue rolled for resources: ${roll}`],
      };
    });
  },

  handleNextPhase: () => {
    set((state) => {
      const nextPhase = state.gamePhase === 'resource-collection' ? 'action' : 
                       state.gamePhase === 'action' ? 'defense-response' : 'resource-collection';
      const nextPlayer = nextPhase === 'resource-collection' ? (state.activePlayer === 'red' ? 'blue' : 'red') : state.activePlayer;
      const nextTurn = nextPhase === 'resource-collection' && nextPlayer === 'red' ? state.currentTurn + 1 : state.currentTurn;

      // Draw/refill cards if needed
      let redDeck = state.redDeck;
      let blueDeck = state.blueDeck;
      const playersWithCards = state.players.map(player => {
        if (nextPhase === 'resource-collection' && player.id === nextPlayer) {
          let hand = [...player.cards];
          if (player.team === 'red') {
            while (hand.length < 3 && redDeck.length > 0) {
              hand.push(redDeck[0]);
              redDeck = redDeck.slice(1);
            }
          } else {
            while (hand.length < 3 && blueDeck.length > 0) {
              hand.push(blueDeck[0]);
              blueDeck = blueDeck.slice(1);
            }
          }
          return { ...player, cards: hand };
        }
        return player;
      });

      const phaseMsg = `${nextPlayer.toUpperCase()} Phase: ${nextPhase.replace('-', ' ').toUpperCase()}`;
      return {
        ...state,
        players: playersWithCards,
        gamePhase: nextPhase,
        activePlayer: nextPlayer,
        currentTurn: nextTurn,
        redDeck,
        blueDeck,
        redLog: [...state.redLog, nextPlayer === 'red' ? phaseMsg : ''],
        blueLog: [...state.blueLog, nextPlayer === 'blue' ? phaseMsg : ''],
      };
    });
  },
})); 