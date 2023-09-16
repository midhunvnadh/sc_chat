import ChatAreaWrapper from "@/components/ClientArea/ChatAreaWrapper";

function LoginWrapper({ children }) {
  return <div>{children}</div>;
}

export default function Main() {
  return (
    <header>
      <h1>Chat App</h1>
      <LoginWrapper>
        <ChatAreaWrapper />
      </LoginWrapper>
    </header>
  );
}
