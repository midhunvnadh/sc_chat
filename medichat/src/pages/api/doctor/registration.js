import { getSession } from "next-auth/react";
import pg from "@/database/pg";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res.status(200).json({ sucess: false, message: "Unauthorized" });

  var { email, role } = session.user;

  if (!role)
    return res.status(400).json({ sucess: false, message: "Role is required" });

  if (role != "doctor") {
    return res
      .status(400)
      .json({ sucess: false, message: "Role is not doctor" });
  }

  if (req.method == "GET") {
    var { rows: doctor } = await pg.query(
      "SELECT * FROM doctors WHERE email = $1",
      [email]
    );
    doctor = doctor[0];
    if (!doctor) {
      return res
        .status(400)
        .json({ sucess: false, message: "Doctor not found", notFound: true });
    }
    return res.status(200).json({ sucess: true, doctor });
  } else if (req.method == "PUT") {
    const { license } = req.body;
    if (!license) {
      return res
        .status(400)
        .json({ sucess: false, message: "License is required" });
    }
    const d_name = session.user.name;
    const query = await pg.query(
      "INSERT into doctors (email, license , d_name) VALUES ($1, $2, $3)",
      [email, license, d_name]
    );
  } else {
    return res
      .status(405)
      .json({ sucess: false, message: "Method not allowed" });
  }
}
