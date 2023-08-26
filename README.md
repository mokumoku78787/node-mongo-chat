# node-mongo-chat

This is a simple node.js API for a chat application using the ChatGPT API as the chat engine and mongodb as the database.

# List of APIs 
| Route                   | Method | Description                                     | Request Headers                 | Request Body                     | Response Status    | Response Body                         |
|-------------------------|--------|-------------------------------------------------|---------------------------------|-----------------------------------|--------------------|---------------------------------------|
| `/signup`               | POST   | Create a new user account.                     | N/A                             | `{ "name": "", "password": "" }` | 201 Created        | `{ "message": "User created" }`        |
| `/signin`               | POST   | Authenticate a user and get a token.           | N/A                             | `{ "name": "", "password": "" }` | 200 OK             | `{ "message": "Authentication successful", "token": "" }` |
| `/ping`                 | GET    | Check if the server is running.                | N/A                             | N/A                             | 200 OK             | `{ "message": "ok" }`                  |                |
| `/chats`                | POST   | Create a new chat conversation.                | `Authorization: Bearer <token>` | `{ "content": "" }`             | 200 OK             | Chat conversation JSON                |
| `/chats/:chatId`        | POST   | Add a message to an existing chat.             | `Authorization: Bearer <token>` | `{ "content": "" }`             | 200 OK             | Updated chat JSON                     |
| `/chats`                | GET    | Get summaries of all user's chat conversations.| `Authorization: Bearer <token>` | N/A                             | 200 OK             | Array of chat summaries               |
| `/chats/:chatId`        | GET    | Get messages of a specific chat.               | `Authorization: Bearer <token>` | N/A                             | 200 OK             | Array of messages                    |
| `/chats/:chatId`        | DELETE | Delete a specific chat conversation.           | `Authorization: Bearer <token>` | N/A                             | 200 OK             | `{ "message": "Chat deleted" }`        |
| `/chats`                | DELETE | Delete all user's chat conversations.          | `Authorization: Bearer <token>` | N/A                             | 200 OK             | `{ "message": "All chats deleted" }`    |
