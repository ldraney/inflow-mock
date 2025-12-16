import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  // Point directly to the inflow-get schema in node_modules
  schema: './node_modules/inflow-get/dist/db/schema.js',
  out: './drizzle',
  dbCredentials: {
    url: './data/mock.db',
  },
})
