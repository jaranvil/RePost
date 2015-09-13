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
			<script src="assets/js/comments.js"></script>
			<script src="https://apis.google.com/js/platform.js" async defer></script>
	    
		    
	
	    <link rel="stylesheet" href="assets/css/overlay.css">
	</head>
	<body>

		<!-- Nav -->
			<nav id="nav">
				<a href="http://www.jaredeverett.ca/repost/"><img src="images/repost3_white.png" width="150" style="float:left;margin:5px;margin-left:20px"></a>
				<ul class="container">
					<!--<li><a href="#contact" id="submitBtn">Submit Post</a></li>-->
					
					
					
				</ul>
			</nav>
			<nav id="main_footer">
                <div class="sub_link"><a href="#" class="sub current">All</a></div>
				
                <div class="sub_link"><a href="#" class="sub">News</a></div>
                <div class="sub_link"><a href="#" class="sub">Politics</a></div>
                <div class="sub_link"><a href="#" class="sub">Technology</a></div>
                <div class="sub_link"> <a href="#" class="sub">Science</a></div>
                <div class="sub_link"> <a href="#" class="sub">TV / Movies</a></div>
                <div class="sub_link"> <a href="#" class="sub">Aww</a></div>
                <div class="sub_link"> <a href="#" class="sub">Space</a></div>
                        <!--<ul class="social">
            <li><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
            <li><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>

            <li><a href="#" class="icon fa-linkedin"><span class="label">LinkedIn</span></a></li>


            <li><a href="#" class="icon fa-github"><span class="label">Github</span></a></li>
        </ul>-->
</nav>	
			<div class="wrapper style4" id="submit_post">
				<article id="contact" class="container 75%">
					<header>
						<h2>Submit Post</h2>
					</header>
					<div>
						<div class="row">
							<div class="12u">
								<form method="post" action="#" id="submit_form">
									<div>
										
										<div class="row">
											<div class="12u">
												<input type="text" name="title" id="title" placeholder="Title" />
											</div>
										</div>
										<div class="row">
											<div class="12u">
												<input type="text" name="url" id="url" placeholder="URL" />
											</div>
										</div>
										<div class="row">
											<div class="12u">
												<textarea name="text" id="text" placeholder="Text"></textarea>
											</div>
										</div>
										<div class="row 200%">
											<div class="12u">
												<ul class="actions">
													<li><input type="submit" value="Post" /></li>
													<li><input type="reset" value="Cancel" onClick="hideSubmit()" class="alt" /></li>
												</ul>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
						
					</div>
				</article>
			</div>
			
			<div class="wrapper style3">
				<div class="sidebar">
						<article class="box style2">	
							<a href="http://www.jaredeverett.ca/repost/"><img src="images/repost3.png" width="150"></a>	

							<!--<table>
								<tr>
									<td>
										<div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark" style="margin:10px"></div>
									</td>
									<td>
										<a href="#" onclick="signOut();" id="signoutBtn" style="float:left">Sign out</a>
									</td>
								</tr>
							</table>-->
							
							<div id="welcome">
								<label class="sidebar_header">Welcome to Repost!</label>
								<div style="text-align:left;font-size:14px;line-height: 1.5;padding:10px;color:#000000">
									RePost is a reddit-style social media platform I am building as a web programming exercise. <p>
									At the moment, the site is far from fully functional and contains many bugs. 
								</div>
								<a href="#" class="sidebar_btn" id="login_btn" onClick="">Login</a>
								<a href="#" class="sidebar_btn" id="signup_btn" onClick="">Sign-up</a>
								
							</div>

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
							
							<table width="100%" id="sidebar_login">
								<tr>
									<td><label class="sidebar_header">Login</label></td>
								</tr>
								<tr>
									<td class="sidebar_td" style="width:30%">
										<center>
										<input type="text" class="create_user_input" name="username_login" id="username_login" placeholder="Username" />
										</center>
									</td>

								</tr>
								<tr>
									<td class="sidebar_td">
										<center>
										<input type="password" class="create_user_input" name="password_login" id="password_login" placeholder="password" />
										</center>									
									</td>

								</tr>
								<tr>
									<td>
										<a href="#" class="sidebar_btn_form" id="login_btn_2" onClick="">Login</a>
									</td>
							</table>
							
							<table width="100%" id="sidebar_create">
								<tr>
									<td><label class="sidebar_header">Create Account</label></td>
								</tr>
								<tr>
									<td class="sidebar_td" style="width:30%">
										<center>
										<input type="text" class="create_user_input" name="username" id="username" placeholder="Username" />
										</center>
									</td>

								</tr>
								<tr>
									<td class="sidebar_td">
										<center>
										<input type="password" class="create_user_input" name="password" id="password" placeholder="password" />
										</center>									
									</td>

								</tr>
								<tr>
									<td class="sidebar_td">
										<center>
										<input type="password" class="create_user_input" name="password2" id="password2" placeholder="verify password" />
										</center>
									</td>
								</tr>
								<tr>
									<td>
										<a href="#" class="sidebar_btn_form" id="create_btn" onClick="">Create Account</a>
									</td>
							</table>
							
							<a href="#" class="sidebar_btn" id="viewSubmit" onClick="showSubmit()">Submit Post</a><p>
							<a href="#" class="sidebar_btn" id="logout_btn" onClick="signOut()">Log-out</a>
						</article>
				</div>
				
				<ul class="post">

										
				</ul>
				
				<div id="comment_box">
					<textarea rows="3" cols="50" id="comment_textarea" placeholder="Enter your comment"></textarea>
				</div>
					<a href="#" class="comment_btn">Save</a>
				<p>&nbsp;<p>
				<ul class="comment_section">
					
				</ul>


	</body>
</html>