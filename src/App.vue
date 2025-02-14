<script setup>
import Board from './components/Board.vue';
import { Trophy, HelpCircle, Users } from 'lucide-vue-next';
import { ElContainer, ElDialog, ElTable, ElText } from 'element-plus';
import { ref } from 'vue';

const helpDialogVisible = ref(false);
const recordsDialogVisible = ref(false);
const records = ref(JSON.parse(window.localStorage.getItem('records')) || []);

const handleOpenRecords = () => {
  records.value = JSON.parse(window.localStorage.getItem('records')) || [];
  // De mayor a menor tiempo
  records.value.sort((a, b) => a.time - b.time);

  // Se añade la unidad de tiempo
  records.value.forEach((record) => {
    record.time = record.time + ' segundos';
  });

  recordsDialogVisible.value = true;
}
</script>

<template>
  <!-- Modals -->
  <div class="Alert">
    <div class="Content">
      <h3 id="alertMessage"></h3>
      <button id="alertButton">Ok</button>
    </div>
  </div>

  <ElDialog v-model="helpDialogVisible" title="¿Cómo Jugar?" width="500">
    <div class="mb-2">
      <ElText>
        El objetivo es colocar 8 reinas en el tablero de ajedrez, en casillas donde ninguna reina pueda atacar a otra
        reina.
      </ElText>
    </div>
    <ul class="list-disc pl-4">
      <li>
        <ElText>Haz clic en una casilla vacía para colocar una reina.</ElText>
      </li>
      <li>
        <ElText>Los cuadrados rojos indican cuadrados bajo ataque.</ElText>
      </li>
      <li>
        <ElText>Haga clic en una reina para eliminarla</ElText>
      </li>
      <li>
        <ElText>¡Ganas cuando colocas con éxito 8 reinas!</ElText>
      </li>
    </ul>
  </ElDialog>

  <ElDialog v-model="recordsDialogVisible" title="Ranking" width="500">
    <div class="mb-2">
      <ElText>
        Mejores tiempos:
      </ElText>
    </div>
    <ElTable :data="records" style="width: 100%">
      <el-table-column prop="name" label="Jugador" />
      <el-table-column prop="time" label="Tiempo" />
      <el-table-column prop="date" label="Fecha" />
    </ElTable>
  </ElDialog>

  <!-- Content -->
  <div class="button-group">
    <button class="button" @click="helpDialogVisible = true">
      <HelpCircle :size="16" />
      Ayuda
    </button>
    <button class="button" @click="handleOpenRecords">
      <Trophy :size="16" />
      Records
    </button>
  </div>
  <section class="GameContainer">
    <div class="Game">
      <h1>Juego de las 8 reinas <a href="#" class="theme-toggle" data-animation="polygon">🌓</a></h1>
      <p>¿Puedes colocar 8 reinas sin que se amenacen?</p>
      <Board />
      <button id="restartButton">Reiniciar</button>
    </div>
  </section>
  <footer>
    <p>&copy; Instituto Universitario Jesús Obrero</p>
    <span>Operado por Jenderson Abarca y Angello Aponte</span>
  </footer>
</template>

<style scoped>
.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 64px;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 5px;
  background-color: var(--background-primary);
  color: var(--color-secondary);
  border: none;
  cursor: pointer;
  transition: 0.2s;
  font-size: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.button:hover {
  /*blue */
  background-color: #007bff;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
</style>