import { Chat } from "../types/types";

interface Props {
  chats: Chat[];
  selectChat: (chat: Chat) => void;
}

export default function ChatList({ chats, selectChat }: Props) {
  if (chats.length === 0) return <p>No chats yet</p>;

  return (
    <ul>
      {chats.map((chat) => (
        <li
          key={chat._id}
          onClick={() => selectChat(chat)}
          style={{ cursor: "pointer", margin: "5px 0" }}
        >
          {chat.users.map((u) => u.email).join(", ")}
        </li>
      ))}
    </ul>
  );
}
