<script setup>
import { Book, BookOpen, Bookmark, BookMarked } from 'lucide-vue-next';

const props = defineProps({
  reading: {
    type: Object,
    default: null
  },
  index: {
    type: Number,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  },
  verseText: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['open-link']);

const bookIcons = [Book, BookOpen, Bookmark, BookMarked];
const getBookIcon = (index) => bookIcons[index % bookIcons.length];

const getVersePreview = (text) => {
  if (!text) return '';
  const preview = text.slice(0, 150);
  return preview + (text.length > 150 ? '...' : '');
};
</script>

<template>
  <div 
    class="reading-column"
    :class="`reading-column-${index}`"
  >
    <div class="reading-content">
      <component 
        v-if="reading"
        :is="getBookIcon(index)"
        class="reading-icon" 
      />
      
      <div class="reading-title-container">
        <h3 class="reading-title">{{ reading ? reading.book : 'REST DAY' }}</h3>
        <div v-if="reading" class="reading-verses">{{ reading.verses }}</div>
      </div>
      
      <div class="reading-text">
        <p v-if="!reading">Today is a rest day. Take time to reflect on the week's readings and meditate on God's word.</p>
        <p v-else-if="isLoading">Loading verses...</p>
        <p v-else-if="hasError">Unable to load preview</p>
        <p v-else>{{ getVersePreview(verseText) }}</p>
      </div>

      <div v-if="reading" class="reading-footer">
        <Button
          @click="emit('open-link', reading.url)"
          class="read-button"
          severity="secondary"
          outlined
        >
          READ NOW
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reading-column {
  flex: auto;
  width: 280px;
  padding: 3rem 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  box-shadow: inset 10px 0px 20px 2px rgba(0, 0, 0, 0.2)
}

.reading-column-0 {
  background: linear-gradient(180deg, #f7b731 0%, #f39c12 100%);
}

.reading-column-1 {
  background: linear-gradient(180deg, #fa8231 0%, #f77f00 100%);
}

.reading-column-2 {
  background: linear-gradient(180deg, #ee5a6f 0%, #e74c3c 100%);
}

.reading-column-3 {
  background: linear-gradient(180deg, #c44569 0%, #a83a5a 100%);
}

.no-reading-column {
  background: linear-gradient(180deg, #95a5a6 0%, #7f8c8d 100%);
  flex: 1;
  max-width: 100%;
}

.reading-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
}

.reading-icon {
  width: 3rem;
  height: 3rem;
  opacity: 0;
}

.reading-title-container {
  position: relative;
}

.reading-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.reading-verses {
  font-size: 4rem;
  opacity: 0.95;
  font-weight: bold;
  position: absolute;
  top: 30%;
  left: 0;
  transform: translateY(-90%);
}

.reading-text {
  font-size: 0.9rem;
  line-height: 1.7;
  opacity: 0.95;
}

.reading-footer {
  padding-top: 1.5rem;
}

.read-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  background: transparent !important;
  border: 2px solid white !important;
  color: white !important;
  transition: all 0.3s;
}

.read-button:hover {
  background: white !important;
  color: #333 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .reading-column {
    min-width: 250px;
  }
}

@media (max-width: 768px) {
  .reading-column {
    min-width: 100%;
    max-width: 100%;
    padding: 2rem 1.5rem;
  }
}
</style>
