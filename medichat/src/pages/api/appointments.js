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
        appointments.p_email = $1
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
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
