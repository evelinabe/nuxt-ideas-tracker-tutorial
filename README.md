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

<style>
body {
  margin: 1rem auto;
  max-width: 50rem;
  background-color: #f4f5f7;
}

button {
  width: fit-content;
  border: none;
  border-radius: 3px;
  padding: 0.25rem 0.5rem;
  margin-right: 0.25rem;
  background-color: #e3356d;
  color: #fff;
  text-decoration: none;
}

.link-btn {
  padding: 0.75rem 1rem;
  border-radius: 3px;
  background-color: #e3356d;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
}

form {
  max-width: 400px;
  padding: 1.5rem;
  display: grid;
  gap: 0.25rem;
}

h1 {
  padding: 0.75rem;
}

section {
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #e6e8eb;
}
</style>
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
  <div>
    <h2>Login/Register</h2>
    <form @submit.prevent="handleLogin || handleRegistration">
      <input
        v-model="userData.email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="userData.password"
        type="password"
        placeholder="Password"
        required
      />
      <div>
        <button @click="handleLogin">Login</button>
        <button @click="handleRegistration">Register</button>
      </div>
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

This is how it will look like:
![Image of the login page with inputs for email and password and buttons for registrering and login](https://github.com/evelinabe/nuxt-ideas-tracker-tutorial/blob/main/public/idea-tracker-3.png)

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
      <nav>
        <h3>Idea Tracker</h3>
        <div>
          <div v-if="user.isLoggedIn.value === true">
            <span>{{ user.current.value.providerUid }}</span>
            <button class="link-btn" type="button" @click="user.logout()">
              Logout
            </button>
          </div>
          <NuxtLink v-else href="/login" class="link-btn">Login</NuxtLink>
        </div>
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

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;
}
h3 {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Open Sans",
    "Helvetica Neue", sans-serif;
  font-weight: 400;
}
span {
  margin-right: 0.25rem;
}
</style>
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
  <div>
    <section v-if="user.isLoggedIn.value === true">
      <h2>Submit Idea</h2>

      <form>
        <input type="text" placeholder="Title" v-model="addIdeaData.title" />
        <textarea
          placeholder="Description"
          v-model="addIdeaData.description"
        ></textarea>
        <button type="button" @click="handleAddIdea">Submit</button>
      </form>
    </section>
    <section v-else><p>Please login to submit an idea.</p></section>

    <section>
      <h2>Latest Ideas</h2>
      <ul>
        <li v-for="idea in ideas.current.value">
          <article>
            <strong>{{ idea.title }}</strong>
            <p>{{ idea.description }}</p>
            <button
              v-if="
                user.current.value && idea.userId === user.current.value.userId
              "
              type="button"
              @click="handleRemoveIdea(idea.$id)"
            >
              Remove
            </button>
          </article>
        </li>
      </ul>
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
      title: "",
      description: "",
    };

    const handleAddIdea = async () => {
      await ideas.add(addIdeaData);
      addIdeaData.title = "";
      addIdeaData.description = "";
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

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

h2 {
  padding-left: 1.5rem;
}

article {
  display: flex;
  flex-direction: column;
  margin: 0 0.75rem;
}

li {
  margin: 0 1.75rem;
  border-radius: 0.1rem;
  background-color: #f4f5f7;
  border: 1px solid #e6e8eb;
  padding: 1rem;
}
</style>
```

The first section will now show a form for adding ideas if the user is logged in. The main section shows the 10 newest ideas from the Appwrite database.

![Image of the page with form to submit new idea, list of ideas, and button for logged in user to remove items](https://github.com/evelinabe/nuxt-ideas-tracker-tutorial/blob/main/public/idea-tracker-5.png)

# Test your project

Run your project with `npm run dev -- --open --port 3000` and open [http://localhost:3000](http://localhost:3000) in your browser.
Head to the [Appwrite Console](https://cloud.appwrite.io/console) to see the new users and follow their interactions.

# Add layout

The layout can be modified to your preferences. Go to the [Nuxt official documentation](https://nuxt.com/docs/getting-started/styling#third-party-libraries-and-modules) if you want to know more.
