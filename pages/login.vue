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
