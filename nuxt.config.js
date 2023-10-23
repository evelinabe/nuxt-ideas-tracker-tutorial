// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: "stylesheet", href: "https://unpkg.com/@appwrite.io/pink" },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/@appwrite.io/pink-icons",
        },
      ],
    },
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/content'
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: 'github-dark'
    },
    markdown: {
      rehypePlugins: [
        ['rehype-class-names', { 'h1': 'heading-level-4', 'line': 'grid-code-line-number' }],
      ],
    }
  },
  runtimeConfig: {
    public: {
      databaseId: process.env.NUXT_IDEAS_DATABASE_ID,
      databaseCollectionId: process.env.NUXT_IDEAS_COLLECTION_ID,
    },
  },
});
