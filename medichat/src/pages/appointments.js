import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    const response = await fetch("/api/appointments");
    const data = await response.json();
    setAppointments(data.appointments);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div>
      <div className="w-full p-3">
        <div className="text-3xl">
          <Link
            href={"/app"}
            className="flex items-center justify-start bg-gray-200 p-4 rounded-md"
          >
            <span className="mr-2">
              <FaArrowAltCircleLeft />
            </span>
            <span>Go back to chat</span>
          </Link>
        </div>
        <div className="py-4">
          <table className="table-fixed w-full text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Doctor</th>
                <th className="p-3">Specialization</th>
                <th className="p-3">Appointment Time</th>
                <th className="p-3">Appointment Details</th>
                <th className="p-3">Created On</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="p-3">{appointment.d_name}</td>
                  <td className="p-3">{appointment.specialization}</td>
                  <td className="p-3">
                    {appointment.accepted_meeting_ts && (
                      <>
                        {new Date(
                          appointment.accepted_meeting_ts
                        ).toLocaleString()}
                      </>
                    )}
                    {!appointment.accepted_meeting_ts && "Not accepted"}
                  </td>
                  <td className="p-3">
                    {appointment.appointment_details || "Not accepted"}
                  </td>
                  <td className="p-3">
                    {new Date(appointment.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
