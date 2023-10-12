import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("ADD_YOUR_PROJECT");

export const account = new Account(client);
export const database = new Databases(client);
