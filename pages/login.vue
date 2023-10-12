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
