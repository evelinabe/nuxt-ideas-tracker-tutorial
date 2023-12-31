# Tutorial: Idea Tracker with Nuxt and Appwrite

**Idea tracker**: an app to track all the side project ideas that you'll start, but probably never finish.
In this tutorial, you will build Idea tracker with Appwrite and Nuxt.

![Image of the finished project with navbar and list of items](https://github.com/evelinabe/nuxt-ideas-tracker-tutorial/blob/main/public/idea-tracker-1.png)

# Concepts

This tutorial will introduce the following concepts:

1. Setting up your first project
2. Authentication
3. Navigation
4. Databases and collections
5. Queries

# Prerequisites

1. Basic knowledge of JavaScript.
2. Have [Node.js](https://nodejs.org/en) and [NPM](https://www.npmjs.com/) installed
   on your computer.

# Step 1: Setting up your project

## Create a Nuxt app

Create a Nuxt app with the `npx init` command.

```sh
npx nuxi@latest init ideas-tracker
```

## Add dependencies

Install the JavaScript Appwrite SDK.

```sh
npm install appwrite
```

You can start the development server to watch your app update in the browser as you make changes.

```sh
npm run dev
```

## Pages and layout for routing

In Nuxt, directories help organize the codebase and minimize boilerplate. The purpose is
making it easy to find and manage different aspect of your application.

The files added to the `pages` directory will automatically become a route once a default page layout has been
added. After following these three steps, you will have a working app to verify your changes in the development server throughout the tutorial.

### 1. Add home page

Create file `src/pages/index.vue` and add the following code:

```vue
<template>
  <div>
    <h1>Hello, idea tracker!</h1>
  </div>
</template>
```

### 2. Add global layout

Add a file `src/layouts/default.vue` and insert the following code:

```vue
<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  layout: "default",
};
</script>
```

### 3. Edit app

Go to `app.vue`, remove `NuxtWelcome`and insert `NuxtPage` wrapped in `NuxtLayout`

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

### 4. ### 4. Import layout

Edit `nuxt.config.ts`to import Appwrite's design system to all pages and components.
The classes will be ready to use in the templates through auto-import.

```ts
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
});
```

## Import and configure Appwrite Cloud

Head to the [Appwrite Console](https://cloud.appwrite.io/console).

If this is your first time using Appwrite, create an account and create your first project.

Then, under **Add a platform**, add a **Web app**. The **Hostname** should be localhost.

You can skip optional steps.

# Initialize Appwrite SDK

To use Appwrite in our Nuxt app, we'll need to find our project ID. Find your project's ID in the **Settings** page.

Create a new file `src/appwrite.js` to hold our Appwrite related code.
Only one instance of the `Client()` class should be created per app.
Add the following code to it, replacing `<YOUR_PROJECT_ID>` with your project ID.

```js
import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("<YOUR_PROJECT_ID>"); // Replace with your project ID

export const account = new Account(client);
export const database = new Databases(client);
```

# Step 2: Authentication

## Nuxt composables

Composables is a pattern in Nuxt to manage logic related to data fetching and global state management.
Create a file `src/composables/useUserSession.js` in your composables directory. Add the following code:

```js
import { ID } from "appwrite";
import { ref } from "vue";
import { account } from "/appwrite";

const current = ref(null);
const isLoggedIn = ref(null);

export const useUserSession = () => {
  const register = async (email, password) => {
    await account.create(ID.unique(), email, password);
    await this.login(email, password);
  };

  const login = async (email, password) => {
    const authUser = await account.createEmailSession(email, password);
    current.value = authUser;
    isLoggedIn.value = true;
    navigateTo("/ideas");
  };

  const logout = async () => {
    await account.deleteSession("current");
    current.value = null;
    isLoggedIn.value = false;
    navigateTo("/");
  };
  return {
    current,
    isLoggedIn,
    login,
    logout,
    register,
  };
};
```

Now, we can import the `useUserSession` composable in any page or component and use it to login, logout, register a user or keep track of the current user.

## Login page

We will start with building a login page to handle the user sessions.

Create a new file `src/pages/index.vue` and add the following code.

```vue
<template>
  <div class="card u-margin-32">
    <h2 class="eyebrow-heading-2">Login/Register</h2>
    <form
      class="form u-width-full-line u-max-width-500 u-margin-block-start-16"
      @submit.prevent="handleLogin || handleRegistration"
    >
      <ul class="form-list">
        <li class="form-item">
          <label class="label">Email</label>
          <div class="input-text-wrapper">
            <input
              v-model="userData.email"
              type="email"
              class="input-text"
              placeholder="Email"
              required
            />
          </div>
        </li>
        <li class="form-item">
          <label class="label">Password</label>
          <div class="input-text-wrapper">
            <input
              v-model="userData.password"
              type="password"
              class="input-text"
              placeholder="Password"
              required
            />
          </div>
        </li>
      </ul>
      <ul class="buttons-list u-margin-block-start-16">
        <li class="buttons-list-item">
          <button
            class="button is-small u-margin-inline-start-4"
            aria-label="Login"
            @click="handleLogin"
          >
            Login
          </button>
        </li>
        <li class="buttons-list-item">
          <button
            class="button is-small is-secondary u-margin-inline-start-4"
            aria-label="Register account"
            @click="handleRegistration"
          >
            Register
          </button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script>
export default {
  setup() {
    const user = useUserSession();

    const userData = {
      email: "",
      password: "",
    };

    const handleLogin = async () => {
      await user.login(userData.email, userData.password);
    };

    const handleRegistration = async () => {
      await user.register(userData.email, userData.password);
    };

    return {
      handleLogin,
      handleRegistration,
      userData,
    };
  },
};
</script>
```

## User section on home page

Finally, we will can modify the `src/pages/index.vue` to show a section for logged in users only:

```vue
<template>
  <div>
    <section v-if="user.isLoggedIn.value === true">
      <h2>Submit Idea</h2>
    </section>
    <section>
      <h2>Hello, idea tracker!</h2>
    </section>
  </div>
</template>

<script>
export default {
  setup() {
    const user = useUserSession();

    return {
      user,
    };
  },
};
</script>
```

# Step 3: Navigation

In our app we want to show a navigation bar. We will add it to the `app.vue` component and use the `useUserSession` composable to show either:

- a logout button if the user is logged in
- or a login button if the user is not logged in

Update the `app.vue` file:

```vue
<template>
  <div>
    <NuxtLayout>
      <nav class="main-header u-padding-inline-end-0">
        <h3 class="u-stretch eyebrow-heading-1">Idea Tracker</h3>
        <div
          class="main-header-end u-margin-inline-end-16"
          v-if="user.isLoggedIn.value === true"
        >
          <p>
            {{ user.current.value.providerUid }}
          </p>
          <button class="button" type="button" @click="user.logout()">
            Logout
          </button>
        </div>
        <NuxtLink v-else href="/login" class="button u-margin-inline-end-16"
          >Login</NuxtLink
        >
      </nav>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script>
export default {
  setup() {
    const user = useUserSession();

    return {
      user,
    };
  },
};
</script>
```

# Step 4: Databases and collections

## Create collection

In Appwrite, data is stored as a collection of documents. Create a collection in the [Appwrite Console](https://cloud.appwrite.io/) to store our ideas.

Create a new collection with the following attributes:
| Field | Type | Required |
|-------------|--------|----------|
| userId | String | Yes |
| title | String | Yes |
| description | String | No |

Change the collection's permissions settings to give any role access to it.

## Query methods

Now that you have a collection to hold ideas, we can read and write to it from our app.
Create a new file in the composables directory, `src/composables/useIdeas.js` and add the following code to it.

```js
import { ID, Query } from "appwrite";
import { database } from "~/appwrite";
import { ref } from "vue";

const IDEAS_DATABASE_ID = "YOUR_DATABASE_ID";
const IDEAS_COLLECTION_ID = "YOUR_COLLECTION_ID";

const current = ref(null);

export const useIdeas = () => {
  const init = async () => {
    const response = await database.listDocuments(
      IDEAS_DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    current.value = response.documents;
  };
  const add = async (idea) => {
    const response = await database.createDocument(
      IDEAS_DATABASE_ID,
      IDEAS_COLLECTION_ID,
      ID.unique(),
      idea
    );
    current.value = [response, ...current.value].slice(0, 10);
  };

  const remove = async (id) => {
    await database.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
    current.value = current.value.filter((idea) => idea.$id !== id);
    await init(); // Refetch ideas to ensure we have 10 items
  };

  return {
    add,
    current,
    init,
    remove,
  };
};
```

# Step 5: Queries

Using the `useIdeas` composable we can now display the ideas on the page and add a form to submit new ideas.

Overwrite the contents of `src/pages/index.vue` with the following:

```vue
<template>
  <div class="u-max-width-650" style="margin: 0 auto">
    <section v-if="user.isLoggedIn.value === true" class="card u-margin-32">
      <article class="container padding-0">
        <h4 class="heading-level-4">Submit Idea</h4>
        <form @submit.prevent="handleAddIdea" class="u-margin-block-start-16">
          <ul class="form-list">
            <li class="form-item">
              <label class="label">Title</label>
              <input
                type="text"
                placeholder="Title"
                v-model="addIdeaData.title.value"
              />
            </li>
            <li class="form-item">
              <label class="label">Email</label>
              <textarea
                placeholder="Description"
                v-model="addIdeaData.description.value"
              />
            </li>
            <button class="button" aria-label="Submit idea" type="submit">
              Submit
            </button>
          </ul>
        </form>
      </article>
    </section>
    <section v-else class="card u-margin-32">
      <div class="container">
        <p class="body-text-1" style="width: 100%">
          Please login to submit an idea.
        </p>
      </div>
    </section>

    <section class="u-margin-32">
      <article class="card">
        <h4 class="heading-level-4">Latest Ideas</h4>
        <ul class="u-margin-block-start-8">
          <li v-for="idea in ideas.current.value">
            <div class="box">
              <h5 class="heading-level-6">{{ idea.title }}</h5>
              <p class="body-text-2">{{ idea.description }}</p>
              <div
                class="u-position-absolute u-inset-inline-end-8 u-inset-block-start-8"
              >
                <button
                  class="button is-small is-text is-only-icon"
                  aria-label="Remove item"
                  v-if="
                    user.current.value &&
                    idea.userId === user.current.value.userId
                  "
                  type="button"
                  @click="handleRemoveIdea(idea.$id)"
                >
                  <span class="icon-document-remove" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  setup() {
    const ideas = useIdeas();
    const user = useUserSession();

    onMounted(() => {
      ideas.init();
    });

    const addIdeaData = {
      userId: user.current.value !== null ? user.current.value.userId : "",
      title: ref(""),
      description: ref(""),
    };

    const handleAddIdea = async () => {
      if (!addIdeaData.title.length) return;
      else {
        await ideas.add(addIdeaData);
        addIdeaData.title.value = "";
        addIdeaData.description.value = "";
      }
    };

    const handleRemoveIdea = async (id) => {
      await ideas.remove(id);
    };

    return {
      addIdeaData,
      handleAddIdea,
      handleRemoveIdea,
      ideas,
      user,
    };
  },
};
</script>

<style>
article.box {
  background-color: hsl(var(--color-neutral-0));
}
</style>
```

The first section will now show a form for adding ideas if the user is logged in. The main section shows the 10 newest ideas from the Appwrite database.

# Test your project

Run your project with `npm run dev -- --open --port 3000` and open [http://localhost:3000](http://localhost:3000) in your browser.
Head to the [Appwrite Console](https://cloud.appwrite.io/console) to see the new users and follow their interactions.

# Add layout

The layout can be modified to your preferences. Go to the [Nuxt official documentation](https://nuxt.com/docs/getting-started/styling#third-party-libraries-and-modules) if you want to know more.
