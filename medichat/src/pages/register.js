import { Button, Typography } from "@material-tailwind/react";
import { getSession, signOut } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

function ContinueAs({ title, children, onClick, selected }) {
  return (
    <div
      className={`${
        selected ? "border-gray-50" : ""
      } rounded-md border-4 hover:border-gray-50 cursor-pointer border-transparent w-full p-5 bg-blue-800`}
      onClick={onClick}
    >
      <div>
        <Typography variant="h4" color="white">
          {title}
        </Typography>
      </div>
      <div className="">
        <Typography variant="paragraph" color="white">
          {children}
        </Typography>
      </div>
    </div>
  );
}

export default function Register({ session }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <div className="h-screen w-screen bg-cover bg-center bg-gradient-to-br from-blue-900 to-gray-600 flex items-center justify-center flex-col">
        <div className="lg:py-12 py-4">
          <Typography variant="h1" color="white">
            Hi, {session.user.name}
          </Typography>
        </div>
        <div className="flex flex-col gap-5 items-center justify-center lg:w-1/2 p-2">
          <ContinueAs
            title="Continue as normal user"
            onClick={() => {
              setSelected("user");
            }}
            selected={selected === "user"}
          >
            Allows you to book appointments with doctors, find medicines, search
            for skin related issues and more.
          </ContinueAs>
          <ContinueAs
            title="Continue as a doctor"
            onClick={() => {
              setSelected("doctor");
            }}
            selected={selected === "doctor"}
          >
            Allows you to manage your appointments, manage your patients.
          </ContinueAs>
        </div>
        <div className="py-5 lg:w-1/2 flex justify-end">
          <div className="lg:w-1/2 p-3">
            <Button
              color="red"
              size="lg"
              onClick={() => {
                signOut();
              }}
              fullWidth
            >
              Logout
            </Button>
          </div>
          <div className="lg:w-1/2 p-3">
            <Button
              color="blue"
              size="lg"
              fullWidth
              disabled={!selected}
              onClick={async () => {
                const { data: res } = await axios.put("/api/register", {
                  role: selected,
                });
                if (res.success) {
                  window.location.reload();
                } else {
                  alert(res.message);
                }
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (session.user.role) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
