<template>
  <div>
    <section v-if="user.isLoggedIn.value === true" class="u-margin-32">
      <article class="box">
        <h4 class="heading-level-4">Submit Idea</h4>

        <form>
          <input type="text" placeholder="Title" v-model="addIdeaData.title" />
          <textarea
            placeholder="Description"
            v-model="addIdeaData.description"
          ></textarea>
          <button
            class="button"
            aria-label="Submit idea"
            type="button"
            @click="handleAddIdea"
          >
            Submit
          </button>
        </form>
      </article>
    </section>
    <section v-else><p>Please login to submit an idea.</p></section>

    <section class="u-margin-32">
      <article class="card">
        <h4 class="heading-level-4">Latest Ideas</h4>
        <ul>
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

<style>
article.box {
  background-color: hsl(var(--color-neutral-0));
}
</style>
