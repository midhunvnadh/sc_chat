import { getSession } from "next-auth/react";
import pg from "@/database/pg";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res.status(200).json({ success: false, message: "Unauthorized" });

  if (req.method == "GET") {
    const { spec } = req.query;
    if (!spec) {
      return res
        .status(200)
        .json({ success: false, message: "Specialization is required" });
    }
    var { rows: doctors } = await pg.query(
      "SELECT d_name, email FROM doctors WHERE specialization = $1",
      [spec]
    );
    if (!doctors) {
      return res
        .status(200)
        .json({ success: false, message: "Doctors not found" });
    }
    return res.status(200).json({ success: true, doctors });
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
