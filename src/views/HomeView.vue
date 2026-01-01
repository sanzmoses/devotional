<script setup>
import { computed, watch } from 'vue';
import { useReadingStore } from '../stores/reading';
import { useBibleGatewayStore } from '../stores/biblegateway';
import { useBibleApiStore } from '../stores/bibleapi';
import ReadingSidebar from '../components/ReadingSidebar.vue';
import ReadingColumn from '../components/ReadingColumn.vue';

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
  <main class="plans-layout">
    <ReadingSidebar
      :formatted-date="formattedDate"
      @previous-day="readingStore.previousDay"
      @next-day="readingStore.nextDay"
      @set-today="readingStore.setToday"
    />

    <div v-if="!readings" class="readings-container">
      <ReadingColumn
        :reading="null"
        :index="0"
        class="no-reading-column"
      />
    </div>
    <div v-else class="readings-container">
      <ReadingColumn
        v-for="(reading, index) in readingsWithUrls"
        :key="reading.book + reading.verses"
        :reading="reading"
        :index="index"
        :is-loading="bibleApiStore.isLoading"
        :has-error="!!bibleApiStore.error"
        :verse-text="bibleApiStore.getCachedVerse(reading.book, reading.verses)?.text || ''"
        @open-link="openInNewTab"
      />
    </div>
  </main>
</template>

<style scoped>
.plans-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.readings-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  width: 100%;
}

.no-reading-column {
  background: linear-gradient(180deg, #95a5a6 0%, #7f8c8d 100%);
}

@media (max-width: 1024px) {
  .plans-layout {
    flex-direction: column;
  }

  .readings-container {
    flex-direction: row;
  }
}
</style>
