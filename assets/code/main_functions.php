<?php
	
function dbEsc($theString) {
	$theString = mysql_real_escape_string($theString);
	return $theString;
}

function dbError(&$xmlDoc, &$xmlNode, $theMessage) {
	$errorNode = $xmlDoc->createElement('mysqlError', $theMessage);
	$xmlNode->appendChild($errorNode);
}

function createToken($user_id) {
	
}

function PHPMailer($xmlDoc, $name, $email, $subject, $message) {
	 require("class.phpmailer.php");
	 $parentNode = $xmlDoc->createElement('status');

    $mail = new PHPMailer();

    $mail->IsSMTP();  // telling the class to use SMTP
    $mail->SMTPAuth   = true; // SMTP authentication
	$mail->SMTPSecure = "tls"; 
    $mail->Host       = "smtp.gmail.com"; // SMTP server
    $mail->Port       = 587; // SMTP Port
    $mail->Username   = "jared314@gmail.com"; // SMTP account username
    $mail->Password   = "lnvfcqnotxajucwy";        // SMTP account password

    $mail->SetFrom('jared314@gmail.com'); // FROM


    $mail->AddAddress('jared314@gmail.com', 'Jared'); // recipient email

    $mail->Subject    = 'Contact Form Submission'; // email subject
    $mail->Body       = 'FROM: ' . $name . " " . $email . " Subject: " . $subject . " Message: " .$message;

    if(!$mail->Send()) {
      $statusNode = $xmlDoc->createElement('mail_status', 0);
      echo 'Mailer error: ' . $mail->ErrorInfo;
    } else {
      echo 'Message has been sent.';
	  $statusNode = $xmlDoc->createElement('mail_status', 1);
    }
	
	$parentNode->appendChild($statusNode);
	
	return $parent;	
}

function getPosts($dbconn, $xmlDoc, $page, $sub, $user, $comments) {
	 $parentNode = $xmlDoc->createElement('posts');
	 
	 $startVal = ($page * 10) - 10;
	 
	 if (!($comments == '')) {
		 $query = "select * from posts where post_id = " . dbEsc($comments);
	 } else {
		 if (!($user == '')) {
			 $query = "select p.* from posts p " .
			 			"inner join users u " .
						 "on p.user_id = u.user_id " .
						 "where u.username = '".$user."' order by date DESC LIMIT ".$startVal.", 10";
		 } else {
			 if ($sub == 1) {
			 	$query = "select * from posts order by date DESC LIMIT ".$startVal.", 10";
			 } else {
				 $query = "select * from posts where section = ".dbEsc($sub)." order by date DESC LIMIT ".$startVal.", 10";
			 }
		 }
	 }
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('activity_status', $query);
		
		dbError($xmlDoc, $parentNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('query_status', 'success');
	}
	
	
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {		
		
		$query2 = "SELECT username FROM users WHERE user_id = " . $row['user_id'];
		$result2 = mysql_query($query2);
		$row2 = mysql_fetch_array($result2, MYSQL_ASSOC);
		
		$query3 = "SELECT label FROM sections where sub_id = " . $row['section'];
		$result3 = mysql_query($query3);
		$row3 = mysql_fetch_array($result3, MYSQL_ASSOC);

		$query4 = "SELECT count(comment_id) AS 'comment_count' FROM comments where post_id = " . dbEsc($row['post_id']);
		$result4 = mysql_query($query4);
		$row4 = mysql_fetch_array($result4, MYSQL_ASSOC);
		
		if ($row2['username'] == ''){
			$row2['username'] = '[old user system]';
		}
		
		$theChildNode = $xmlDoc->createElement('post');
		$theChildNode->setAttribute('username', $row2['username']);
		$theChildNode->setAttribute('comment_count', $row4['comment_count']);
		$theChildNode->setAttribute('section', $row3['label']);
		$theChildNode->setAttribute('title', $row['title']);
		$theChildNode->setAttribute('text', $row['text']);
		$theChildNode->setAttribute('url', $row['url']);
		$theChildNode->setAttribute('date', $row['date']);
		$theChildNode->setAttribute('post_id', $row['post_id']);
		$parentNode->appendChild($theChildNode);
	}	 

	$parentNode->appendChild($statusNode);
	
	return $parentNode;	
}

function doesUserExist($dbconn, $xmlDoc, $id, $type) {
	$recordDataNode = $xmlDoc->createElement('recorddata');
	
	if($type == 'google') {
		$query = "select * from google_users where google_id = " . $id;
	} else if ($type == 'main') {
		$query = "select * from users where username = '" . dbEsc($id) . "';";
	}
	
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', 'success');
	}
	
	$counter = 0;
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {		
		$counter = $counter + 1;
	}	 
	$statusNode = $xmlDoc->createElement('records', $counter);
	
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}

function addGoogleUser($dbconn, $xmlDoc, $google_id, $name, $email, $image_url) {
	$recordDataNode = $xmlDoc->createElement('recorddata');
	
	$query = "INSERT INTO google_users (google_id, username, name, email, img_url) " .
				"VALUES ('".$google_id."', '" . $name ."', '" . $name . "', '" . $email . "', '" . $image_url . "')";
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', $google_id);
	}
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}

function signIn($dbconn, $xmlDoc, $username, $password) {
	$recordDataNode = $xmlDoc->createElement('recorddata');

	$username = htmlspecialchars($username);
	$password = htmlspecialchars($password);

	$salt = '';
	$query = "select salt from users where username = '".dbEsc($username). "';";	
	$result = mysql_query($query);
	$row = mysql_fetch_array($result, MYSQL_ASSOC);
	$salt = $row['salt'];

	$hash = sha1($salt.$password);
	
	$query2 = "select user_id from users where username = '" . dbEsc($username) . "' AND password = '" . $hash . "';";
	
	$result2 = mysql_query($query2);
	
	if (!($result2)) {
		$statusNode = $xmlDoc->createElement('status', $query2);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', '');
	}

	$row2 = mysql_fetch_array($result2, MYSQL_ASSOC);
	$statusNode = $xmlDoc->createElement('token', $row2['user_id']);	
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}

function addNewUser($dbconn, $xmlDoc, $username, $password) {
	$recordDataNode = $xmlDoc->createElement('userdata');
	
	$username = htmlspecialchars($username);
	$password = htmlspecialchars($password);
	
	$salt = rand().rand().rand().rand();
	$hash = sha1($salt.$password);
	
	$user_id = rand().rand().rand().rand();
	
	$query = "INSERT INTO users (user_id, username, password, salt) " .
				"VALUES ('".$user_id."', '" . $username ."', '" . $hash . "', '" . $salt . "')";
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('token', $user_id);
	}
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}

function addPost($dbconn, $xmlDoc, $user_id, $title, $text, $url, $sub) {
	$recordDataNode = $xmlDoc->createElement('addPost');
	
	$title = htmlspecialchars($title);
	$text = htmlspecialchars($text);
	$url = htmlspecialchars($url);
	$text = nl2br($text);
	
	$query = "INSERT INTO posts (user_id, date, title, text, url, section) " .
				"VALUES ('".dbEsc($user_id)."', NOW(), '" . dbEsc($title) . "', '" . dbEsc($text) . "', '" . dbEsc($url) . "', '" . dbEsc($sub) . "')";
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', 'success');
	}
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}

function userInfo($dbconn, $xmlDoc, $id) {
	$recordDataNode = $xmlDoc->createElement('recorddata');
	
	$query = "select * from users where user_id = " . $id;
  $query2 = "SELECT v.vote " .
            "FROM votes v " .
            "INNER JOIN posts p ON v.post_id = p.post_id " .
            "WHERE p.user_id = " . $id;
  $query3 = "select count(post_id) as posts from posts where user_id = " . $id;
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', 'success');
	}
	
	$row = mysql_fetch_array($result, MYSQL_ASSOC);	
		
	$theChildNode = $xmlDoc->createElement('user');
	$theChildNode->setAttribute('username', $row['username']);
	$recordDataNode->appendChild($theChildNode);
  
  $result2 = mysql_query($query2);
  
  $up = 0;
  $down = 0;
  while ($row2 = mysql_fetch_array($result2, MYSQL_ASSOC)) {
    if ($row2['vote'] == 1) {
      $up = $up + 1;
    }
    if ($row2['vote'] == 0) {
      $down = $down + 1;
    }
  }
	$rep = $up - $down;
  
  $theChildNode = $xmlDoc->createElement('reputation');
	$theChildNode->setAttribute('rep', $rep);
	$recordDataNode->appendChild($theChildNode);
  
  $result3 = mysql_query($query3);
  $row3 = mysql_fetch_array($result3, MYSQL_ASSOC);	
  
  $theChildNode = $xmlDoc->createElement('num_of_posts');
	$theChildNode->setAttribute('num', $row3['posts']);
	$recordDataNode->appendChild($theChildNode);
  
	return $recordDataNode;	
}

function getRep($dbconn, $xmlDoc, $username) {
	$recordDataNode = $xmlDoc->createElement('recorddata');
	
  $query = "SELECT v.vote " .
            "FROM votes v " .
            "INNER JOIN posts p ON v.post_id = p.post_id " .
			"INNER JOIN users u ON p.user_id = u.user_id " .
            "WHERE u.username = '" . dbEsc($username) . "';";
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', 'success');
	}
  
  $up = 0;
  $down = 0;
  while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    if ($row['vote'] == 1) {
      $up = $up + 1;
    }
    if ($row['vote'] == 0) {
      $down = $down + 1;
    }
  }
	$rep = $up - $down;
  
  $theChildNode = $xmlDoc->createElement('reputation');
	$theChildNode->setAttribute('rep', $rep);
	$recordDataNode->appendChild($theChildNode);
  
	return $recordDataNode;	
}

function editUsername($dbconn, $xmlDoc, $id, $username) {
	$recordDataNode = $xmlDoc->createElement('recorddata');
	
	$query = "UPDATE users SET username = '" . dbEsc($username) . "'" .	
			"WHERE user_id = " . $id;
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', 'success');
	}
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}

function castVote($dbconn, $xmlDoc, $user_id, $post_id, $vote) {
	$recordDataNode = $xmlDoc->createElement('votedata');
	
	$query2 = "select * from votes where user_id = " . $user_id . " AND post_id = " . $post_id;
	$result2 = mysql_query($query2);
	$counter = 0;
	while ($row2 = mysql_fetch_array($result2, MYSQL_ASSOC)) {	
		$counter = $counter + 1;	
	}	
	
	if ($counter > 0) {
		$query = "UPDATE votes SET vote = ". $vote . " WHERE user_id = " . $user_id . " AND post_id = " . $post_id;
	} else {
		$query = "INSERT INTO votes (user_id, post_id, vote) " .
				"VALUES ('".$user_id."', '" . $post_id ."', '" . $vote . "')";
	}
	
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', 'vote cast');
	}
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}

function tallyVotes($dbconn, $xmlDoc, $post_id) {
	$recordDataNode = $xmlDoc->createElement('votedata');
	
	$query = "SELECT COUNT(vote) as upvotes FROM votes WHERE post_id = ". $post_id . " AND vote = 1";
	$query2 = "SELECT COUNT(vote) as downvotes FROM votes WHERE post_id = ". $post_id . " AND vote = 0";
	
	$result = mysql_query($query);
	$result2 = mysql_query($query2);

	$row = mysql_fetch_array($result, MYSQL_ASSOC);	
	$row2 = mysql_fetch_array($result2, MYSQL_ASSOC);	
	
	$theChildNode = $xmlDoc->createElement('post');
	$theChildNode->setAttribute('upvotes', $row['upvotes']);
	$theChildNode->setAttribute('downvotes', $row2['downvotes']);

	$recordDataNode->appendChild($theChildNode);

	return $recordDataNode;	
}

function checkForUserVote($dbconn, $xmlDoc, $post_id, $user_id) {
	 $parentNode = $xmlDoc->createElement('vote_record');
	 $query = "select * from votes where user_id = " . $user_id . " AND post_id = " . $post_id;
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('activity_status', $query);
		
		dbError($xmlDoc, $parentNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('query_status', 'success');
	}
	
	$counter = 0;
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {	
		$counter = $counter + 1;	
		$theChildNode = $xmlDoc->createElement('vote');
		$theChildNode->setAttribute('val', $row['vote']);
		$parentNode->appendChild($theChildNode);
	}	 
	
	if ($counter == 0) {
		$theChildNode = $xmlDoc->createElement('vote');
		$theChildNode->setAttribute('val', 'none');
		$parentNode->appendChild($theChildNode);
	}
	
	$theChildNode = $xmlDoc->createElement('inputs');
		$theChildNode->setAttribute('user', $user_id);
		$theChildNode->setAttribute('post', $post_id);
		$parentNode->appendChild($theChildNode);
	
	$parentNode->appendChild($statusNode);
	
	return $parentNode;	
}

function addComment($dbconn, $xmlDoc, $user_id, $post_id, $comment) {
	$recordDataNode = $xmlDoc->createElement('addComment');
	
	$comment = htmlspecialchars($comment);
	$comment = nl2br($comment);
	
	$query = "INSERT INTO comments (post_id, user_id, comment, date) " .
				"VALUES (".dbEsc($post_id).", '".dbEsc($user_id)."', '" . dbEsc($comment) . "', NOW())";
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('status', $query);
		
		dbError($xmlDoc, $recordDataNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('status', 'success');
	}
	
	$recordDataNode->appendChild($statusNode);
	
	return $recordDataNode;	
}


function getComments($dbconn, $xmlDoc, $post_id) {
	$parentNode = $xmlDoc->createElement('comments');
	 
	$query = "select * from comments where post_id = ".dbEsc($post_id)." order by date DESC";
	
	$result = mysql_query($query);
	
	if (!($result)) {
		$statusNode = $xmlDoc->createElement('getComments_status', $query);
		
		dbError($xmlDoc, $parentNode, mysql_error());
	} else {
		$statusNode = $xmlDoc->createElement('query_status', 'success');
	}
	
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {		
		
		$query2 = "SELECT username FROM users WHERE user_id = " . $row['user_id'];
		$result2 = mysql_query($query2);
		$row2 = mysql_fetch_array($result2, MYSQL_ASSOC);
		
		$theChildNode = $xmlDoc->createElement('comment');
		$theChildNode->setAttribute('username', $row2['username']);
		$theChildNode->setAttribute('comment', $row['comment']);
		$theChildNode->setAttribute('date', $row['date']);
		$parentNode->appendChild($theChildNode);
	}	 
	
	$parentNode->appendChild($statusNode);
	
	return $parentNode;	
}
?>