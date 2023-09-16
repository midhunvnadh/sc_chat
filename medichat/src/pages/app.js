import App from "@/components/ClientArea/ChatAreaWrapper";
import { getSession } from "next-auth/react";

export default App;

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
  return {
    props: {},
  };
};
