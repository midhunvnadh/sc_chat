import { useSession, signIn, signOut } from "next-auth/react";

export default function Main() {
  return (
    <header className="p-4 bg-gradient-to-br from-cyan-600 to-blue-500 h-screen">
      <div className="text-left py-12">
        <h1 className="text-7xl font-bold text-gray-200">
          Welcome to Medichat!
        </h1>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="w-2/4"></div>
        <div className="w-2/4">
          <ul>
            <li>
              <h2 className="text-2xl font-bold text-gray-200"></h2>
            </li>
            <li>
              <h2 className="text-2xl font-bold text-gray-200">
                A place to connect with your doctor
              </h2>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
