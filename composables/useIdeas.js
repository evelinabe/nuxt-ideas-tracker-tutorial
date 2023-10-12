import { ID, Query } from "appwrite";
import { database } from "~/appwrite";
import { ref } from "vue";

const IDEAS_DATABASE_ID = "REPLACE_WITH_DATABASE_ID"; //Replace with your databaseId
const IDEAS_COLLECTION_ID = "REPACE_WITH_COLLECTION_ID"; //Replace with collectionId

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
