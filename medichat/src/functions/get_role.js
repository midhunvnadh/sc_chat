import db from "@/database/pg";
export default async function get_role(email) {
  const result = await db.query(
    `
  SELECT
      role
  FROM
      reg_details
  WHERE
      email = $1
`,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].role;
}
