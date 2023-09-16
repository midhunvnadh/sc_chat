import dynamic from "next/dynamic";

const ChatScreen = dynamic(() => import("./ChatScreen"), {
  ssr: false,
});
export default function ChatAreaWrapper() {
  return (
    <div>
      <ChatScreen />
    </div>
  );
}
