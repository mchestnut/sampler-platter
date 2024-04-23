<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  players: Player[];
  round: number;
}>();

const emit = defineEmits<{
  next: [roundPairings: Pairing[]];
}>();

/** Prevent an infinite loop in assignment. */
let loopIteration = 0;
const loopThreshold = 500;
const isFailure = ref(false);

const updatePlayerTable = (event: Event, player: Player) => {
  if (!(event.target instanceof HTMLInputElement)) return;

  player.tables[props.round - 1] = event.target.valueAsNumber;
};

const getRandomizedLists = (players: Player[]) => {
  const lists = players.map((player) => player.ownedListName);
  return [...lists].sort(() => Math.random() - 0.5);
};

/**
 * Assigns a list to the player by filtering out that player's owned list, any
 * lists that they have played, and their opponent's list.
 */
const assignListToPlayer = (player: Player, opponent: Player, remainingLists: string[]) => {
  const availableLists = remainingLists.filter((list) => {
    const isOwnedList = list === player.ownedListName;
    const isOpponentList = list === opponent.ownedListName;
    const hasPlayedList = player.assignedLists.includes(list);

    return !isOwnedList && !isOpponentList && !hasPlayedList;
  });

  if (availableLists.length === 0) return null;

  const list = availableLists[0];

  // Remove the list from the remaining lists.
  remainingLists.splice(remainingLists.indexOf(list), 1);

  return list;
};

/**
 * Assigns lists to players based on the round. For round 1, lists are assigned
 * randomly. For rounds 2 and 3, lists are assigned randomly but players cannot
 * be assigned the same list they were assigned in a previous round and cannot
 * play against their own list if there are enough players to avoid it.
 */
const assignListsToPlayers = (roundPairings: Pairing[]) => {
  // If we've tried too many times, stop.
  if (loopIteration >= loopThreshold) {
    console.error('Could not assign lists to players.');
    isFailure.value = true;
    return;
  } else {
    loopIteration++;
  }

  const randomizedLists = getRandomizedLists(props.players);

  const randomizedAnchorLists = getRandomizedLists(
    props.players.filter((player) => player.isAnchor)
  );

  const randomizedFloatingLists = getRandomizedLists(
    props.players.filter((player) => !player.isAnchor)
  );

  // Hold lists in a temporary object in case we need to run again.
  const assignedLists: Record<string, string> = {};

  for (const pairing of roundPairings) {
    let player1List = assignListToPlayer(pairing.player1, pairing.player2, randomizedLists);
    let player2List = assignListToPlayer(pairing.player2, pairing.player1, randomizedLists);

    // let player1List = assignListToPlayer(pairing.player1, pairing.player2, randomizedAnchorLists);
    // let player2List = assignListToPlayer(pairing.player2, pairing.player1, randomizedFloatingLists);

    // If we run out of lists, try assigning player 2 as anchor instead.
    // if (!player1List || !player2List) {
    //   player1List = assignListToPlayer(pairing.player1, pairing.player2, randomizedFloatingLists);
    //   player2List = assignListToPlayer(pairing.player2, pairing.player1, randomizedAnchorLists);

    // If we still can't find a list, start pairings over.
    if (!player1List || !player2List) {
      console.log('Starting over.');
      assignListsToPlayers(roundPairings);
      return;
    }
    // }

    assignedLists[pairing.player1.playerName] = player1List;
    assignedLists[pairing.player2.playerName] = player2List;
  }

  // Assign the lists to the players.
  roundPairings.forEach((pairing) => {
    pairing.player1.assignedLists[props.round - 1] = assignedLists[pairing.player1.playerName];
    pairing.player2.assignedLists[props.round - 1] = assignedLists[pairing.player2.playerName];
  });
};

/** Pair players together by matching table number. */
const createPairings = (): Pairing[] => {
  const playersSortedByTable = [...props.players].sort((a, b) => {
    return a.tables[props.round - 1] - b.tables[props.round - 1];
  });

  const pairings: Pairing[] = [];

  for (let i = 0; i < playersSortedByTable.length; i += 2) {
    pairings.push({
      player1: playersSortedByTable[i],
      player2: playersSortedByTable[i + 1]
    });
  }

  return pairings;
};

const onNext = () => {
  const roundPairings = createPairings();
  assignListsToPlayers(roundPairings);

  if (!isFailure.value) emit('next', roundPairings);
};

const onRetry = () => {
  isFailure.value = false;
  loopIteration = 0;
  onNext();
};
</script>

<template>
  <section>
    <h2>Round {{ props.round }} Pairings</h2>
    <div>
      <table>
        <tr>
          <th>Player Name</th>
          <th>Table #</th>
        </tr>
        <tr v-for="player in props.players" :key="player.playerName">
          <td>{{ player.playerName }}</td>
          <td>
            <input type="number" @input="(event) => updatePlayerTable(event, player)" />
          </td>
        </tr>
      </table>
      <div v-if="!isFailure">
        <button type="button" @click="onNext">Assign Lists</button>
      </div>
      <div v-else>
        Could not assign lists to players.
        <button type="button" @click="onRetry">Retry</button>
      </div>
    </div>
  </section>
</template>
