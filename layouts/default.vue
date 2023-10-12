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
