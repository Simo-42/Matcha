<template>
  <div class="hearts-container">
    <div v-for="heart in hearts" :key="heart.id" class="heart" :style="heart.style">♥</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const hearts = ref([]);
let heartId = 0;
let animationFrame;

function createHeart() {
  const heart = {
    id: heartId++,
    style: {
      left: Math.random() * 100 + 'vw',
      top: Math.random() * 100 + 'vh',
      opacity: Math.random(),
      transform: `scale(${Math.random() * 0.5 + 0.5})`,
      color: `rgba(255, ${Math.random() * 100}, ${Math.random() * 100}, 0.6)`,
      animation: `float ${Math.random() * 5 + 3}s linear infinite`
    }
  };
  hearts.value.push(heart);
  
  // Remove heart after animation
  setTimeout(() => {
    hearts.value = hearts.value.filter(h => h.id !== heart.id);
  }, 8000);
}

function animate() {
  if (hearts.value.length < 20) { // Limit max hearts
    createHeart();
  }
  animationFrame = requestAnimationFrame(animate);
}

onMounted(() => {
  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.hearts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.heart {
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}
</style>
