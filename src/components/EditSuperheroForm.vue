<template>
  <div class="form-container">
    <h2>Edit Your Favorite Superhero</h2>
    <form @submit.prevent="submitForm">
      <div class="name-section">
        <div class="field">
          <label for="heroId">Hero ID</label>
          <input id="heroId" v-model="form.heroId" type="text" readonly />
        </div>
        <div class="field">
          <label for="name">Name</label>
          <input id="name" v-model="form.name" type="text" required />
        </div>
      </div>
      <fieldset>
        <legend>Attributes</legend>
        <div class="container-counters">
          <label for="agility">Agility</label>
          <div class="input-group">
            <button type="button" @click="decrement('agility')">-</button>
            <input id="agility" v-model.number="form.attributes.agility" type="text" readonly />
            <button type="button" @click="increment('agility')">+</button>
          </div>
        </div>
        <div class="container-counters">
          <label for="strength">Strength</label>
          <div class="input-group">
            <button type="button" @click="decrement('strength')">-</button>
            <input id="strength" v-model.number="form.attributes.strength" type="text" readonly />
            <button type="button" @click="increment('strength')">+</button>
          </div>
        </div>
        <div class="container-counters">
          <label for="weight">Weight</label>
          <div class="input-group">
            <button type="button" @click="decrement('weight')">-</button>
            <input id="weight" v-model.number="form.attributes.weight" type="text" readonly />
            <button type="button" @click="increment('weight')">+</button>
          </div>
        </div>
        <div class="container-counters">
          <label for="endurance">Endurance</label>
          <div class="input-group">
            <button type="button" @click="decrement('endurance')">-</button>
            <input id="endurance" v-model.number="form.attributes.endurance" type="text" readonly />
            <button type="button" @click="increment('endurance')">+</button>
          </div>
        </div>
        <div class="container-counters">
          <label for="charisma">Charisma</label>
          <div class="input-group">
            <button type="button" @click="decrement('charisma')">-</button>
            <input id="charisma" v-model.number="form.attributes.charisma" type="text" readonly />
            <button type="button" @click="increment('charisma')">+</button>
          </div>
        </div>
      </fieldset>
      <button type="submit">Submit</button>
    </form>

    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <h3 v-if="!error">Superhero Edited Successfully</h3>
        <h3 v-else>Error Updating Superhero</h3>
        <p>ID: {{ form.heroId }}</p>
        <p v-if="!error">Name: {{ form.name }}</p>
        <p v-else>{{ errorMessage }}</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { editSuperhero } from '../providers/superHeroes';

export default defineComponent({
  name: 'EditSuperheroForm',
  props: {
    hero: {
      type: Object as PropType<{ id: string; name: string; attributes: any }>,
      required: true,
    },
  },
  data() {
    return {
      form: {
        heroId: this.hero?.id || '',
        name: this.hero?.name || '',
        attributes: this.hero?.attributes ? { ...this.hero.attributes } : { agility: 0, strength: 0, weight: 0, endurance: 0, charisma: 0 },
      },
      modalVisible: false,
      error: false,
      errorMessage: '',
    };
  },
  methods: {
    increment(attribute: keyof typeof this.form.attributes) {
      if (this.form.attributes[attribute] < 10) {
        this.form.attributes[attribute]++;
      }
    },
    decrement(attribute: keyof typeof this.form.attributes) {
      if (this.form.attributes[attribute] > 0) {
        this.form.attributes[attribute]--;
      }
    },
    async submitForm() {
      try {
        await editSuperhero(this.form.heroId, this.form.name, this.form.attributes);
        this.error = false;
        this.modalVisible = true;
      } catch (error) {
        console.error(error);
        this.error = true;
        this.errorMessage = `Failed to update superhero with ID: ${this.form.heroId}`;
        this.modalVisible = true;
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.$emit('reset');
    },
  },
});
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.name-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

.container-counters {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 600px;
}

fieldset {
  border: 1px solid #ccc;
  padding: 10px;
  width: 100%;
}

div {
  display: flex;
  align-items: center;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  padding: 5px 10px;
  background-color: #ffd700;
  color: black;
  border: 1px solid #d4af37;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

input[type="text"] {
  width: 100%;
  max-width: 300px;
  text-align: left;
  border: 2px solid #ffd700;
  border-radius: 5px;
}

h2 {
  text-align: center;
  color: #ffd700;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-bottom: 10px;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #32cd32;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #2a9d2a;
}
</style>
