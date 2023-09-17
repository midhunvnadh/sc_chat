import { Spinner } from "@material-tailwind/react";

export default function Loading() {
  return (
    <div className="p-6">
      <Spinner color="blue" className="mx-auto h-32 w-32" />
    </div>
  );
}
