import mysql from 'mysql2/promise';
// const mysql = require('mysql2/promise');
//"You have tried to call .then(), .catch(), or invoked await on the result of query that is not a promise, which is a programming error. " +
//"Try calling con.promise().query(), or require('mysql2/promise') instead of 'mysql2' for a promise-compatible version of the query interface. " +
//"To learn how to use async/await or Promises check out documentation at https://sidorares.github.io/node-mysql2/docs#using-promise-wrapper, or the mysql2 documentation at https://sidorares.github.io/node-mysql2/docs/documentation/promise-wrapper";
// eslint-disable-next-line
const pool = mysql.createPool({
	host     : process.env.HOST_NAME,
	user     : process.env.USER_NAME,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME,
	ssl: 'Amazon RDS',
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
	rowsAsArray: true
});


export const execute = async (sql, params) => {
	let res = [];
	try {
		[res,] = await pool.execute(sql, params);
	} catch (err) {
		console.log(err);
	}
	return res;
}


/*async function execute2(sql, params){
	let res = [];
	try {
		[res,] = await pool.execute(sql, params);
	} catch (err) {
		console.log(err);
	}
	return res;
}
module.exports = execute2
*/