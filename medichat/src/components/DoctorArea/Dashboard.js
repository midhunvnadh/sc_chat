import axios from "axios";
import { useEffect, useState } from "react";
import RegisterDoctor from "./RegisterDoctor";
import DAppointments from "./DAppointments";
import Loading from "../misc/Loading";

export default function DDashboard({ session }) {
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDoctor = async () => {
      setLoading(true);
      const { data: doctor } = await axios.get("/api/doctor/registration");
      setDoctor(doctor);
      setLoading(false);
    };

    getDoctor();
  }, []);

  return (
    <div className="">
      <div>
        {loading && <Loading />}
        {!loading && (
          <>
            {doctor.notFound ? (
              <RegisterDoctor />
            ) : (
              <DAppointments session={session} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
