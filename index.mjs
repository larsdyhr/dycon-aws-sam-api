import mysql from 'mysql2/promise';
import {Libxml} from 'node-libxml';
import {encode} from 'html-entities';
import xss from 'xss'; // CommonJS package

// let locallibxml = new Libxml();

// const mysql = require('mysql2/promise');


//"You have tried to call .then(), .catch(), or invoked await on the result of query that is not a promise, which is a programming error. " +
//"Try calling con.promise().query(), or require('mysql2/promise') instead of 'mysql2' for a promise-compatible version of the query interface. " +
//"To learn how to use async/await or Promises check out documentation at https://sidorares.github.io/node-mysql2/docs#using-promise-wrapper, or the mysql2 documentation at https://sidorares.github.io/node-mysql2/docs/documentation/promise-wrapper";
// eslint-disable-next-line
export const mysql2pool = mysql.createPool({
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
	rowsAsArray: true,
	namedPlaceholders: true
});


export const mysql2execute = async (sql, params) => {
	let res = [];
	try {
		[res,] = await mysql2pool.execute(sql, params);
	} catch (err) {
		console.log(err);
	}
	return res;
}

export const mysql2query = async (sql, params) => {
	let res = [];
	try {
		[res,] = await mysql2pool.query(sql, params);
	} catch (err) {
		console.log(err);
	}
	return res;
}



export function mysql2format (sql, params) {
	let res = [];
	try {
		[res,] = mysql2pool.format(sql, params);
	} catch (err) {
		console.log(err);
	}
	return res;
}



/**
 * 	Response for most integrations according to the default DTD:
 * 	https://sogn.dk/api/dtd/defaultreply.dtd
 * 	svar (kode,besked, forklaring?, result?,gudstjeneste?,arrangement?)
 * @param kode
 * @param besked
 * @param forklaring
 * @param gudstjenesteid
 * @param arrangementsid
 * @param statusCode
 * @param headers
 * @returns {{}}
 */
export function generateResponse(kode, besked, forklaring, gudstjenesteid, arrangementsid, statusCode = 403, headers = {"content-type": "application/xml"}) {
	// Required output:
	let integrationResponse = {};
	integrationResponse.statusCode = statusCode;
	integrationResponse.headers = headers;
	integrationResponse.body = '<?xml version="1.0" encoding="UTF-8"?>' +
		'<!DOCTYPE svar PUBLIC "-//SOGN.DK//DTD XML 1.0//DA" "https://sogn.dk/api/dtd/defaultreply.dtd">' +
		'<svar xmlns="https://sogn.dk/api/dtd/defaultreply.dtd">';
	if(kode) {
		integrationResponse.body += `\n\t<kode>${kode}</kode>`;
	}
	if(besked) {
		integrationResponse.body += `\n\t<besked>${besked}</besked>`;
	}
	if(forklaring) {
		integrationResponse.body += `\n\t<forklaring>${forklaring}</forklaring>`;
	}
	if(gudstjenesteid) {
		integrationResponse.body += `\n\t<gudstjeneste id="${gudstjenesteid}" />`;
	}
	if(arrangementsid) {
		integrationResponse.body += `\n\t<arrangement id="${arrangementsid}" />`;
	}
	integrationResponse.body += `\n</svar>`;
	return integrationResponse;
}


export const creupdate = async (libxml, data, recid = null) =>
{
	// $data = $this->validateParseXML($data);
	let sted = '';
	let start = libxml.xpathSelect('//tidspunkt-start');
	let praedikant  = libxml.xpathSelect('//praedikant');

	let gudstjeneste = ['sogn','type','tidspunkt-start','tidspunkt-slut','ingen-sluttid','praest','praedikant','overskrift','kirke','sted','beskrivelse','abstract','link','slettet','oprettet','redigeret','deltagere','konfirmationer','daab','kommentar','modtager','online','dawaid'];
	let arrangement = ['sogn','kategori','tidspunkt-start','tidspunkt-slut','ingen-sluttid','overskrift','kirke','sted','beskrivelse', 'abstract','link','slettet','oprettet','redigeret', 'deltagere', 'konfirmationer', 'daab','kommentar','modtager','online','dawaid','opencommunity'];
	let elementsWithIdAttrib = ['sogn','praest','kirke','sted'];
	let topRootName = libxml.xpathSelect('name(/*)');
	console.log("praedikant og start", praedikant, start);
	return true;
}
