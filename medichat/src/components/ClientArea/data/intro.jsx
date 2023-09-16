export default function intro({
  setMessages,
  findMedicine,
  findSD,
  message,
  session,
}) {
  console.log(session);
  var username = "";
  try {
    username = session.user.name;
    username = username.split(" ")[0];
  } catch {
    console.log("no username");
  }
  return {
    message:
      message ||
      (username
        ? `Hi ${username}!, how can I help you today?`
        : "Hey, welcome to MediBot! How can I help you today?"),
    options: [
      {
        name: "I need to find a medicine",
        action: (message) => {
          setMessages((mss) => [...mss, { message, byBot: false }]);
          findMedicine();
        },
      },
      {
        name: "I'm having trouble on my skin",
        action: (message) => {
          setMessages((mss) => [...mss, { message, byBot: false }]);
          findSD();
        },
      },
      {
        name: "I'm having a bad day",
        action: (message) => {
          setMessages((mss) => [...mss, { message, byBot: false }]);
          setMessages((mss) => [
            ...mss,
            { message: "No worries, let's see what's wrong?", byBot: true },
          ]);
        },
      },
      {
        name: "I need to find a doctor",
        action: (message) => {
          setMessages((mss) => [...mss, { message, byBot: false }]);
        },
      },
    ],
  };
}
