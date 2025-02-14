<script setup lang="ts">
import Board from './components/Board.vue';
</script>

<template>
  <header>
    
  </header>
  <div class="Alert">
    <div class="Content">
      <h3 id="alertMessage"></h3>
      <button id="alertButton">Ok</button>
    </div>
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