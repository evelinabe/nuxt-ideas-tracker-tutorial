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
