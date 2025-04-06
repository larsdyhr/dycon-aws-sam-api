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
export const pool2 = mysql.createPool({
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


export const execute2 = async (sql, params) => {
	let res = [];
	try {
		[res,] = await pool2.execute(sql, params);
	} catch (err) {
		console.log(err);
	}
	return res;
}
export const format2 = (sql, params) => {
	let res = [];
	try {
		[res,] = mysql.format(sql, params);
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
/*
	if (data['xml_sted'])) {
		$sted = $data['xml_sted'];
		unset($data['xml_sted']);
	}
	if (!$this->auth->hasAccess($this->organiser["uid"])) {
	throw new \Exception('Brugeren ' . $this->auth->getUserName() . ' har ikke adgang til at opdatere sogn/provsti id:' . $this->sogneId . ' (organiserid:' . $this->organiser["uid"] . '). Hvis dette er en fejl bed support om at tilføje dette sogn/provsti til jeres accessliste.', 9034);
}
	$db = $this->getDatabase();
	$data['create_feuser'] = $this->auth->getUserId();
	$data['edit_feuser'] = $this->auth->getUserId();
	// Store the last POSTED request - with the request uri on first line:
	$data['last_posted_request'] = $_SERVER["REQUEST_URI"] . '|' . time() . '|apiversion:' . $this->apiversion . '|';
	$data['last_posted_request'] .= file_get_contents("php://input");
	// Adjusting event type by category (to be compatible with eventController and all other uses (May, 2015):
	if (isset($data['category']) && isset($data['type']) && $data['category'] && $data['type']) {
		//If category is a Kirkelig handling (uid: [36-> 41], then adjust the type to 3
		if (in_array($data['category'], array(36, 37, 38, 39, 40, 41, 55))) {
			$data['type'] = 3;
		}
	}
	$existingRec = null;
	// Check if this is actually a insert!
	// As I use this API to insert / transfer events from old system to new I may actually supply the recid, but if this event is not yet created in this DB I need to do a create in stead of an update and save the provided recid as origrecid
	if ($recid !== null) {
		//$existingRec = $db->read(self::SELECT_BASE." WHERE tx_dyconsogneadmin_domain_model_event.origrecid =".intval($recid)." AND tx_dyconsogneadmin_domain_model_event.type=".(self::BOOL_PRAED ? 1 : 2));
		// Dycon, 02/2017: Dropped the type clause as we no longer have duplicates (only ones created by error)
		//$existingRec = $db->read(self::SELECT_BASE." WHERE tx_dyconsogneadmin_domain_model_event.origrecid =".intval($recid)." AND tx_dyconsogneadmin_domain_model_event.type IN (3,".($this->BOOL_PRAED_VAR ? 1 : 2).")");
		$existingRec = $db->read(self::SELECT_BASE . " WHERE tx_dyconsogneadmin_domain_model_event.origrecid =" . intval($recid));
		if (empty($existingRec)) {
			$data['origrecid'] = intval($recid);
			$this->overrideAsInsert = true;
			$recid = null;
		}
	}
	//Validate user access
	if ($recid === null) {
		// Dycon, april 2017: Made the parsed array into new array as I got into problem with double encoded strings when saving data into ES
		$quotedData = array();
		// Securing values, to prevent harzardous SQL injections.
		foreach ($data as $key => $value) {
			// $value = $this->validateHazards($value, true);
			$quotedData[$key] = $this->validateHazards($value, true);
		}
		// Insert SQL
		// Lars Dyhr, 12-2013, updated to use new tables AND Mysql
		$sql = 'INSERT INTO ' . self::SEL_TABLE . ' (' . implode(',', array_keys($quotedData)) . ') VALUES (' . implode(',', array_values($quotedData)) . ')';
		$rec = $db->write($sql);
		// $recid = $rec['recid'];
		// Lars Dyhr, 12-2013: Changed as we now get the inserted id returned directly (using mysql)
		$recid = $rec;
		// Updating origrecid with the insertedUid, only if this is not a event transfer:
		if (isset($data['origrecid'])) {
		} else {
			// No need to add type check here, as this is just updating the newly inserted records
			$sql = 'UPDATE ' . self::SEL_TABLE . ' SET origrecid=' . $recid . ' WHERE uid=' . $recid;
			$db->write($sql);
		}
		if (!empty($this->taellingArray)) {
			$this->createUpdateTaelling($recid);
		}
		// Clear cache for the pages belonging to the organiser that this event belongs to:
		if (isset($this->organiser['uid']) && $this->organiser['uid']) {
			$this->clearCacheOfOrganisersFrontendPages($this->organiser['uid']);
		}
	} else {
		if (is_numeric($recid)) {
			// Checking if record has changed and only updating the tstamp field if it has.
			// Also unsetting the crdate field as this is only set on create and used as a creation timestamp
			// Changed above on may 2013 by Lars as I need the new joined fields from the statistik table too
			// $record = $this->filterResults($db->read(self::SELECT_BASE." WHERE tx_dyconsogneadmin_domain_model_event.origrecid =".intval($recid)." AND tx_dyconsogneadmin_domain_model_event.type=".(self::BOOL_PRAED ? 1 : 2)));
			// Vi burde allerede have fundet denne record over denne if som $existingRec ?
			// $record = $this->filterResults($db->read(self::SELECT_BASE." WHERE tx_dyconsogneadmin_domain_model_event.origrecid =".intval($recid)." AND tx_dyconsogneadmin_domain_model_event.type IN (3,".($this->BOOL_PRAED_VAR ? 1 : 2).")"));
			if ($existingRec) {
				unset($data['crdate']);
				unset($data['create_feuser']);
				if (
					!empty($this->taellingArray) &&
					(
						isset($this->taellingArray['deltagere']) ||
						isset($this->taellingArray['konfirmander']) ||
						isset($this->taellingArray['daabshandlinger']) ||
						isset($this->taellingArray['kommentar'])
					)
				) {
					// Update the stat record!
					$this->createUpdateTaelling($existingRec[0]['uid']);
				}
				if (isset($existingRec[0]['record_hash']) && $existingRec[0]['record_hash'] == $data['record_hash']) {
					return true;
				}
				// Update SQL
				foreach ($data as $key => $value) {
					$values[] = '' . $key . ' = ' . $this->validateHazards($value, true);
				}
				$sql = 'UPDATE ' . self::SEL_TABLE . ' SET ' . implode(',', $values) . ' WHERE origrecid = ' . $recid; // .' AND tx_dyconsogneadmin_domain_model_event.type IN (3,'.($this->BOOL_PRAED_VAR ? 1 : 2).')';
				$db->write($sql);
				if ($existingRec[0]['deleted']) {
					$data["public"] = 0; // As we use public attrib to set deleted in ES
				}
				// Delete all relations to priests and insert again below:
				// At this point recid is still referring to the old origrecid!:
				$sql = 'DELETE FROM tx_dyconsogneadmin_event_priest_mm WHERE uid_local=' . $existingRec[0]['uid'];
				$db->write($sql);
				// Clear cache for the pages belonging to the organiser that this event belongs to:
				if (isset($this->organiser['uid']) && $this->organiser['uid']) {
					$this->clearCacheOfOrganisersFrontendPages($this->organiser['uid']);
				}
				// Dycon then set the recid to hold the actual uid of the event table - for updates as well as for inserts:
				// Before 31-10-14 this was not set and the recid (=origrecid) was used to update relations with for updates!
				$recid = intval($existingRec[0]['uid']);
			} else {
				throw new \Exception('Intet fundet ved ID: ' . $recid, 2003);
			}
		} else {
			throw new \Exception('Intet fundet ved ID: ' . $recid, 2002);
		}
	}
	// At this point we will now have identical values for origrecid / recid
	$priestNamesArray = array();
	// New in mysql version:
	if (count($this->eventPriests) > 0) {
		foreach ($this->eventPriests as $feUserId) {
			if ($feUserId) {
				$sql = 'INSERT INTO tx_dyconsogneadmin_event_priest_mm (uid_local,uid_foreign) VALUES (' . $recid . ',' . $feUserId . ');';
				$rec = $db->write($sql);
				if (isset($this->eventPriestNames[$feUserId]) && !empty($this->eventPriestNames[$feUserId])) {
					$priestNamesArray[] = $this->eventPriestNames[$feUserId];
				}
			}
		}
	}
	$priestNames = implode(', ', $priestNamesArray);
	$data["crdate"] = (isset($data["crdate"]) ? $data["crdate"] : $existingRec[0]["crdate"]);
	$data['create_feuser'] = (isset($data['create_feuser']) ? $data['create_feuser'] : $existingRec[0]['create_feuser']);
	$data['sted'] = $sted;
	$this->insertIntoES($recid, $data, $priestNames);
	// TODO:
	// Could also implement images and files like priests above by letting API users send those as fx ; delimited and updating/inserting by exploding first (and converting field to mm field)
	return $recid;
	*/

}
