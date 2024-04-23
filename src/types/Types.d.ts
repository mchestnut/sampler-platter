interface Player {
  playerName: string;
  ownedListName: string;
  isAnchor: boolean;
  tables: number[];
  assignedLists: string[];
  playerPoints: number[];
  listPoints: number[];
  totalPoints: number;
}

interface Pairing {
  player1: Player;
  player2: Player;
}

type Step = 'registration' | 'pairings' | 'assignments' | 'results';
