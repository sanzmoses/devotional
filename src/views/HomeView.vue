<script setup>
import { ChevronLeft, ChevronRight, Calendar, Book, BookOpen, Bookmark, BookMarked } from 'lucide-vue-next';
import { useReadingStore } from '../stores/reading';
import { computed } from 'vue';

const readingStore = useReadingStore();

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

const getReadingByBook = (book) => {
  if (!readings.value) return null;
  return readings.value.find(r => r.book === book);
};
</script>

<template>
  <main class="flex flex-column align-items-center justify-content-center h-screen min-h-[500px]">
    <h1 id="title" class="text-4xl font-bold mb-6 text-center">Bible in one year with Kaye</h1>

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

    <div v-if="readings" id="readings" class="grid w-full px-3" style="max-width: 800px">
      <div class="col-12 md:col-6 p-2">
        <Card class="h-full">
          <template #header>
            <div class="flex align-items-center gap-2 p-3 surface-section">
              <Book class="w-6 h-6 text-primary" />
              <span class="text-xl font-medium">Genesis</span>
            </div>
          </template>
          <template #content>
            <p v-if="getReadingByBook('Genesis')" class="m-0 text-lg">
              {{ getReadingByBook('Genesis').verses }}
            </p>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 p-2">
        <Card class="h-full">
          <template #header>
            <div class="flex align-items-center gap-2 p-3 surface-section">
              <BookOpen class="w-6 h-6 text-primary" />
              <span class="text-xl font-medium">Matthew</span>
            </div>
          </template>
          <template #content>
            <p v-if="getReadingByBook('Matthew')" class="m-0 text-lg">
              {{ getReadingByBook('Matthew').verses }}
            </p>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 p-2">
        <Card class="h-full">
          <template #header>
            <div class="flex align-items-center gap-2 p-3 surface-section">
              <Bookmark class="w-6 h-6 text-primary" />
              <span class="text-xl font-medium">Psalms</span>
            </div>
          </template>
          <template #content>
            <p v-if="getReadingByBook('Psalms')" class="m-0 text-lg">
              {{ getReadingByBook('Psalms').verses }}
            </p>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 p-2">
        <Card class="h-full">
          <template #header>
            <div class="flex align-items-center gap-2 p-3 surface-section">
              <BookMarked class="w-6 h-6 text-primary" />
              <span class="text-xl font-medium">Acts</span>
            </div>
          </template>
          <template #content>
            <p v-if="getReadingByBook('Acts')" class="m-0 text-lg">
              {{ getReadingByBook('Acts').verses }}
            </p>
          </template>
        </Card>
      </div>
    </div>

    <div v-else class="text-center mt-4">
      <h3 class="text-2xl mb-2">No Readings Today</h3>
      <p class="text-lg text-700">Today is Sunday - Take time to reflect on the week's readings.</p>
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
</style>
