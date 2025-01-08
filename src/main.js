import './assets/main.css'
import 'primeflex/primeflex.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';

// Import PrimeVue components
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(ToastService);

// Register PrimeVue components
app.component('Toast', Toast);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('InputNumber', InputNumber);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('Checkbox', Checkbox);
app.component('RadioButton', RadioButton);
app.component('Button', Button);
app.component('Card', Card);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('Menu', Menu);

app.use(createPinia())
app.use(router)

app.mount('#app')
