<template>
  <h1 class="gradient-text shine-animation title">Pentatlón de Superhéroes</h1>
  <nav class="navbar">
    <button class="btn-green" @click="openCreateModal">Create Superhero</button>
  </nav>
  <HeroList ref="heroList" v-if="currentComponent === 'list'" @reset="resetComponent" @edit="openEditModal" />

  <div v-if="createModalVisible" class="modal">
    <div class="modal-content">
      <button class="close-btn" @click="closeCreateModal">X</button>
      <CreateSuperheroForm @reset="closeCreateModal" />
    </div>
  </div>

  <div v-if="editModalVisible" class="modal">
    <div class="modal-content">
      <button class="close-btn" @click="closeEditModal">X</button>
      <EditSuperheroForm v-if="selectedHero" :hero="selectedHero" @reset="closeEditModal" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import './App.scss'
import HeroList from '@/components/HeroList.vue'
import CreateSuperheroForm from './components/CreateSuperheroForm.vue'
import EditSuperheroForm from './components/EditSuperheroForm.vue'

@Options({
  components: {
    HeroList,
    CreateSuperheroForm,
    EditSuperheroForm,
  },
})
export default class App extends Vue {
  currentComponent: string | null = 'list'
  createModalVisible: boolean = false
  editModalVisible: boolean = false
  selectedHero: { id: string; name: string; attributes: object } | null = null

  declare $refs: {
    heroList: InstanceType<typeof HeroList>
  }

  showComponent(component: string) {
    if (this.currentComponent === component) {
      this.resetComponent()
    } else {
      this.currentComponent = component
    }
  }

  resetComponent() {
    this.currentComponent = 'list'
  }

  openCreateModal() {
    this.createModalVisible = true
  }

  closeCreateModal() {
    this.createModalVisible = false
  }

  openEditModal(hero: { id: string; name: string; attributes: object }) {
    if (hero) {
      this.selectedHero = hero
      this.editModalVisible = true
    } else {
      console.error('Hero data is undefined')
    }
  }

  closeEditModal() {
    this.editModalVisible = false
    this.selectedHero = null
    this.$refs.heroList.fetchHeroes()
  }
}
</script>

<style scoped>
.title {
  margin-top: 120px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  gap: 10px;
}

.btn-green {
  background-color: #32cd32;
  color: white;
  border: 1px solid #2a9d2a;
}

.btn-yellow {
  background-color: #ffd700;
  color: black;
  border: 1px solid #d4af37;
}

.btn-red {
  background-color: #dc143c;
  color: white;
  border: 1px solid #a10e2c;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

.modal {
  position: fixed;
  top: -10px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px 0;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  width: 450px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #dc143c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #a10e2c;
}
</style>
