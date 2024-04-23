<script setup lang="ts">
import { onMounted, ref } from 'vue';

import AssignmentsStep from '@/components/assignments-step.vue';
import PairingsStep from '@/components/pairings-step.vue';
import RegistrationStep from '@/components/registration-step.vue';
import ResultsStep from '@/components/results-step.vue';

/*
REQUIREMENTS AND STEPS

Player should never play their own list
If possible, player should not play against their own list


registration    Enter players and their lists

pairings        Enter player pairings from T4 for round 1
assignments     Generate list assignments for round 1

pairings        Enter player pairings and points from T4 for round 2
assignments     Generate list assignments for round 2

pairings        Enter player pairings and points from T4 for round 3
assignments     Generate list assignments for round 3

pairings        Enter player points from T4 from round 3
results         Calculate player and list points from tournament
*/

const players = ref<Player[]>([]);
const currentStep = ref<Step>('registration');
const currentRound = ref(0);
const pairings = ref<Record<number, Pairing[]>>({});

// Local storage logic.

const retrieveLocalStorage = () => {
  const storedPlayers = localStorage.getItem('players');
  if (storedPlayers) players.value = JSON.parse(storedPlayers);

  const storedCurrentStep = localStorage.getItem('currentStep');
  if (storedCurrentStep) currentStep.value = storedCurrentStep as Step;

  const storedCurrentRound = localStorage.getItem('currentRound');
  if (storedCurrentRound) currentRound.value = parseInt(storedCurrentRound);

  const storedPairings = localStorage.getItem('pairings');
  if (storedPairings) pairings.value = JSON.parse(storedPairings);
};

const updateLocalStorage = () => {
  localStorage.setItem('players', JSON.stringify(players.value));
  localStorage.setItem('currentStep', currentStep.value);
  localStorage.setItem('currentRound', currentRound.value.toString());
  localStorage.setItem('pairings', JSON.stringify(pairings.value));
};

const resetLocalStorage = () => {
  localStorage.removeItem('players');
  localStorage.removeItem('currentStep');
  localStorage.removeItem('currentRound');
  localStorage.removeItem('pairings');
};

// Navigation logic.

const start = (_players: Player[]) => {
  players.value = _players;
  currentStep.value = 'pairings';
  currentRound.value = 1;
  updateLocalStorage();
};

const goToAssignments = (roundPairings: Pairing[]) => {
  pairings.value[currentRound.value] = roundPairings;
  currentStep.value = 'assignments';
  updateLocalStorage();
};

const goToPairings = () => {
  currentRound.value += 1;
  currentStep.value = 'pairings';
  updateLocalStorage();
};

const goToResults = () => {
  currentStep.value = 'results';
  updateLocalStorage();
};

// Reset logic.
const dialogEl = ref<HTMLDialogElement | null>(null);

const onDisplayResetDialog = () => {
  dialogEl.value?.showModal();
};

const confirmReset = () => {
  players.value = [];
  currentStep.value = 'registration';
  currentRound.value = 0;
  pairings.value = {};
  resetLocalStorage();
  dialogEl.value?.close();
};

const rejectReset = () => {
  dialogEl.value?.close();
};

// Lifecycle hooks.

onMounted(() => {
  retrieveLocalStorage();
});
</script>

<template>
  <main>
    <button
      v-if="currentStep !== 'registration'"
      type="button"
      class="reset-button"
      @click="onDisplayResetDialog"
    >
      Reset
    </button>

    <div class="card">
      <RegistrationStep v-if="currentStep === 'registration'" @next="start" />
      <PairingsStep
        v-else-if="currentStep === 'pairings'"
        :players="players"
        :round="currentRound"
        @next="goToAssignments"
      />
      <AssignmentsStep
        v-else-if="currentStep === 'assignments'"
        :pairings="pairings[currentRound]"
        :players="players"
        :round="currentRound"
        @next="goToPairings"
        @complete="goToResults"
      />
      <ResultsStep v-else-if="currentStep === 'results'" :players="players" />
    </div>

    <dialog ref="dialogEl" class="dialog">
      <div class="dialog-content">
        <p>Are you sure you want to reset the tournament?</p>
        <div class="dialog-buttons">
          <button type="button" @click="confirmReset">Yes</button>
          <button type="button" @click="rejectReset">No</button>
        </div>
      </div>
    </dialog>
  </main>
</template>

<style lang="postcss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  padding: 3rem 6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.reset-button {
  width: auto;
  margin-top: 0;
  position: absolute;
  top: 1rem;
  right: 1rem;

  &:not(:hover) {
    color: #555;
    background-color: transparent;
  }
}

.dialog {
  width: auto;
  height: auto;
  padding: 0;
  border: none;
  background-color: transparent;

  &[open] {
    display: grid;
    place-items: center;
  }

  & .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: min(24rem, 100%);
    padding: 2rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  & .dialog-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
