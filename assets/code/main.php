<?php
// disable error display
error_reporting(E_ALL ^ E_DEPRECATED);
error_reporting(E_ALL | E_NOTICE | E_WARNING);
ini_set('log_errors', 'Off'); 

require_once('main_functions.php');

// toggle document type xml/html
$usexml = 1;
$debugMode = true;

if (!isset($usexml)) {
    $usexml = 0;
}

if ($usexml == 1) {
    if (isset($_SERVER['HTTP_ACCEPT'])) {
		if (!strpos($_SERVER['HTTP_ACCEPT'], "application/xhtml+xml")) {
			$usexml = 1;
		}
	} else {
		$usexml = 0;
	}
}

// var setup
if ($_REQUEST) {
	$actionArray = explode(',', $_REQUEST['a']);
} else {
	$phpScript = $_SERVER['PHP_SELF'];

	$dieMessage = <<<EOD
No action specified. Exiting.<br>
<a href="$phpScript?a=options">Options</a>
EOD;
	
	die('Die: ' . $dieMessage);
}

// XML document for output
$xmlDoc = new DomDocument('1.0', 'UTF-8');
$xmlDoc->preserveWhiteSpace = false;
$xmlDoc->formatOutput = true;

$xmlRoot = $xmlDoc->createElement('xml_root');
$xmlDoc->appendChild($xmlRoot);

//open database connection
$dbConn = mysql_connect('localhost', 'root', 'lockview')
	or die(print_r(mysql_error()));

mysql_select_db('repost') or die(print_r(mysql_error()));

//$dbConn = mysqli_connect("localhost","root","lockview","repost") or die("Error " . mysqli_error($dbConn)); 

$query = '';

// compose XML

if ($debugMode) {
	$debugInfo = $xmlDoc->createElement('debug_info');
	$xmlRoot->appendChild($debugInfo);
	
	$requestOptions = $xmlDoc->createElement('options');	
	$debugInfo->appendChild($requestOptions);
	$textNode = $xmlDoc->createTextNode($_REQUEST['a']);
	$requestOptions->appendChild($textNode);
}

foreach ($actionArray as $action) {
	switch ($action) {
		case "setuprecord":
			$xmlRoot->appendChild(setUpRecord($dbconn, $ldapConfig, $xmlDoc, $_REQUEST['username']));
			
			break;
		case "getPosts":
			$xmlRoot->appendChild(getPosts($dbConn, $xmlDoc, $_REQUEST['page'], $_REQUEST['sub'], $_REQUEST['user'], $_REQUEST['comments']));
			
			break;
		case "email":
			phpMailer($xmlDoc, $_REQUEST['name'], $_REQUEST['email'], $_REQUEST['subject'], $_REQUEST['msg']);
			
			break;
		case "doesUserExist":
			$xmlRoot->appendChild(doesUserExist($dbconn, $xmlDoc, $_REQUEST['id'], $_REQUEST['user_type']));
			
			break;
		case "addGoogleUser":
			$xmlRoot->appendChild(addGoogleUser($dbconn, $xmlDoc, $_REQUEST['id'], $_REQUEST['name'], $_REQUEST['email'], $_REQUEST['url']));
			
			break;
		case "addPost":
			$xmlRoot->appendChild(addPost($dbconn, $xmlDoc, $_REQUEST['id'], $_REQUEST['title'], $_REQUEST['text'], $_REQUEST['url'], $_REQUEST['sub']));
			
			break;
		case "userInfo":
			$xmlRoot->appendChild(userInfo($dbconn, $xmlDoc, $_REQUEST['id']));
			
			break;
		case "editUsername":
			$xmlRoot->appendChild(editUsername($dbconn, $xmlDoc, $_REQUEST['id'], $_REQUEST['username']));
			
			break;
		case "castVote":
			$xmlRoot->appendChild(castVote($dbconn, $xmlDoc, $_REQUEST['user_id'], $_REQUEST['post_id'], $_REQUEST['vote']));
			
			break;
		case "tallyVotes":
			$xmlRoot->appendChild(tallyVotes($dbconn, $xmlDoc, $_REQUEST['post_id']));
			
			break;
		case "checkForUserVote":
			$xmlRoot->appendChild(checkForUserVote($dbconn, $xmlDoc, $_REQUEST['post_id'], $_REQUEST['user_id']));
			
			break;
		case "addComment":
			$xmlRoot->appendChild(addComment($dbconn, $xmlDoc, $_REQUEST['user_id'], $_REQUEST['post_id'], $_REQUEST['comment']));
			
			break;
		case "getComments":
			$xmlRoot->appendChild(getComments($dbconn, $xmlDoc, $_REQUEST['post_id']));
			
			break;
		case "addNewUser":
			$xmlRoot->appendChild(addNewUser($dbconn, $xmlDoc, $_REQUEST['username'], $_REQUEST['password']));
			
			break;
		case "signIn":
			$xmlRoot->appendChild(signIn($dbconn, $xmlDoc, $_REQUEST['username'], $_REQUEST['password']));
			
			break;
		case "getRep":
			$xmlRoot->appendChild(getRep($dbconn, $xmlDoc, $_REQUEST['username']));
			
			break;
			
		default:

			break; 
	}

}

function sendxhtmlheader($usexml) {
    if ($usexml == 1) {
		//header("Content-Type: application/xhtml+xml; charset=utf-8");
		header("Content-type: text/xml; charset=utf-8");
    } else {
		header("Content-type: text/html; charset=utf-8");
    }
}

function sendpage($page, $usexml) {
    //$xhtmldtd="\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n";
    //$bar=preg_replace('/\n/',$xhtmldtd,$page,1);
    sendxhtmlheader($usexml);
    //print($bar);
	if ($usexml == 0) {
		print('<html><body><pre>' . htmlentities($page) . '</pre></body></html>');
	} else {
		print(trim($page));
	}
}

// close database connection
mysql_close($dbConn);

// save/send the XML document
$xmlString = $xmlDoc->saveXML();

sendpage(trim($xmlString), $usexml);
?>