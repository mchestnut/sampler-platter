<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  players: Player[];
}>();

const rankedPlayers = computed(() => {
  // Calculate total points for each player.
  props.players.forEach((player) => {
    // Reset for HMR only.
    player.totalPoints = 0;

    player.playerPoints.forEach((points) => (player.totalPoints += points));
    player.listPoints.forEach((points) => (player.totalPoints += points));
  });

  // Sort players by total points.
  return [...props.players].sort((a, b) => b.totalPoints - a.totalPoints);
});
</script>

<template>
  <section>
    <h2>Tournament Results</h2>
    <div>
      <table>
        <tr>
          <th>Player Name</th>
          <th>Owned List</th>
          <th>Player Points</th>
          <th>List Points</th>
          <th>Total Points</th>
        </tr>
        <tr v-for="player in rankedPlayers" :key="player.playerName">
          <td>{{ player.playerName }}</td>
          <td>{{ player.ownedListName }}</td>
          <td>{{ player.playerPoints.join(', ') }}</td>
          <td>{{ player.listPoints.join(', ') }}</td>
          <td>{{ player.totalPoints }}</td>
        </tr>
      </table>
    </div>
  </section>
</template>
