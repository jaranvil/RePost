<!DOCTYPE HTML>
<html>
	<head>
		<title>Jared Everett</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="google-signin-client_id" content="88589377536-5anj72ddache2b1bn6q8cajnuh6afqlb.apps.googleusercontent.com">
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
		<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
		
		<!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/jquery.scrolly.min.js"></script>
			<script src="assets/js/skel.min.js"></script>
			<script src="assets/js/skel-viewport.min.js"></script>
			<script src="assets/js/util.js"></script>
			<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
			<script src="assets/js/main.js"></script>
			<script src="http://code.jquery.com/jquery-latest.min.js"></script>
			<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
			<script src="assets/js/user.js"></script>
			<script src="https://apis.google.com/js/platform.js" async defer></script>
	    
	    <link rel="stylesheet" href="assets/css/overlay.css">
	</head>
	<body>

		<!-- Nav -->
			<nav id="nav">
				<img src="images/repost3_white.png" width="150" style="float:left;margin:5px;margin-left:20px">
				<ul class="container">
					<!--<li><a href="#contact" id="submitBtn">Submit Post</a></li>-->
					
					
					
				</ul>
			</nav>
			<nav id="main_footer">
				
                <!--<div class="sub_link"><a href="#" class="sub" id="sub2">Submitted</a></div>-->
              
			</nav>
	
			
			
			<div class="wrapper style3">
				<div class="sidebar">
						<article class="box style2">	
							<a href="http://www.jaredeverett.ca/repost"><img src="images/repost3.png" width="150"></a>		

						
							<h3 id="user_title"></h3>
							
							<table width="100%" id="user_data">
								<tr>
									<td colspan="2"><label class="sidebar_header">Your Account</label></td>
								</tr>
								<tr>
									<td class="sidebar_td" style="width:30%">
										Username: 
									</td>
									<td class="sidebar_td">
										<span id="sidebar_username"></span> <a href="#" onClick="editUsername()">edit</a>
										<div class="username_mouseover">
											<input type="text" name="newUsername" id="newUsername" placeholder="New username" /><br>
											<a href="#" onClick="changeUsername()">Save</a>
											<a href="#" onClick="hideUserMouseOver()">Cancel</a>
										</div>
									</td>
								</tr>
								<tr>
									<td class="sidebar_td">
										Reputation:
									</td>
									<td class="sidebar_td">
										<span id="rep_val"></span>
									</td>
								</tr>
								<tr>
									<td class="sidebar_td">
										Posts:
									</td>
									<td class="sidebar_td">
										<span id="post_num"></span>
									</td>
								</tr>
							</table>
							<table>
								<tr>
									<td>
										<div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark" style="margin:10px"></div>
									</td>
									<td>
										<a href="#" onclick="signOut();" id="signoutBtn" style="float:left">Sign out</a>
									</td>
								</tr>
							</table>
							<a href="#" class="sidebar_btn" id="viewSubmit" onClick="showSubmit()">Submit Post</a><p>
							<a href="#" class="sidebar_btn" id="viewSubmit" onClick="dialogTest()">Another Button</a>
						</article>
				</div>
				
				<ul class="submissions">
					

				</ul>
			
				
	</body>
</html>