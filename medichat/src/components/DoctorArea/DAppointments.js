import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Typography } from "@material-tailwind/react";
import { Textarea, Input } from "@material-tailwind/react";
import axios from "axios";
import { signOut } from "next-auth/react";

function isValidTimestamp(timestamp) {
  const date = new Date(timestamp);
  return !isNaN(date) && date.toISOString() === timestamp;
}

export default function DAppointments({ session }) {
  const [appointments, setAppointments] = useState([]);
  const [accAppData, setAccAppData] = useState(null);

  const getAppointments = async () => {
    const response = await fetch("/api/doctor/appointments");
    const data = await response.json();
    setAppointments(data.appointments);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div>
      {
        <div>
          {accAppData && (
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-800/60 flex items-center justify-center">
              <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden">
                <div className="p-3 bg-gray-500">
                  <Typography variant="h4" color="white">
                    Accept Appointment
                  </Typography>
                </div>
                <div className="p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      axios
                        .patch(
                          `/api/doctor/appointments?id=${accAppData.id}`,
                          accAppData
                        )
                        .then(({ data }) => {
                          if (!data.success) {
                            alert(data.message);
                            console.error(data);
                            return;
                          }
                          setAccAppData(null);
                          getAppointments();
                        })
                        .catch((e) => {
                          alert("Something went wrong");
                          console.error(e);
                        });
                    }}
                  >
                    <div className="py-4">
                      <Textarea
                        label="Appointment Details"
                        onChange={(e) => {
                          setAccAppData({
                            ...accAppData,
                            meeting_details: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="py-4">
                      <Input
                        label="Appointment Time"
                        type="datetime-local"
                        onChange={(e) => {
                          setAccAppData({
                            ...accAppData,
                            accepted_meeting_ts: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="py-4 flex items-center justify-end">
                      <Button color="blue" size="lg" type="submit">
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between p-3">
            <div>
              <Typography variant="h2">
                Welcome, Dr. {session.user.name}
              </Typography>
            </div>
            <div>
              <Button
                color="red"
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="w-full p-3">
            <div className="py-4">
              <table className="table-fixed w-full text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Patient Email</th>
                    <th className="p-3">Appointment Time</th>
                    <th className="p-3">Appointment Details</th>
                    <th className="p-3">Created On</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => {
                    const accepted = !!appointment.accepted_meeting_ts;
                    return (
                      <tr key={appointment.id} className="border-b">
                        <td className="p-3">{appointment.p_email}</td>
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
                          {appointment.meeting_details || "Not accepted"}
                        </td>
                        <td className="p-3">
                          {new Date(appointment.created_at).toLocaleString()}
                        </td>
                        <td className="p-3">
                          {!accepted && (
                            <Button
                              color="blue"
                              onClick={() => {
                                setAccAppData({
                                  id: appointment.id,
                                });
                              }}
                            >
                              Accept Appointment
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
