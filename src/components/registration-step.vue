<script setup lang="ts">
import { ref } from 'vue';

import IconCheck from '@/assets/icon-check.svg?raw';
import IconTrash from '@/assets/icon-trash.svg?raw';

const emit = defineEmits<{
  next: [players: Player[]];
}>();

const players = ref<Player[]>([
  // {
  //   playerName: 'Matt',
  //   ownedListName: 'Ackbar',
  //   isAnchor: true,
  //   tables: [],
  //   assignedLists: [],
  //   playerPoints: [],
  //   listPoints: [],
  //   totalPoints: 0
  // },
  // {
  //   playerName: 'Nathanial',
  //   ownedListName: 'Grievous',
  //   isAnchor: false,
  //   tables: [],
  //   assignedLists: [],
  //   playerPoints: [],
  //   listPoints: [],
  //   totalPoints: 0
  // },
  // {
  //   playerName: 'Devyn',
  //   ownedListName: 'Draven',
  //   isAnchor: false,
  //   tables: [],
  //   assignedLists: [],
  //   playerPoints: [],
  //   listPoints: [],
  //   totalPoints: 0
  // },
  // {
  //   playerName: 'Travis',
  //   ownedListName: 'Sloane',
  //   isAnchor: true,
  //   tables: [],
  //   assignedLists: [],
  //   playerPoints: [],
  //   listPoints: [],
  //   totalPoints: 0
  // },
  // {
  //   playerName: 'Daniel',
  //   ownedListName: 'Romodi',
  //   isAnchor: false,
  //   tables: [],
  //   assignedLists: [],
  //   playerPoints: [],
  //   listPoints: [],
  //   totalPoints: 0
  // },
  // {
  //   playerName: 'AJ',
  //   ownedListName: 'Motti',
  //   isAnchor: true,
  //   tables: [],
  //   assignedLists: [],
  //   playerPoints: [],
  //   listPoints: [],
  //   totalPoints: 0
  // }
]);

// Form logic.

const playerNameModel = ref('');
const ownedListNameModel = ref('');
const isAnchorModel = ref(false);
const playerNameFieldEl = ref<HTMLInputElement | null>(null);

const addPlayer = () => {
  players.value.push({
    playerName: playerNameModel.value,
    ownedListName: ownedListNameModel.value,
    isAnchor: isAnchorModel.value,
    tables: [],
    assignedLists: [],
    playerPoints: [],
    listPoints: [],
    totalPoints: 0
  });

  // Reset field values.
  playerNameModel.value = '';
  ownedListNameModel.value = '';
  isAnchorModel.value = false;
  playerNameFieldEl.value?.focus();
};

const onDelete = (player: Player) => {
  const index = players.value.indexOf(player);
  players.value.splice(index, 1);
};

const onNext = () => {
  emit('next', players.value);
};
</script>

<template>
  <section>
    <div>
      <h2>Add Player</h2>
      <form @submit.prevent="addPlayer">
        <label>
          <span>Player Name</span>
          <input v-model="playerNameModel" ref="playerNameFieldEl" />
        </label>
        <label>
          <span>List Name</span>
          <input v-model="ownedListNameModel" />
        </label>
        <label>
          <span>Anchor Fleet</span>
          <input type="checkbox" v-model="isAnchorModel" />
        </label>
      </form>
      <button type="button" @click="addPlayer">Add Player</button>
    </div>

    <div>
      <h2>Players</h2>
      <div>
        <table>
          <tr>
            <th>Player Name</th>
            <th>Owned List</th>
            <th>Anchor</th>
            <th class="hidden-column"></th>
          </tr>
          <tr v-if="players.length === 0">
            <td colspan="3" class="centered-text">No players yet</td>
          </tr>
          <tr v-for="player in players" :key="player.playerName">
            <td>{{ player.playerName }}</td>
            <td>{{ player.ownedListName }}</td>
            <td class="centered-text">
              <div v-if="player.isAnchor" v-html="IconCheck" title="Yes" class="icon"></div>
            </td>
            <td class="hidden-column">
              <button class="delete-button" @click="() => onDelete(player)">
                <div v-html="IconTrash" title="Remove" class="icon"></div>
              </button>
            </td>
          </tr>
        </table>
        <button type="button" @click="onNext">Start</button>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hidden-column {
  padding: 0 0.5rem;
  border-top: none;
  border-right: none;
  border-bottom: none;
}

.centered-text {
  text-align: center;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &:has(input[type='checkbox']) {
    flex-direction: row;

    input {
      order: -1;
    }
  }
}

& .icon {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  fill: currentcolor;
}

.delete-button {
  width: auto;
  margin-top: 0;
  padding: 0.5rem;
  border: 0;

  &:not(:hover) {
    color: #555;
    background-color: transparent;
  }

  & .icon {
    display: block;
  }
}
</style>
