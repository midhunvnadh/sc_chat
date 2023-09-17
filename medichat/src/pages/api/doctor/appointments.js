import { getSession } from "next-auth/react";
import pg from "@/database/pg";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res.status(200).json({ success: false, message: "Unauthorized" });

  const email = session.user.email;

  if (req.method == "GET") {
    var { rows: appointments } = await pg.query(
      `
      SELECT  
        doctors.d_name,
        doctors.specialization,
        appointments.*
      FROM 
        appointments,
        doctors
      WHERE
        appointments.d_email = $1
        AND
        appointments.d_email = doctors.email 
      ORDER BY
        appointments.created_at DESC
        `,
      [email]
    );
    if (!appointments) {
      return res
        .status(200)
        .json({ success: false, message: "No appointments found" });
    }
    return res.status(200).json({ success: true, appointments });
  } else if (req.method == "PATCH") {
    const { id } = req.query;
    var { meeting_details, accepted_meeting_ts } = req.body;

    if (!meeting_details) {
      return res
        .status(200)
        .json({ success: false, message: "Meeting details not provided" });
    }

    var dateValid = false;
    try {
      accepted_meeting_ts = new Date(accepted_meeting_ts);
      if (accepted_meeting_ts.toString() == "Invalid Date") {
        dateValid = false;
      }
    } catch (e) {
      dateValid = false;
    }

    if (!dateValid) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid date format" });
    }

    const query = await pg.query(
      `
        UPDATE
            appointments
        SET
            meeting_details = $1,
            accepted_meeting_ts = $2
        WHERE
            id = $3
        `,
      [
        meeting_details,
        accepted_meeting_ts ? new Date(accepted_meeting_ts) : null,
        id,
      ]
    );
    if (!query) {
      return res
        .status(200)
        .json({ success: false, message: "Failed to update appointment" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Appointment updated" });
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
