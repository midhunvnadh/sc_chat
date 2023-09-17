import ChatApp from "@/components/ClientArea/ChatAreaWrapper";
import DDashboard from "@/components/DoctorArea/Dashboard";
import { getSession } from "next-auth/react";

export default function Main({ session }) {
  const role = session.user.role;
  return (
    <>
      {role === "user" ? (
        <ChatApp session={session} />
      ) : role === "doctor" ? (
        <DDashboard session={session} />
      ) : (
        <div>Registration error!</div>
      )}
    </>
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
  if (!session.user.role) {
    return {
      redirect: {
        destination: "/register",
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
