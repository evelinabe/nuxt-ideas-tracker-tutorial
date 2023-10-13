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
  runtimeConfig: {
    public: {
      databaseId: process.env.NUXT_IDEAS_DATABASE_ID,
      databaseCollectionId: process.env.NUXT_IDEAS_COLLECTION_ID,
    },
  },
});
