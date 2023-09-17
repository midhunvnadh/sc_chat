import dynamic from "next/dynamic";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { BsChatRightDotsFill } from "react-icons/bs";
import { Avatar } from "@material-tailwind/react";
import { IoLogOutSharp } from "react-icons/io5";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const ChatScreen = dynamic(() => import("./ChatScreen"), {
  ssr: false,
});

function Sidebar({ session, toggle, collapsed }) {
  return (
    <>
      <button
        className={`absolute transition z-50 text-4xl rounded-full ${
          collapsed ? "text-white" : "bg-white text-black shadow-lg"
        } p-3 top-10 right-3`}
        onClick={() => toggle((c) => !c)}
      >
        <GiHamburgerMenu />
      </button>
      <div className="absolute w-full h-full overflow-hidden lg:rounded-2xl">
        <motion.div
          className="flex flex-col w-5/6 absolute h-full bg-gray-100 z-10 shadow lg:rounded-2xl overflow-hidden"
          animate={{
            x: collapsed ? "-100%" : "0%",
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div>
            <div className="flex items-center justify-center py-2 px-6 w-full bg-gray-300">
              <div className="flex items-center justify-center mb-1 mt-0.5">
                <div className="py-5">
                  <Avatar src={session.user.image} size="xl" />
                </div>
                <div className="py-5 ml-3">
                  <div className="text-xl font-bold">{session.user.name}</div>
                  <div className="text-gray-600 text-md lg:block hidden">
                    {session.user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            {[
              {
                name: "Chat",
                icon: <BsChatRightDotsFill />,
                link: "/",
              },
              {
                name: "Appointments",
                icon: <FaUser />,
                link: "/appointments",
              },
            ].map(({ name, icon, link, action }) => {
              return (
                <Link href={link}>
                  <div className="w-full p-3 flex items-center justify-start hover:bg-gray-200">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-2xl text-gray-600">
                      {icon}
                    </div>
                    <div className="ml-2 text-lg">{name}</div>
                  </div>
                </Link>
              );
            })}

            <button
              onClick={() => signOut()}
              className="w-full p-3 flex items-center justify-start hover:bg-gray-200"
            >
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-2xl text-gray-600">
                <IoLogOutSharp />
              </div>
              <div className="ml-2 text-lg">Logout</div>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function ChatAreaWrapper({ session }) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="">
      <div className="w-full h-screen flex items-center justify-center bg-gray-600 lg:py-6">
        <div className="max-w-lg bg-white h-full w-full rounded-md shadow-md flex flex-col rounded-t-2xl rounded-b-2xl relative">
          <Sidebar
            session={session}
            toggle={setCollapsed}
            collapsed={collapsed}
          />
          <ChatScreen session={session} />
        </div>
      </div>
    </div>
  );
}
