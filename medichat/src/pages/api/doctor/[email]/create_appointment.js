import { getSession } from "next-auth/react";
import pg from "@/database/pg";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res.status(200).json({ success: false, message: "Unauthorized" });

  var { email } = session.user;

  const role = session.user.role;

  if (!role)
    return res
      .status(200)
      .json({ success: false, message: "Role is required" });

  if (role != "user") {
    return res
      .status(200)
      .json({ success: false, message: "Role is not user" });
  }

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const query = await pg.query(
    `
    INSERT into appointments 
    (p_email, d_email, meeting_mode) 
    VALUES ($1, $2, $3)
    
    `,
    [email, req.query.email, req.query.mode === "online" ? 1 : 0]
  );
  if (!query) return res.status(200).json({ success: false, message: "Error" });
  return res.status(200).json({ success: true, message: "Registered" });
}
