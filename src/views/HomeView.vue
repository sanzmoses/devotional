<script setup>
import { ChevronLeft, ChevronRight, Calendar, Book, BookOpen, Bookmark, BookMarked } from 'lucide-vue-next';
import { useReadingStore } from '../stores/reading';
import { useBibleGatewayStore } from '../stores/biblegateway';
import { useBibleApiStore } from '../stores/bibleapi';
import { computed, watch } from 'vue';

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
const getBookIcon = (index) => bookIcons[index % bookIcons.length];

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
  <main class="flex flex-column align-items-center justify-content-center h-screen min-h-[500px]">
    <h1 id="title" class="text-4xl font-bold mb-4 text-center">Bible in one year with Kaye</h1>

    <div id="calendar" class="flex align-items-center justify-content-center mb-4">
      <Button 
        text
        class="calendar-nav"
        @click="readingStore.previousDay"
      >
        <ChevronLeft class="w-10 h-10" />
        previous
      </Button>
      <div class="text-center mx-8">
        <h2 class="text-xl mb-2 flex align-items-center justify-content-center">
          {{ formattedDate }}
        </h2>
        <Button 
          label="Today" 
          text 
          class="p-button-secondary calendar-today"
          @click="readingStore.setToday"
        />
      </div>
      <Button 
        text
        class="calendar-nav"
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
      <div v-else v-for="(reading, index) in readingsWithUrls" :key="reading.book" class="col-12 md:col-6 p-2">
        <Card class="h-full border-1 surface-border">
          <template #header>
            <div class="flex align-items-center justify-content-center pt-3 surface-section">
              <component 
                :is="getBookIcon(index)"
                class="h-6 text-primary mr-3" 
              />
              <span class="text-xl font-medium">{{ reading.book+" "+reading.verses }}</span>
            </div>
          </template>
          <template #content>
            <div class="relative pt-0">
              <p v-if="bibleApiStore.isLoading" class="text-sm mb-3">Loading verses...</p>
              <p v-else-if="bibleApiStore.error" class="text-sm mb-3 text-red-500">Error loading verses</p>
              <p v-else class="text-sm mb-2">
                {{ getVersePreview(bibleApiStore.getCachedVerse(reading.book, reading.verses)?.text) }}
              </p>
              <div class="flex justify-content-end">
                <Button
                  size="small"
                  @click="openInNewTab(reading.url)"
                  class="p-button-outlined border-1 surface-border hover:surface-200 transition-colors text-900 px-3"
                >
                  Read
                </Button>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </main>
</template>

<style scoped>
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
</style>
