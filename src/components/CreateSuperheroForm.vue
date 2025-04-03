<template>
  <div class="form-container">
    <h2>Create a New Superhero</h2>
    <form @submit.prevent="submitForm">
      <div class="name-section">
        <div class="form-group">
          <label for="name">Name:</label>
          <input id="name" v-model="superhero.name" type="text" required />
        </div>
      </div>
      <div class="counters-container">
        <div class="form-group" v-for="(value, key) in superhero.attributes" :key="key">
          <label :for="key">{{ key.charAt(0).toUpperCase() + key.slice(1) }}:</label>
          <div class="counter">
            <button type="button" @click="decrement(key)">-</button>
            <input :id="key" v-model.number="superhero.attributes[key]" type="number" min="0" max="10" readonly />
            <button type="button" @click="increment(key)">+</button>
          </div>
        </div>
      </div>
      <button type="submit" class="submit-btn">Submit</button>
    </form>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <div class="modal-actions">
          <button class="create-another-btn" @click="resetForm">Create Another Superhero</button>
          <button class="cancel-btn" @click="cancelAndRefresh">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createSuperhero } from '@/providers/superHeroes'

interface SuperheroAttributes {
  agility: number
  strength: number
  weight: number
  endurance: number
  charisma: number
}

interface Superhero {
  name: string
  attributes: SuperheroAttributes
}

export default defineComponent({
  name: 'CreateSuperheroForm',
  data() {
    return {
      superhero: {
        name: '',
        attributes: {
          agility: 1,
          strength: 1,
          weight: 1,
          endurance: 1,
          charisma: 1,
        },
      } as Superhero,
      showModal: false,
      modalMessage: '',
    }
  },
  methods: {
    increment(attribute: keyof SuperheroAttributes) {
      if (this.superhero.attributes[attribute] < 10) {
        this.superhero.attributes[attribute]++
      }
    },
    decrement(attribute: keyof SuperheroAttributes) {
      if (this.superhero.attributes[attribute] > 0) {
        this.superhero.attributes[attribute]--
      }
    },
    async submitForm() {
      try {
        const response = await createSuperhero(this.superhero)
        console.log('API Response:', response)
        this.modalMessage = `Superhero created: ${this.superhero.name}`
        this.showModal = true
      } catch (error) {
        console.error('Error creating superhero:', error)
        this.modalMessage = `Failed to create superhero: ${this.superhero.name}`
        this.showModal = true
      }
    },
    resetForm() {
      this.superhero.name = ''
      this.superhero.attributes = {
        agility: 1,
        strength: 1,
        weight: 1,
        endurance: 1,
        charisma: 1,
      }
      this.modalMessage = ''
      this.showModal = false
    },
    cancelAndRefresh() {
      this.showModal = false
      this.$emit('reset')
    },
  },
})
</script>

<style scoped>
.form-container {
  padding: 20px;
  border: 1px solid #32cd32;
  border-radius: 8px;
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.name-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.counters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.counter {
  display: flex;
  align-items: center;
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

button {
  padding: 5px 10px;
  border: 1px solid #32cd32;
  border-radius: 4px;
  background-color: #32cd32;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #2a9d2a;
}

input[type='number'] {
  width: 40px;
  padding: 5px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

input[type='text'] {
  border: 1px solid #32cd32;
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
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-content button {
  margin-top: 10px;
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  background-color: #32cd32;
  color: white;
  cursor: pointer;
}

modal-content button:hover {
  background-color: #2a9d2a;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.create-another-btn {
  padding: 10px 20px;
  background-color: #32cd32;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.create-another-btn:hover {
  background-color: #2a9d2a;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #dc143c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #a10e2c;
}
</style>
