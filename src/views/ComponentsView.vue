<template>
  <div class="components-container">
    <h1 class="text-4xl font-bold mb-6 text-center">PrimeVue Components</h1>
    
    <div class="grid p-2">
      <!-- Form Components -->
      <div class="col-12 md:col-6 mb-4 p-2">
        <Card class="h-full">
          <template #title>
            <div class="text-xl mb-4">Form Components</div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="field">
                <label class="block mb-2">Input Text</label>
                <InputText v-model="text" placeholder="InputText" class="w-full" />
              </div>
              <div class="field">
                <label class="block mb-2">Password</label>
                <Password v-model="password" placeholder="Password" toggleMask class="w-full" />
              </div>
              <div class="field">
                <label class="block mb-2">Input Number</label>
                <InputNumber v-model="number" placeholder="InputNumber" class="w-full" />
              </div>
              <div class="field">
                <label class="block mb-2">Dropdown</label>
                <Dropdown v-model="selectedItem" :options="dropdownItems" optionLabel="name" placeholder="Select an item" class="w-full" />
              </div>
              <div class="field">
                <label class="block mb-2">Calendar</label>
                <Calendar v-model="date" placeholder="Calendar" class="w-full" />
              </div>
              <div class="field-checkbox">
                <Checkbox v-model="checked" :binary="true" />
                <label class="ml-2">Checkbox</label>
              </div>
              <div class="field-radiobutton">
                <RadioButton v-model="radioValue" value="option1" />
                <label class="ml-2">Radio Button</label>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Button Components -->
      <div class="col-12 md:col-6 mb-4 p-2">
        <Card class="h-full">
          <template #title>
            <div class="text-xl mb-4">Button Components</div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <Button label="Primary" class="w-full" />
              <Button label="Secondary" severity="secondary" class="w-full" />
              <Button label="Success" severity="success" class="w-full" />
              <Button label="Info" severity="info" class="w-full" />
              <Button label="Warning" severity="warning" class="w-full" />
              <Button label="Help" severity="help" class="w-full" />
              <Button label="Danger" severity="danger" class="w-full" />
            </div>
          </template>
        </Card>
      </div>

      <!-- Data Components -->
      <div class="col-12 md:col-6 mb-4 p-2">
        <Card class="h-full">
          <template #title>
            <div class="text-xl mb-4">Data Components</div>
          </template>
          <template #content>
            <DataTable :value="tableData" :rows="3" responsiveLayout="scroll" class="mb-4">
              <Column field="id" header="ID"></Column>
              <Column field="name" header="Name"></Column>
              <Column field="value" header="Value"></Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- Overlay Components -->
      <div class="col-12 md:col-6 mb-4 p-2">
        <Card class="h-full">
          <template #title>
            <div class="text-xl mb-4">Overlay Components</div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <Button label="Show Dialog" @click="showDialog" class="w-full" />
              <Dialog v-model:visible="dialogVisible" modal header="Dialog">
                <p class="m-0">This is a dialog content</p>
              </Dialog>

              <Button label="Show Toast" @click="showToast" class="w-full" />
            </div>
          </template>
        </Card>
      </div>

      <!-- Menu Components -->
      <div class="col-12 md:col-6 mb-4 p-2">
        <Card class="h-full">
          <template #title>
            <div class="text-xl mb-4">Menu Components</div>
          </template>
          <template #content>
            <Menu :model="menuItems" class="w-full" />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// Form Components data
const text = ref('');
const password = ref('');
const number = ref(null);
const selectedItem = ref(null);
const date = ref(null);
const checked = ref(false);
const radioValue = ref(null);

// Dropdown items
const dropdownItems = ref([
  { name: 'Option 1', code: 'opt1' },
  { name: 'Option 2', code: 'opt2' },
  { name: 'Option 3', code: 'opt3' }
]);

// Table data
const tableData = ref([
  { id: 1, name: 'Item 1', value: 100 },
  { id: 2, name: 'Item 2', value: 200 },
  { id: 3, name: 'Item 3', value: 300 }
]);

// Dialog
const dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
};

// Toast
const showToast = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Toast Message', life: 3000 });
};

// Menu items
const menuItems = ref([
  {
    label: 'Options',
    items: [
      { label: 'Option 1', icon: 'pi pi-refresh' },
      { label: 'Option 2', icon: 'pi pi-times' }
    ]
  }
]);
</script>

<style scoped>
.components-container {
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
}

:deep(.p-card) {
  height: 100%;
}

:deep(.p-card-content) {
  padding-top: 0;
}

.field {
  margin-bottom: 1rem;
}

.field-checkbox,
.field-radiobutton {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-menu) {
  width: 100%;
  border: none;
}
</style>
