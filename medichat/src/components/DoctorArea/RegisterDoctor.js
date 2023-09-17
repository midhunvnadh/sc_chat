import {
  Button,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import Dropzone from "./DropZone";
import specialities from "./specialities.json";
import { useState } from "react";
import axios from "axios";
import getDataUrl from "@/functions/get_dataurl";

export default function RegisterDoctor() {
  const [data, setData] = useState({});
  return (
    <div className="w-full flex items-center justify-center flex-col bg-gradient-to-br from-blue-700 to-blue-900 h-screen p-3">
      <div className="p-4 mb-5">
        <Typography variant="h2" className="font-black text-white">
          Doctor's Approval Form
        </Typography>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { data: res } = await axios.put(
            "/api/doctor/registration",
            data
          );
          if (res.success) {
            window.location.reload();
          } else {
            alert("Something went wrong");
          }
        }}
        className="w-full max-w-6xl p-6 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 shadow"
      >
        <div className="mb-3">
          {data.license ? (
            <div className="bg-gray-600 flex items-center justify-center rounded-md">
              <div className="p-3">
                <img src={data.license} alt="license" className="w-auto h-32" />
              </div>
              <div className="p-3">
                <Button
                  onClick={() => {
                    setData({ ...data, license: null });
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <Dropzone
              onChange={async (files) => {
                const file = files[0];
                const dataURL = await getDataUrl(file);
                console.log(dataURL);
                setData({ ...data, license: dataURL });
              }}
              text={"Drag your license document here or click to select file"}
            />
          )}
        </div>
        <div className="flex gap-3 lg:flex-row flex-col">
          <div className="w-full lg:w-1/3">
            <Input
              type="number"
              color="blue"
              label="Pincode"
              outline={true}
              size="lg"
              value={data.pincode}
              onChange={(e) => {
                setData({ ...data, pincode: e.target.value });
              }}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <Select
              color="blue"
              label="Specialization"
              outline={true}
              size="lg"
              value={data.specialization}
              onChange={(e) => {
                setData({ ...data, specialization: e });
              }}
            >
              {specialities.map((speciality) => (
                <Option value={speciality} key={`spec-${speciality}`}>
                  {speciality}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full lg:w-1/3">
            <Button
              type="submit"
              color="blue"
              ripple="light"
              fullWidth
              size="lg"
            >
              Register
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
