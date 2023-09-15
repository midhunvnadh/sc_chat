export default function intro({ setMessages, findMedicine, message }) {
  return {
    message: message || "Hey, welcome to MediBot! How can I help you today?",
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
