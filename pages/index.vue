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
