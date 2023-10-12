import { ID } from "appwrite";
import { ref } from "vue";
import { account } from "/appwrite";

const current = ref(null);
const isLoggedIn = ref(null);

export const useUserSession = () => {
  const register = async (email, password) => {
    await account.create(ID.unique(), email, password);
    await login(email, password);
  };

  const login = async (email, password) => {
    const authUser = await account.createEmailSession(email, password);
    current.value = authUser;
    isLoggedIn.value = true;
    navigateTo("/");
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
