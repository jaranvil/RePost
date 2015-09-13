/* global Waypoint */
/// <reference path="../../typings/jquery/jquery.d.ts"/>

//Gobal Variables 
var signedIn = false,
	user_id = '',
	username = '',
	post = 0,
	monthNames = ["January", "February", "March", "April", "May", "June",
				  "July", "August", "September", "October", "November", "December"
				];

function initPage() {
	var urlPageVal = getUrlVars()["post"];
	if (urlPageVal != undefined) {
		post = parseInt(urlPageVal);
	} 
	

	$('#signoutBtn').hide();
	$('#submitBtn').hide();
	$('#submit_post').hide();
	$('.username_mouseover').hide();
	$('#user_data').hide();
	$('#sidebar_login').hide();
	$('#sidebar_signup').hide();
	$('#sidebar_create').hide();
	$('#viewSubmit').hide();
	$('#logout_btn').hide();
	
	user_id = getCookie('repost_token');
	if (user_id.length > 1) {
		signIn(user_id);
	}
	
	 $("#submit_form").submit(function(event) {
		event.preventDefault();
					
		if (username == '') {
			alert('You must sign in to submit post.');
		} else {
			var title = $('#title').val(),
				url = $('#url').val(),
				text = $('#text').val(),
				sub_choice = $('#sub_select').val();
				
			if (title == '') {
				alert('Title Required');
			} else {
				sendNewPost(title, url, text, sub_choice);
				//$('#submit_post').trigger("reset");
				// $('#submit_post').reset();
				$('#submit_post').hide(250);
				$('#main_footer').show();
				
			}
			
		}
	 });
	 

		 
	 getPosts(true);
	 getComments(true);
	 
	 $('.comment_btn').click(function() {
		 if (user_id == 0) {
			 alert('You must sign in to comment.');
		 } else {
			  var theParams = {
				a: 'addComment',
				user_id: user_id,
				post_id: post,
				comment: $('#comment_textarea').val()
			}
		
			$.ajax({
				type: "POST",
				url: "assets/code/main.php",
				data: theParams, 
				dataType: 'xml', 
				async: false,
				success: function(xml) {		
					$('#comment_textarea').val('');
					getComments(true);
				},
				error: function(xhr) {
				  alert(xhr.responseText);
				}
			});
		 }
		 
		
	 });
	 
	 $('#login_btn').click(function() {
		$('#sidebar_login').show('slow');
		$('#sidebar_create').hide();
	});
	
	$('#signup_btn').click(function() {
		$('#sidebar_create').show('slow');
		$('#sidebar_login').hide();
	});

	$('#create_btn').click(function() {
		createUser();
	});
	
	$('#login_btn_2').click(function() {
		loginUser();
	});
	 
	 
	 
	 // mouseover vote arrows

	//  $("#upvote").each(function () {
	//      $(this).hover(function () {
	//          $(this).attr("src", 'images/up_color.png');
	//      });
    //     $(this).mouseout(function () {
    //         $(this).attr("src", 'images/up.png');
    //     });
	//  });
       

	//  $("#downvote")
    //       .mouseover(function () {
    //           $(this).attr("src", 'images/down_color.png');
    //       })
    //       .mouseout(function () {
    //           $(this).attr("src", 'images/down.png');
    //       });
}

function sendNewPost(title, url, text, sub_choice) {
	var theParams = {
		a: 'addPost',
		title: title,
		url: url,
		text: text,
		id: user_id,
		sub: sub_choice
	}

	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {		
			//alert((new XMLSerializer()).serializeToString(xml));	
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
}

// function onSignIn(googleUser) {
// 	signedIn = true;
// 	$('#signoutBtn').show();
// 	$('#submitBtn').show();
	
// 	// Useful data for your client-side scripts:
// 	var profile = googleUser.getBasicProfile();
	
// 	username = profile.getName();
// 	google_id = profile.getId();
// 	$('#user_data').show();
	
// 	console.log("ID: " + profile.getId()); // Don't send this directly to your server!
// 	console.log("Name: " + profile.getName());
// 	console.log("Image URL: " + profile.getImageUrl());
// 	console.log("Email: " + profile.getEmail());
	
// 	// The ID token you need to pass to your backend:
// 	var id_token = googleUser.getAuthResponse().id_token;
// 	console.log("ID Token: " + id_token);
	
	
// 	theParams = {
// 		a: 'doesUserExist',
// 		id: profile.getId()	
// 	}
	
// 	$.ajax({
// 		type: "POST",
// 		url: "assets/code/main.php",
// 		data: theParams, 
// 		dataType: 'xml', 
// 		async: true,
// 		success: function(xml) {		
// 			//alert((new XMLSerializer()).serializeToString(xml));	
// 			if($(xml).find('records').text() == '0') {
// 				addUser(profile.getId(), profile.getName(), profile.getEmail(), profile.getImageUrl());	
// 			} else {
// 				//alert('logged in');
// 				userInfo(google_id);
				
// 			}
// 		},
// 		error: function(xhr) {
// 		  alert(xhr.responseText);
// 		}
// 	});
	
// 	getPosts(true);
// }

//  function signOut() {
// 	var auth2 = gapi.auth2.getAuthInstance();
// 	auth2.signOut().then(function () {
// 	  $('#signoutBtn').hide();
// 	  $('#submitBtn').hide();
// 	  username = '';
// 		google_id = '';
// 		$('#user_data').hide();
// 	});

// }



// function addUser(id, name, email, url) {
// 	theParams = {
// 		a: 'addUser',
// 		id: id,
// 		name: name,
// 		email: email,
// 		url: url
// 	}

// 	$.ajax({
// 		type: "POST",
// 		url: "assets/code/main.php",
// 		data: theParams, 
// 		dataType: 'xml', 
// 		async: false,
// 		success: function(xml) {		
// 			//alert('new user added');	
// 		},
// 		error: function(xhr) {
// 		  alert(xhr.responseText);
// 		}
// 	});
// }

function userInfo(id) {

	theParams = {
		a: 'userInfo',
		id: id
	}

	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {		
		    $('#sidebar_username').text($(xml).find('user').attr('username'));
			username = $(xml).find('user').attr('username');
		    $('#rep_val').text($(xml).find('reputation').attr('rep'));
		    $('#post_num').text($(xml).find('num_of_posts').attr('num'));
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
}

function changeUsername() {
	theParams = {
		a: 'editUsername',
		id: user_id,
		username: $('#newUsername').val()
	}
	
	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {		
			$('.username_mouseover').hide();
			userInfo(user_id);
			$('#newUsername').val('');
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
}

function getPosts(clear) {
	if(clear) {
		$('.post').empty();
	}
	
	var template,
		page_controls,
		$blankActivity,
		theParams = {
				a: 'getPosts',
				page: '',
				sub: '',
				user: '',
				comments: post
			};
			
			$.ajax({
				type: 'GET', 
				url: 'page_control.html', 
				async: false, 
				contentType   :  'text/html',
          		dataType      :  'html',
				success: function(theHtml) {
					page_controls = theHtml;
				}
			}); 
			
			if(!clear) {
				prev_post_total = $('.submissions li').length;
				page_controls = page_controls.replace('[pagenum]', 'Page '+page);
				$('.submissions').append(page_controls);
			}	
			
			$.ajax({
				type: 'GET', 
				url: 'post_template.html', 
				async: false, 
				contentType   :  'text/html',
          		dataType      :  'html',
				success: function(theHtml) {
					template = theHtml;
				}
			}); 
			
			$.ajax({
				type: "POST",
				url: "assets/code/main.php",
				data: theParams, 
				dataType: 'xml', 
				async: false,
				success: function(xml) {
					//alert((new XMLSerializer()).serializeToString(xml));	
					$(xml).find('post').each(function(){
						addPost(template, $(this));
					});
				},
				error: function(xhr) {
				  alert(xhr.responseText);
				}
			});	
			$('.post_id').hide();
			
			
	// 		 $( ".upVote" ).click(function(e) {
	// 		     e.preventDefault();
	// 			if (!(google_id == 0)) {
	// 				var post_id = $(this).siblings('.post_id').text();
	// 			  var theParams = {
	// 					a: 'castVote',
	// 					post_id: post_id,
	// 					user_id: google_id,
	// 					vote: 1
	// 				}
				
	// 				$.ajax({
	// 					type: "POST",
	// 					url: "assets/code/main.php",
	// 					data: theParams, 
	// 					dataType: 'xml', 
	// 					async: false,
	// 					success: function(xml) {		
	// 						//alert((new XMLSerializer()).serializeToString(xml));	
	// 					},
	// 					error: function(xhr) {
	// 					  alert(xhr.responseText);
	// 					}
	// 				});
					
	// 				$(this).parents().eq(2).find('#upvote').attr('src', 'images/up_color.png');
	// 				$(this).parents().eq(2).find('#downvote').attr('src', 'images/down.png');
	// 				var votes = parseInt($(this).parents().eq(2).find('#votecount').text());
	// 				votes += 1;
	// 				$(this).parents().eq(2).find('#votecount').text(votes);
					
	// 			}  else {
	// 				alert('You must sign in to vote');
	// 			}
	// 		});
			
	// 	$(".downVote").click(function (e) {
	// 		     e.preventDefault();

	// 	if (!(google_id == 0)) {
	// 		var post_id = $(this).siblings('.post_id').text();
	// 	  var theParams = {
	// 			a: 'castVote',
	// 			post_id: post_id,
	// 			user_id: google_id,
	// 			vote: 0
	// 		}
		
	// 		$.ajax({
	// 			type: "POST",
	// 			url: "assets/code/main.php",
	// 			data: theParams, 
	// 			dataType: 'xml', 
	// 			async: false,
	// 			success: function(xml) {		
	// 			    //alert((new XMLSerializer()).serializeToString(xml));	
				  
	// 			},
	// 			error: function(xhr) {
	// 			  alert(xhr.responseText);
	// 			}
	// 		});
	
	// 		$(this).parents().eq(2).find('#upvote').attr('src', 'images/up.png');
	// 		$(this).parents().eq(2).find('#downvote').attr('src', 'images/down_color.png');
	// 		var votes = parseInt($(this).parents().eq(2).find('#votecount').text());
	// 		votes -= 1;
	// 		$(this).parents().eq(2).find('#votecount').text(votes);
	// 	}  else {
	// 		alert('You must sign in to vote');
	// 	}
	
	// });
	
	
}


function addPost(template, data) {

	var title = $(data).attr('title'),
		text = $(data).attr('text'),
		url = $(data).attr('url'),
		date = $(data).attr('date'),
		username = $(data).attr('username'),
		post_id = $(data).attr('post_id'),
		section = $(data).attr('section'),
		upvotes = 0,
		downvotes = 0;
	
	
	// ensure valid URL
	var prefix = 'http://';
	if ((url.substr(0, prefix.length) !== prefix) && (url.substr(0, prefix.length) !== 'https:/'))
	{
	    url = prefix + url;
	}
	
	// post age
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var posted = new Date(date);
	var now = new Date();
	var days = Math.round(Math.abs((posted.getTime() - now.getTime())/(oneDay)));
	
	var month = posted.getUTCMonth() + 1; //months from 1-12
	var day = posted.getUTCDate();
	var year = posted.getUTCFullYear();

	
	// if (days == 1) {
	// 	$(theSelector).find('.admin_activity_header_status').text(days+" day ago");	
	// } else if (days == 0) {
	// 	$(theSelector).find('.admin_activity_header_status').text("Today");
	// } else {
	// 	$(theSelector).find('.admin_activity_header_status').text(days+" days ago");	
	// }
	
	//var trimmedText = text.substring(0, 150) + '...';
	
	
	// Get vote counts
	theParams = {
		a: 'tallyVotes',
		post_id: post_id
	}
	
	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {		
			upvotes = parseInt($(xml).find('post').attr('upvotes'));
			downvotes = parseInt($(xml).find('post').attr('downvotes'));
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
	
	// Check if user has voted for this post
	if (!(user_id == 0)) {
		
		theParams = {
			a: 'checkForUserVote',
			post_id: post_id,
			user_id: user_id
		}
	
		$.ajax({
			type: "POST",
			url: "assets/code/main.php",
			data: theParams, 
			dataType: 'xml', 
			async: false,
			success: function(xml) {		
				//alert((new XMLSerializer()).serializeToString(xml));	
				if ($(xml).find('vote').attr('val') == 1) {
					template = template.replace('up.png', 'up_color.png');
				}
				if ($(xml).find('vote').attr('val') == 0) {
					template = template.replace('down.png', 'down_color.png');
				}
			},
			error: function(xhr) {
			  alert(xhr.responseText);
			}
		});
	
	}
	
	
	var vote_net = upvotes - downvotes;
	
	template = template.replace('[title]', title);
	template = template.replace('[text]', text);
	template = template.replace('[user]', username);
	template = template.replace('[date]', monthNames[month-1] + " " + day);
	template = template.replace('[post_id2]', post_id);
	template = template.replace('[post_id]', post_id);
	template = template.replace('[votes]', vote_net);
	template = template.replace('[section]', section);
	
	if (url == '') {
		template = template.replace('[link]', '');
		template = template.replace('[link_end]', '');
		template = template.replace('[domain]', '');
	} else {
		template = template.replace('[link]', '<a href="'+url+'">');
		template = template.replace('[link_end]', '</a>');
		template = template.replace('[domain]', extractDomain(url));
	}
	
	if (!(url.match(/\.(jpeg|jpg|gif|png)$/) != null)) {
		template = template.replace('<div class="post_thumbnail">[link2]<img src="[thumbnail]" style="width:100px;height:100px">[link_end2]</div>', '');	
	} else {
		template = template.replace('[thumbnail]', url);
		template = template.replace('[link2]', '<a href="'+url+'">');
		template = template.replace('[link_end2]', '</a>');
	}
	
	$('.post').append(template);
	//$('.submissions').find('.submission').hide();
}

function getComments(clear) {
	if(clear) {
		$('.comment_section').empty();
	}
	
	var template,
		page_controls,
		$blankActivity,
		theParams = {
				a: 'getComments',
				post_id: post
			};		
			
			$.ajax({
				type: 'GET', 
				url: 'comment_template.html', 
				async: false, 
				contentType   :  'text/html',
          		dataType      :  'html',
				success: function(theHtml) {
					template = theHtml;
					
				}
			}); 
			
			$.ajax({
				type: "POST",
				url: "assets/code/main.php",
				data: theParams, 
				dataType: 'xml', 
				async: false,
				success: function(xml) {
					//alert((new XMLSerializer()).serializeToString(xml));	
					$(xml).find('comment').each(function(){
						addComment(template, $(this));
					});
				},
				error: function(xhr) {
				  alert(xhr.responseText);
				}
			});	
			$('.post_id').hide();
			
			
		// 	 $( ".upVote" ).click(function(e) {
		// 	     e.preventDefault();
		// 		if (!(google_id == 0)) {
		// 			var post_id = $(this).siblings('.post_id').text();
		// 		  var theParams = {
		// 				a: 'castVote',
		// 				post_id: post_id,
		// 				user_id: google_id,
		// 				vote: 1
		// 			}
				
		// 			$.ajax({
		// 				type: "POST",
		// 				url: "assets/code/main.php",
		// 				data: theParams, 
		// 				dataType: 'xml', 
		// 				async: false,
		// 				success: function(xml) {		
		// 					//alert((new XMLSerializer()).serializeToString(xml));	
		// 				},
		// 				error: function(xhr) {
		// 				  alert(xhr.responseText);
		// 				}
		// 			});
					
		// 			$(this).parents().eq(2).find('#upvote').attr('src', 'images/up_color.png');
		// 			$(this).parents().eq(2).find('#downvote').attr('src', 'images/down.png');
		// 			var votes = parseInt($(this).parents().eq(2).find('#votecount').text());
		// 			votes += 1;
		// 			$(this).parents().eq(2).find('#votecount').text(votes);
					
		// 		}  else {
		// 			alert('You must sign in to vote');
		// 		}
		// 	});
			
		// $(".downVote").click(function (e) {
		// 	     e.preventDefault();

		// if (!(google_id == 0)) {
		// 	var post_id = $(this).siblings('.post_id').text();
		//   var theParams = {
		// 		a: 'castVote',
		// 		post_id: post_id,
		// 		user_id: google_id,
		// 		vote: 0
		// 	}
		
		// 	$.ajax({
		// 		type: "POST",
		// 		url: "assets/code/main.php",
		// 		data: theParams, 
		// 		dataType: 'xml', 
		// 		async: false,
		// 		success: function(xml) {		
		// 		    //alert((new XMLSerializer()).serializeToString(xml));	
				  
		// 		},
		// 		error: function(xhr) {
		// 		  alert(xhr.responseText);
		// 		}
		// 	});
	
			// $(this).parents().eq(2).find('#upvote').attr('src', 'images/up.png');
			// $(this).parents().eq(2).find('#downvote').attr('src', 'images/down_color.png');
			// var votes = parseInt($(this).parents().eq(2).find('#votecount').text());
			// votes -= 1;
			// $(this).parents().eq(2).find('#votecount').text(votes);
		// }  else {
		// 	alert('You must sign in to vote');
		// }
	
	// });
	
	
}

function addComment(template, data) {

	var username = $(data).attr('username'),
		comment = $(data).attr('comment'),
		date = $(data).attr('date');

	template = template.replace('[comment]', comment);
	template = template.replace('[user]', username);
	template = template.replace('[date]', date);
	
	$('.comment_section').append(template);
	//$('.submissions').find('.submission').hide();
}

function nextPage() {
	var newPage = page += 1;
	var	url = '/repost/index.php?sub='+sub+'&page=' + newPage;
	window.location.href = url;
}

function prevPage() {
	var newPage = page - 1;
	var	url = '/repost/index.php?sub='+sub+'&page=' + newPage;
	window.location.href = url;
}

function intiPageControls() {
	$('#page_num').text('Page '+page);
	if (page < 2) {
		$('#prevPageBtn').hide();
	}
}

function showSubmit() {
	if (username == '') {
		alert('You must sign in before you can post.');
	} else {
		window.scrollTo(0,0);
		$('#main_footer').hide();
		$('#submit_post').show(500);
		
	}
}

function hideSubmit() {
	$('#main_footer').show();
	$('#submit_post').hide(500);
}

function hideUserMouseOver() {
	$('.username_mouseover').hide();
	$('#newUsername').val('');
}

function editUsername() {
	$('.username_mouseover').show();
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
	});
	return vars;
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

//  User System  //

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
			$('#sidebar_create').hide();
			//alert((new XMLSerializer()).serializeToString(xml));	
			signIn($(xml).find('token').text());
			
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
}

function loginUser() {
	var username_input = $('#username_login').val(),
		password_input = $('#password_login').val();
		
		$('#username_login').val('');
		$('#password_login').val('');
	
	theParams = {
		a: 'signIn',
		username: username_input,
		password: password_input
	}
	
	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: true,
		success: function(xml) {		
			//alert((new XMLSerializer()).serializeToString(xml));	
			var token = $(xml).find('token').text();
			if (token.length > 0) {
				signIn(token);
			} else {
				alert('Username and password combination not found.');
			}
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
}

function signIn(token) {
	signedIn = true;
	document.cookie = 'repost_token' + "=" + token + "; path=/";
	user_id = token; 
	
	$('#logout_btn').show();
	$('#submitBtn').show();
	$('#viewSubmit').show();
	$('#login_btn').hide();
	$('#signup_btn').hide();
	$('#sidebar_login').hide();
	
	
	// Useful data for your client-side scripts:
	// var profile = googleUser.getBasicProfile();
	
	// username = profile.getName();
	// google_id = profile.getId();
	$('#user_data').show();
	userInfo(token);
	getPosts(true);
}

function signOut() {
	signedIn = false;
	$('#logout_btn').hide();
	$('#submitBtn').hide();
	$('#viewSubmit').hide();
	$('#user_data').hide();
	$('#login_btn').show();
	$('#signup_btn').show();
	username = '';
	user_id = 0;
	
	del_cookie('repost_token');

	
	getPosts(true);
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

$(document).ready(function() {
	initPage();
});

