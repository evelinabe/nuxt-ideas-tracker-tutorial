<template>
  <div>
    <nav class="main-header u-padding-inline-end-16">
      <h3 class="u-stretch eyebrow-heading-1">Idea Tracker</h3>
      <div class="main-header-end">
        <ul class="main-header-end buttons-list">
          <li class="buttons-list-item">
            <div class="tabs" v-bind:on-select="tabs">
              <ul class="tabs-list">
                <li
                  class="tabs-item margin-top-4"
                  v-for="(tab, index) in tabs"
                  :key="tab.id"
                  @click="handleTabClick(index)"
                >
                  <NuxtLink
                    :to="tab.link"
                    class="tabs-button"
                    :class="{ 'is-selected': isSelected === index }"
                  >
                    {{ tab.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
          <li v-if="user.isLoggedIn.value === true" class="buttons-list-item">
            <div class="main-header-end u-padding-16">
              <p>
                {{ user.current.value.providerUid }}
              </p>
              <button class="button" type="button" @click="user.logout()">
                Logout
              </button>
            </div>
          </li>
          <li v-else>
            <NuxtLink
              to="/login"
              class="button u-margin-block-start-2"
              @click="handleTabClick(null)"
              >Login</NuxtLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    setup() {
      const user = useUserSession();
      const isSelected = ref(0);

      const handleTabClick = (index) => {
        isSelected.value = index;
      };
      const tabs = [
        { id: 1, label: "Home", link: "/" },
        { id: 2, label: "Tutorial", link: "/tutorial" },
      ];

      return {
        isSelected,
        tabs,
        handleTabClick,
        user,
      };
    },
    methods: {
      handleTabClick(index) {
        this.isSelected = index;
      },
    },
  };
</script>

<style>
  .margin-top-4 {
    margin-top: 0.25rem !important;
  }
</style>
