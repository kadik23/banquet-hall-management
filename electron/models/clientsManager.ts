const dbmgr = require("./dbManager");
const database = dbmgr.db;

exports.getClient = () => {
  const qry = "SELECT * FROM clients";
  let stmt = database.prepare(qry);
  let res = stmt.all();
  return res;
};
