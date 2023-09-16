import { Button } from "@material-tailwind/react";
import { TbError404 } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center bg-gray-400 h-screen flex-col">
      <div className="text-8xl text-blue-500 text-center">
        <TbError404 />
      </div>
      <div className="text-7xl font-bold ml-4 text-blue-500 text-center">
        Not Found
      </div>
      <div className="p-5">
        <Link to="/">
          <Button size="lg" type="gradient">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
