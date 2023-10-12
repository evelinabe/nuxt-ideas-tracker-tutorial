import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65198e38aaad898efbb6");

export const account = new Account(client);
export const database = new Databases(client);
