<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  pairings: Pairing[];
  players: Player[];
  round: number;
}>();

const emit = defineEmits<{
  next: [];
  complete: [];
}>();

const getListOwner = (listName: string) => {
  return props.players.find((player) => player.ownedListName === listName);
};

const getOwnerName = (listName: string) => {
  const owner = getListOwner(listName);
  return owner?.playerName ?? 'Unknown';
};

/** Updates points for player and owner. */
const updatePlayerPoints = (event: Event, player: Player) => {
  if (!(event.target instanceof HTMLInputElement)) return;

  player.playerPoints[props.round - 1] = event.target.valueAsNumber;

  const owner = getListOwner(player.assignedLists[props.round - 1]);
  if (owner) {
    owner.listPoints[props.round - 1] = event.target.valueAsNumber;
  }
};

const buttonLabel = computed(() => {
  return props.round < 3 ? 'Next Round' : 'Finish Tournament';
});

const onNext = () => {
  props.round < 3 ? emit('next') : emit('complete');
};
</script>

<template>
  <section>
    <h2>Round {{ props.round }} Assignments</h2>
    <div>
      <table>
        <tr>
          <th>Table #</th>
          <th>Player 1 Name</th>
          <th>Player 1 Assigned List</th>
          <th>Player 1 Points</th>
          <th>Player 2 Name</th>
          <th>Player 2 Assigned List</th>
          <th>Player 2 Points</th>
        </tr>
        <tr v-for="pairing in props.pairings" :key="pairing.player1.playerName">
          <td>{{ pairing.player1.tables[props.round - 1] }}</td>
          <td>{{ pairing.player1.playerName }}</td>
          <td>
            {{ pairing.player1.assignedLists[props.round - 1] }}
            ({{ getOwnerName(pairing.player1.assignedLists[props.round - 1]) }})
          </td>
          <td>
            <input type="number" @input="(event) => updatePlayerPoints(event, pairing.player1)" />
          </td>
          <td>{{ pairing.player2.playerName }}</td>
          <td>
            {{ pairing.player2.assignedLists[props.round - 1] }}
            ({{ getOwnerName(pairing.player2.assignedLists[props.round - 1]) }})
          </td>
          <td>
            <input type="number" @input="(event) => updatePlayerPoints(event, pairing.player2)" />
          </td>
        </tr>
      </table>
      <button type="button" @click="onNext">{{ buttonLabel }}</button>
    </div>
  </section>
</template>
