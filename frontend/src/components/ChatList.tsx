import { Chat } from "../types/types";

interface Props {
  chats: Chat[];
  selectChat: (chat: Chat) => void;
}

export default function ChatList({ chats, selectChat }: Props) {
  if (chats.length === 0) return <p className="empty-chats">No chats yet</p>;

  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <li
          key={chat._id}
          className="chat-item"
          onClick={() => selectChat(chat)}
        >
          <div className="chat-avatar">
            {chat.users[0].email[0].toUpperCase()}
          </div>

          <div className="chat-info">
            <span className="chat-name">
              {chat.users.map((u) => u.email).join(", ")}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
