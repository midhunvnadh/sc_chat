import "./assets/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/Error/ErrorPage";
import ChatAreaWrapper from "./components/ClientArea/ChatAreaWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatAreaWrapper />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}
