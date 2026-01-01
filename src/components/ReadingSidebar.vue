<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps({
  formattedDate: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['previous-day', 'next-day', 'set-today']);
</script>

<template>
  <div class="sidebar-section">
    <div class="sidebar-content">
      <h1 class="sidebar-title">Daily Devotional</h1>
      <p class="sidebar-subtitle">Bible in one year with Kaye</p>

      <!-- Date Display -->
      <div class="date-section">
        <h2 class="date-display">{{ formattedDate }}</h2>
      </div>

      <!-- Navigation Buttons -->
      <div class="nav-buttons">
        <Button 
          text
          class="nav-btn"
          @click="emit('previous-day')"
        >
          <ChevronLeft class="w-10 h-10" />
        </Button>
        <Button 
          text
          class="nav-btn nav-btn-today"
          @click="emit('set-today')"
        >
          Today
        </Button>
        <Button 
          text
          class="nav-btn"
          @click="emit('next-day')"
        >
          <ChevronRight class="w-10 h-10" />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-section {
  flex: 1;
  background: linear-gradient(180deg, #6b6b6b 0%, #5a5a5a 100%);
  color: white;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-width: 35vw;
  align-items: center;
  justify-content: center;
}

.sidebar-content {
  max-width: 100%;
}

.sidebar-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.sidebar-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  font-weight: 300;
}

.sidebar-description {
  font-size: 1.5rem;
  line-height: 1.6;
  opacity: 0.85;
  margin-bottom: 2.5rem;
}

.date-section {
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
}

.date-display {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.nav-buttons {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.75rem;
}

.nav-btn {
  color: white !important;
  justify-content: flex-start;
  padding: 0.75rem 1rem !important;
  font-size: 0.95rem;
  transition: all 0.2s;
  border-radius: 8px;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.nav-btn-today {
  background: rgba(255, 255, 255, 0.15) !important;
  font-weight: 600;
  justify-content: center;
}

@media (max-width: 1024px) {
  .sidebar-section {
    flex: 0 0 auto;
    padding: 2rem 1.5rem;
    max-width: none;
    width: 100%;
  }

  .sidebar-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .sidebar-section {
    padding: 1.5rem 1rem;
    max-width: none;
    width: 100%;
  }

  .sidebar-title {
    font-size: 1.25rem;
  }

  .sidebar-description {
    font-size: 0.8rem;
  }
}
</style>
