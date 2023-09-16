import { Avatar } from "@material-tailwind/react";
export default function Header() {
  return (
    <div className="px-8 py-6 bg-gradient-to-r from-purple-900 to-purple-700 text-gray-50 font-bold flex items-center justify-start lg:rounded-t-2xl">
      <div>
        <Avatar size="xl" src="/logo.jpg" />
      </div>
      <div className="p-3 flex flex-col">
        <div className="text-xl font-medium">
          <span>Chat with</span>
        </div>
        <div className="text-3xl">
          <span>MediBot</span>
        </div>
      </div>
    </div>
  );
}
