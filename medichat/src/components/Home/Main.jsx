import { Button } from "@material-tailwind/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { Spinner } from "@material-tailwind/react";
import { useRouter } from "next/router";

export default function Main() {
  return (
    <header className="p-4 bg-gradient-to-br from-blue-900 to-gray-600 h-screen">
      <div className="text-center py-12">
        <h1 className="text-7xl font-bold text-gray-200">
          Welcome to Medichat!
        </h1>
      </div>
      <div className="flex items-center justify-center w-full py-12">
        <div className="w-2/4">
          <div className="w-full flex justify-center">
            <LoginArea />
          </div>
        </div>
        <div className="w-2/4">
          <ul className="">
            <li>
              <h2 className="text-2xl font-bold text-gray-200 py-3">
                Skin Disease Detection
              </h2>
            </li>
            <li>
              <h2 className="text-2xl font-bold text-gray-200 py-3">
                Medicine Recommendation
              </h2>
            </li>
            <li>
              <h2 className="text-2xl font-bold text-gray-200 py-3">
                Medical Report Generation
              </h2>
            </li>
            <li>
              <h2 className="text-2xl font-bold text-gray-200 py-3">
                Doctor Appointment Booking System
              </h2>
            </li>
            <li>
              <h2 className="text-2xl font-bold text-gray-200 py-3">
                Mental Health Support System
              </h2>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

function LoginArea() {
  const { data: session, status } = useSession();
  const loggedIn = session ? true : false;
  const loading = status === "loading" ? true : false;

  const router = useRouter();

  const login = () => {
    if (!session && !loading) signIn("google");
  };

  if (session && !loading) router.push("/app");

  return (
    <div>
      <Button color="blue" size="lg" fullWidth onClick={login}>
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">Getting login status...</span>
            <Spinner color="white" size="sm" />
          </div>
        ) : (
          <>
            {session ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">Logging you in</span>
                <Spinner color="white" size="sm" />
              </div>
            ) : (
              <div className="flex items-center justify-center p-2">
                <span className="mr-2 text-xl block">
                  <FaGoogle />
                </span>
                <span className="block">Login with Google</span>
              </div>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
