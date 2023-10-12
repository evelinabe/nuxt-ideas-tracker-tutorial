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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 400;
}
span {
  margin-right: 0.25rem;
}
</style>
