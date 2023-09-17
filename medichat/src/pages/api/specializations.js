import { getSession } from "next-auth/react";
import pg from "@/database/pg";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session)
    return res.status(200).json({ success: false, message: "Unauthorized" });

  if (req.method == "GET") {
    var { rows: specs } = await pg.query(
      "SELECT DISTINCT specialization FROM doctors"
    );
    if (!specs) {
      return res
        .status(200)
        .json({ success: false, message: "Specializations not found" });
    }
    return res
      .status(200)
      .json({ success: true, specs: specs.map((spec) => spec.specialization) });
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
