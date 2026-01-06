import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.REACT_APP_BURGER_API_UR,
    setupNodeEvents() {}
  }
});
