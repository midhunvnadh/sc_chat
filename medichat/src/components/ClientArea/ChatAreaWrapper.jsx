import dynamic from "next/dynamic";

const ChatScreen = dynamic(() => import("./ChatScreen"), {
  ssr: false,
});

export default function ChatAreaWrapper({ session }) {
  return (
    <div>
      <ChatScreen session={session} />
    </div>
  );
}
