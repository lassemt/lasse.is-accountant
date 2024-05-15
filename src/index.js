import { mount } from 'svelte';
import './index.scss';
import App from './App.svelte';

const app = mount(App, { target: document.body });

export default app;
