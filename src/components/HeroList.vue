<template>
  <div class="hero-list-container">
    <h2>List of Heroes</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Attributes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hero in heroes" :key="hero.id">
          <td>
            {{ hero.id.slice(0, 8) }}...
          </td>
          <td>{{ hero.name }}</td>
          <td>
            Agility: {{ hero.attributes.agility }},
            Strength: {{ hero.attributes.strength }},
            Weight: {{ hero.attributes.weight }},
            Endurance: {{ hero.attributes.endurance }},
            Charisma: {{ hero.attributes.charisma }}
          </td>
          <td>
            <button class="edit-btn" @click="editHero(hero)">Edit</button>
            <button class="delete-btn" @click="openDeleteModal(hero)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="fetchHeroes">Refresh List</button>
    <Notification v-if="notification.visible" :message="notification.message" />

    <div v-if="deleteModalVisible" class="modal">
      <div class="modal-content">
        <template v-if="deleteSuccess">
          <h3>You successfully deleted the superhero!</h3>
          <p>ID: {{ heroToDelete?.id }}</p>
          <p>Name: {{ heroToDelete?.name }}</p>
          <button class="close-btn" @click="closeDeleteModalAndRefresh">Close</button>
        </template>
        <template v-else>
          <h3>Are you sure you want to delete this superhero?</h3>
          <p>ID: {{ heroToDelete?.id }}</p>
          <p>Name: {{ heroToDelete?.name }}</p>
          <div class="modal-actions">
            <button class="confirm-btn" @click="confirmDelete">Confirm</button>
            <button class="cancel-btn" @click="closeDeleteModal">Cancel</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getHeroes, removeSuperhero } from '@/providers/superHeroes';
import Notification from './Notification.vue';

export default defineComponent({
  name: 'HeroList',
  components: {
    Notification,
  },
  data() {
    return {
      heroes: [] as Array<{
        id: string;
        name: string;
        attributes: {
          agility: number;
          strength: number;
          weight: number;
          endurance: number;
          charisma: number;
        };
      }>,
      notification: {
        visible: false,
        message: '',
      },
      deleteModalVisible: false,
      heroToDelete: null as { id: string; name: string } | null,
      deleteSuccess: false,
    };
  },
  methods: {
    async fetchHeroes() {
      try {
        const response = await getHeroes();
        this.heroes = response;
      } catch (error) {
        console.error('Error fetching heroes:', error);
      }
    },
    closeList() {
      this.$emit('reset');
    },
    editHero(hero: { id: string; name: string; attributes: object }) {
      this.$emit('edit', hero);
    },
    openDeleteModal(hero: { id: string; name: string }) {
      this.heroToDelete = hero;
      this.deleteModalVisible = true;
      this.deleteSuccess = false;
    },
    closeDeleteModal() {
      this.heroToDelete = null;
      this.deleteModalVisible = false;
    },
    closeDeleteModalAndRefresh() {
      this.closeDeleteModal();
      this.fetchHeroes();
    },
    async confirmDelete() {
      if (this.heroToDelete) {
        try {
          await removeSuperhero(this.heroToDelete.id);
          this.deleteSuccess = true;
          this.notification.message = `Hero with ID ${this.heroToDelete.id} deleted successfully!`;
          this.notification.visible = true;
          setTimeout(() => {
            this.notification.visible = false;
          }, 3000);
          this.fetchHeroes();
        } catch (error) {
          console.error('Error deleting hero:', error);
          this.notification.message = `Failed to delete hero with ID ${this.heroToDelete.id}.`;
          this.notification.visible = true;
          setTimeout(() => {
            this.notification.visible = false;
          }, 3000);
        }
      }
    },
  },
  mounted() {
    this.fetchHeroes();
  },
  expose: ['fetchHeroes'],
});
</script>

<style scoped>
.hero-list-container {
  padding: 20px;
  border: 1px solid #32cd32;
  border-radius: 8px;
  max-width: 800px;
  margin: auto;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

button {
  margin-top: 10px;
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  background-color: #32cd32;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #2a9d2a;
}

td button {
  margin-left: 10px;
  padding: 3px 10px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

td button.edit-btn {
  background-color: #4682b4;
  color: white;
}

td button.edit-btn:hover {
  background-color: #356a8a;
}

td button.delete-btn {
  background-color: #dc143c;
  color: white;
}

td button.delete-btn:hover {
  background-color: #a10e2c;
}

.modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
  height: auto;
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
  width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.confirm-btn {
  padding: 10px 20px;
  background-color: #32cd32;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-btn:hover {
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

.close-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4682b4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #356a8a;
}
</style>
