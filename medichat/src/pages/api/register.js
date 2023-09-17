import { getSession } from "next-auth/react";
import pg from "@/database/pg";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log(session);

  if (!session) {
    return res.status(200).json({ sucess: false, message: "Unauthorized" });
  }
  var { email, role } = session.user;

  if (req.method != "PUT") {
    return res
      .status(405)
      .json({ sucess: false, message: "Method not allowed" });
  }

  if (!role) {
    role = req.body.role;
    if (!role) {
      return res
        .status(400)
        .json({ sucess: false, message: "Role is required" });
    }
    const query = pg.query(
      "INSERT into reg_details (role,email) VALUES ($1, $2)",
      [role, email]
    );
    if (query) {
      return res
        .status(200)
        .json({ success: true, message: "Role registered successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
