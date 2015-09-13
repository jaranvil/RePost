/* global Waypoint */
/// <reference path="../../typings/jquery/jquery.d.ts"/>

//  User System  //

$(document).ready(function() {
	$('#create_btn').click(function() {
		createUser();
	});
	
	$('#login_btn_2').click(function() {
		//loginUser();
	});

});

function createUser() {
	var usernameInput = $('#username').val(),
		passwordInput = $('#password').val(),
		passwordInput2 = $('#password2').val();
		
	if (passwordInput == passwordInput2) {
		if (checkForUser(usernameInput)) {
			alert('User already exists');
		} else {
			addNewUser(usernameInput, passwordInput);
		}
	} else {
		alert('Passwords did not match!');
	}

}

function addNewUser(name, pwd) {
	theParams = {
		a: 'addNewUser',
		username: name,
		password: pwd
	}
	
	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: true,
		success: function(xml) {		
			//alert((new XMLSerializer()).serializeToString(xml));	
			signIn($(xml).find('token').text());
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
}

function checkForUser(username) {
	var result;
	
	theParams = {
		a: 'doesUserExist',
		id: username,
		user_type: 'main'
	}
	
	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {		
			//alert((new XMLSerializer()).serializeToString(xml));	
			
			if($(xml).find('records').text() == '0') {
				result = false;
			} else {
				result = true;
			}
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
	return result;
}

function signIn(token) {
	signedIn = true;
	document.cookie = 'repost_token' + "=" + token + "; path=/";
	
	$('#logout_btn').show();
	$('#submitBtn').show();
	$('#login_btn').hide();
	$('#signup_btn').hide();
	$('#sidebar_login').hide();
	$('#sidebar_create').hide();
	
	// Useful data for your client-side scripts:
	// var profile = googleUser.getBasicProfile();
	
	// username = profile.getName();
	// google_id = profile.getId();
	$('#user_data').show();
	userInfo(token);
	getPosts(true);
}

function signOut() {
	$('#logout_btn').hide();
	$('#submitBtn').hide();
	$('#user_data').hide();
	$('#login_btn').show();
	$('#signup_btn').show();
	username = '';
	user_id = 0;
	
	del_cookie('repost_token');
	
	getPosts(true);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function del_cookie(name) {
document.cookie = name +
'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}



