import { Avatar, Button } from "@material-tailwind/react";
import axios from "axios";

async function bookAppointment({ setMessages, d_name, email, intro, mode }) {
  const { data } = await axios.get(
    `/api/doctor/${email}/create_appointment?mode=${mode}`
  );
  const { success } = data;
  if (success) {
    setMessages((mss) => [
      ...mss,
      {
        message: "Your appointment has been booked!",
        byBot: true,
      },
      {
        message: "Check the appointments menu to see your appointment details.",
        byBot: true,
      },
      intro(),
    ]);
  } else {
    setMessages((mss) => [
      ...mss,
      {
        message:
          "Sorry, we couldn't book your appointment. Please try again later.",
        byBot: true,
      },
    ]);
  }
}

export default function intro({
  setMessages,
  findMedicine,
  findSD,
  message,
  session,
}) {
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
            {
              message:
                "We don't have any therapists online now to connect to you..",
              byBot: true,
            },
            {
              message:
                "Do you mind booking a direct appointment for the time being?",
              byBot: true,
            },
            intro({
              setMessages,
              findMedicine,
              findSD,
              message: "Anything more?",
            }),
          ]);
        },
      },
      {
        name: "I need to find a doctor",
        action: (message) => {
          setMessages((mss) => [...mss, { message, byBot: false }]);
          axios.get("/api/specializations").then(({ data }) => {
            const { specs } = data;
            setMessages((mss) => [
              ...mss,
              {
                message: "What kind of doctor are you looking for?",
                byBot: true,
                options: specs.map((a) => {
                  return {
                    name: a,
                    action: () => {
                      setMessages((mss) => [
                        ...mss,
                        {
                          message: a,
                          byBot: false,
                        },
                      ]);
                      axios.get(`/api/doctors?spec=${a}`).then(({ data }) => {
                        const { doctors } = data;
                        setMessages((mss) => [
                          ...mss,
                          {
                            message:
                              "Here are some doctors that might help you.",
                            byBot: true,
                          },
                          ...doctors.map(({ d_name, email }) => {
                            return {
                              message: (
                                <div className="font-sans flex items-center flex-col">
                                  <div>
                                    <div className="text-green-600 font-sans flex items-center justify-left">
                                      <Avatar src="/logo.jpg" />
                                      <div className="font-sans p-3">
                                        {d_name}
                                      </div>
                                    </div>
                                    <div className="text-green-600 font-sans py-3">
                                      {a}
                                    </div>
                                  </div>
                                  <div className="w-full bka-btn">
                                    <Button
                                      color="blue"
                                      fullWidth
                                      onClick={() => {
                                        setMessages((mss) => [
                                          ...mss,
                                          {
                                            message: "Book Appointment",
                                            byBot: false,
                                          },
                                          {
                                            message:
                                              "Would you like an online meeting or a direct appointment?",
                                            byBot: true,
                                            options: [
                                              {
                                                name: "Online Meeting",
                                                action: () => {
                                                  setMessages((mss) => [
                                                    ...mss,
                                                    {
                                                      message: "Online Meeting",
                                                      byBot: false,
                                                    },
                                                    {
                                                      message:
                                                        "Okay, booking your appointment...",
                                                      byBot: true,
                                                    },
                                                  ]);
                                                  bookAppointment({
                                                    setMessages,
                                                    d_name,
                                                    email,
                                                    mode: "online",
                                                    intro: () => {
                                                      return intro({
                                                        setMessages,
                                                        findMedicine,
                                                        findSD,
                                                        message:
                                                          "Anything more?",
                                                      });
                                                    },
                                                  });
                                                },
                                              },
                                              {
                                                name: "Direct Appointment",
                                                action: () => {
                                                  setMessages((mss) => [
                                                    ...mss,
                                                    {
                                                      message:
                                                        "Direct Appointment",
                                                      byBot: false,
                                                    },
                                                    {
                                                      message:
                                                        "Okay, booking your appointment...",
                                                      byBot: true,
                                                    },
                                                  ]);
                                                  bookAppointment({
                                                    setMessages,
                                                    d_name,
                                                    email,
                                                    intro: () => {
                                                      return intro({
                                                        setMessages,
                                                        findMedicine,
                                                        findSD,
                                                        message:
                                                          "Anything more?",
                                                        mode: "offline",
                                                      });
                                                    },
                                                  });
                                                },
                                              },
                                            ],
                                          },
                                        ]);
                                      }}
                                    >
                                      Book Appointment
                                    </Button>
                                  </div>
                                </div>
                              ),
                              byBot: true,
                            };
                          }),
                        ]);
                      });
                    },
                  };
                }),
              },
            ]);
          });
        },
      },
    ],
  };
}
