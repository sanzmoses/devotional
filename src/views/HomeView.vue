<script setup>
import { ChevronLeft, ChevronRight, Book, BookOpen, Bookmark, BookMarked, BookHeart } from 'lucide-vue-next';
import { useReadingStore } from '../stores/reading';
import { useBibleGatewayStore } from '../stores/biblegateway';
import { useBibleApiStore } from '../stores/bibleapi';
import { computed, watch } from 'vue';

// Import background images
import bg1 from '../assets/background/1.png';
import bg2 from '../assets/background/2.png';
import bg3 from '../assets/background/3.png';
import bg4 from '../assets/background/4.png';

const readingStore = useReadingStore();
const bibleGatewayStore = useBibleGatewayStore();
const bibleApiStore = useBibleApiStore();

// Initialize to today's date
readingStore.setToday();

const formattedDate = computed(() => {
  const date = readingStore.currentDate;
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

const readings = computed(() => readingStore.currentDayReadings);
const readingsWithUrls = computed(() => bibleGatewayStore.getReadingUrls(readings.value));

const bookIcons = [Book, BookOpen, Bookmark, BookMarked];
const backgrounds = [bg1, bg2, bg3, bg4];
const getBookIcon = (index) => bookIcons[index % bookIcons.length];
const getBackground = (index) => backgrounds[index % backgrounds.length];

// Function to get preview of verses (first 150 characters)
const getVersePreview = (text) => {
  if (!text) return '';
  const preview = text.slice(0, 150);
  return preview + (text.length > 150 ? '...' : '');
};

// Function to open link in new tab
const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Watch for changes in readings and fetch verses
watch(readings, async (newReadings) => {
  if (!newReadings) return;
  await bibleApiStore.getMultipleVerses(newReadings);
}, { immediate: true });
</script>

<template>
  <main class="flex flex-column align-items-center justify-content-center overflow-auto py-5 md:py-8">
    <div class="flex align-items-center mb-4">
      <BookHeart/> 
      <h1 id="title" class="text-xl sm:text-4xl font-bold text-center mx-2">Bible in one year with Kaye</h1>
      <BookHeart/>
    </div>
    

    <div id="calendar" class="flex align-items-center justify-content-center  mb-4">
      <Button 
        text
        class="calendar-nav text-sm sm:text-lg"
        @click="readingStore.previousDay"
      >
        <ChevronLeft class="w-10 h-10" />
        prev
      </Button>
      <div class="text-center mx-5 md:mx-8">
        <h2 class="text-lg sm:text-2xl mb-1 flex align-items-center justify-content-center">
          {{ formattedDate }}
        </h2>
        <Button 
          text 
          label="Today" 
          color="secondary"
          class="calendar-today text-sm sm:text-lg"
          @click="readingStore.setToday"
        />
      </div>
      <Button 
        text
        class="calendar-nav text-sm sm:text-lg"
        @click="readingStore.nextDay"
      >
        next
        <ChevronRight class="w-10 h-10" />
      </Button>
    </div>

    <div id="readings" class="grid w-full px-3" style="max-width: 800px">
      <div v-if="!readings" class="col-12 text-center">
        <Card class="h-full border-1 surface-border">
          <template #content>
            <div class="text-center">
              <h3 class="text-2xl mb-2">No Readings Today</h3>
              <p class="text-lg text-700">Today is Sunday. Take time to reflect on the week's readings.</p>
            </div>
          </template>
        </Card>
      </div>
      <div v-else v-for="(reading, index) in readingsWithUrls" :key="reading.book+reading.verses" class="col-12 md:col-6 p-2">
        <Card class="h-full shadow-2 surface-border relative overflow-hidden text-white card-content hover-effect">
          <template #header>
            <div class="flex align-items-center justify-content-center pt-3 surface-section relative z-1">
              <component 
                :is="getBookIcon(index)"
                class="h-6 text-primary mr-3" 
              />
              <span class="text-xl font-medium">{{ reading.book+" "+reading.verses }}</span>
            </div>
          </template>
          <template #content>
            <div class="relative pt-0 z-1">
              <p v-if="bibleApiStore.isLoading" class="text-sm mb-3">Loading verses...</p>
              <p v-else-if="bibleApiStore.error" class="text-sm mb-3 text-red-500">Error loading verses</p>
              <p v-else class="text-sm mb-2 text-gray-800">
                {{ getVersePreview(bibleApiStore.getCachedVerse(reading.book, reading.verses)?.text) }}
              </p>
              <div class="flex justify-content-end">
                <Button
                  size="small"
                  color="red"
                  @click="openInNewTab(reading.url)"
                  class="p-button-outlined transition-colors px-3 "
                >
                  Read
                </Button>
              </div>
            </div>
            <div 
              class="absolute top-0 left-0 w-full h-full" 
              :style="{ backgroundImage: `url(${getBackground(index)})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
            ></div>
          </template>
        </Card>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card-content {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.hover-effect:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

#calendar :deep(.calendar-nav) {
  color: var(--text-color-secondary);
  min-width: 2rem;
  padding: 0.5rem;
}

#calendar :deep(.calendar-nav:hover) {
  color: var(--text-color);
  background: transparent;
}

#calendar :deep(.calendar-today) {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
}

#calendar :deep(.calendar-today:hover) {
  background: transparent;
  text-decoration: underline;
}

:deep(.p-card-body) {
  padding-top: 10px;
}

:deep(.p-button-outlined) {
  color: white;
  border-color: white;
}

:deep(.p-button-outlined:hover) {
  color: black !important;
  border-color: white !important;
  background-color: white !important;
}
</style>
