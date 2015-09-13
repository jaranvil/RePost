/* global Waypoint */
/// <reference path="../../typings/jquery/jquery.d.ts"/>

//Gobal Variables 
var signedIn = false,
	user_id = '',
	username = '',
	page = 1,
	sub = 1,
	prev_post_total = 0,
	end_of_posts = false,
	loading_new_posts = false;
	monthNames = ["January", "February", "March", "April", "May", "June",
				  "July", "August", "September", "October", "November", "December"
				];

function initPage() {
	var urlPageVal = getUrlVars()["page"];
	if (urlPageVal != undefined) {
		page = parseInt(urlPageVal);
	} 
	var urlSubVal = getUrlVars()["sub"];
	if (urlSubVal != undefined) {
		sub = parseInt(urlSubVal);
	} 
	
	$('#sub'+sub).addClass('current');
	
	getPosts(true);
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
				$('#title').val('');
				$('#url').val('');
				$('#text').val('');
				getPosts(true);
			}
			
		}
	 });
	 

	// endless scrolling
		var timer;
		$(window).scroll(function () {
			if (!loading_new_posts) {
				clearTimeout(timer);
			    timer = setTimeout(function() {
			        if (isScrolledIntoView($('#bottom'))) {
						loading_new_posts = true;
						page += 1;
			            getPosts(false);
			            return false;
			        }
			    }, 50);
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
// 		id: profile.getId(),
// 		user_type: 'google'
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
// 	getPosts(true);
// }

function getPosts(clear) {
	if(!end_of_posts) {
		

	if(clear) {
		$('.submissions').empty();
	}
	
	var template,
		page_controls,
		page_header,
		$blankActivity,
		theParams = {
				a: 'getPosts',
				page: page,
				sub: sub,
				user: '',
				comments: ''
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
			
			$.ajax({
				type: 'GET', 
				url: 'page_header.html', 
				async: false, 
				contentType   :  'text/html',
          		dataType      :  'html',
				success: function(theHtml) {
					page_header = theHtml;
				}
			}); 
			
			if(!clear) {
				prev_post_total = $('.submissions li').length;
				page_controls = page_controls.replace('[pagenum]', 'Page '+page);
				$('.submissions').append(page_controls);
			} else {
				page_header = page_header.replace('[title]', 'Frontpage');
				$('.submissions').append(page_header);
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
			
			if(($('.submissions li').length) < prev_post_total + 2) {
				end_of_posts = true;
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
				page_controls = page_controls.replace('[pagenum]', "There's nothing else here");
				$('.submissions').append(page_controls);
				$('#bottom').hide();
			}
			
			
			 $( ".upVote" ).click(function(e) {
			     e.preventDefault();
				if (!(user_id == 0)) {
					var post_id = $(this).siblings('.post_id').text();
				  var theParams = {
						a: 'castVote',
						post_id: post_id,
						user_id: user_id,
						vote: 1
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
					
					if (!($(this).parents().eq(2).find('#upvote').attr('src') == 'images/up_color.png')) {
						$(this).parents().eq(2).find('#upvote').attr('src', 'images/up_color.png');
						$(this).parents().eq(2).find('#downvote').attr('src', 'images/down.png');
						var votes = parseInt($(this).parents().eq(2).find('#votecount').text());
						votes += 1;
						$(this).parents().eq(2).find('#votecount').text(votes);
					} 

				}  else {
					alert('You must sign in to vote');
				}
			});
			
		$(".downVote").click(function (e) {
			     e.preventDefault();

		if (!(user_id == 0)) {
			var post_id = $(this).siblings('.post_id').text();
		  var theParams = {
				a: 'castVote',
				post_id: post_id,
				user_id: user_id,
				vote: 0
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
	
			if (!($(this).parents().eq(2).find('#downvote').attr('src') == 'images/down_color.png')) {
				$(this).parents().eq(2).find('#upvote').attr('src', 'images/up.png');
				$(this).parents().eq(2).find('#downvote').attr('src', 'images/down_color.png');
				var votes = parseInt($(this).parents().eq(2).find('#votecount').text());
				votes -= 1;
				$(this).parents().eq(2).find('#votecount').text(votes);
			}
		}  else {
			alert('You must sign in to vote');
		}
	
	});
	
	}
	
	setTimeout(function(){ loading_new_posts = false; }, 2000);
 	
	
}

function addUser(id, name, email, url) {
	theParams = {
		a: 'addGoogleUser',
		id: id,
		name: name,
		email: email,
		url: url
	}

	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {		
			//alert('new user added');	
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
}

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
	
	var newUser = $('#newUsername').val();
	
	theParams = {
		a: 'doesUserExist',
		id: newUser,
		user_type: 'main'
	}
	
	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {		
			if($(xml).find('records').text() == '0') {
				theParams = {
					a: 'editUsername',
					id: user_id,
					username: newUser
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
			} else {
				alert('Username already taken.');
			}
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
	
	
}

function addPost(template, data) {

	var title = $(data).attr('title'),
		text = $(data).attr('text'),
		url = $(data).attr('url'),
		date = $(data).attr('date'),
		user = $(data).attr('username'),
		comment_count = $(data).attr('comment_count'),
		post_id = $(data).attr('post_id'),
		section = $(data).attr('section'),
		rep,
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
	
	//get OPs rep
	theParams = {
		a: 'getRep',
		username: user
	}

	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: false,
		success: function(xml) {	
			//alert((new XMLSerializer()).serializeToString(xml));		
		    rep = $(xml).find('reputation').attr('rep');
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
	template = template.replace('[user]', user + " ("+rep+" rep)");
	template = template.replace('[date]', monthNames[month-1] + " " + day);
	template = template.replace('[post_id2]', post_id);
	template = template.replace('[post_id]', post_id);
	template = template.replace('[votes]', vote_net);
	template = template.replace('[section]', section);
	template = template.replace('[comments]', "<a href='http://www.jaredeverett.ca/repost/comments.php?post="+post_id+"' class='comment_link'>comments ("+comment_count+")</a>");
	
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
	
	if (user == username) {
		template = template.replace('[remove]', '<a href="" class="comment_link" onClick="removePost("test")">remove post</a>');
	} else {
		template = template.replace('[remove]', '');
	}
	
	$('.submissions').append(template);

}

function removePost(test) {
	if (confirm('Are you sure?')) {
	    alert(test);
	} else {
	    // Do nothing!
	}
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

// http://stackoverflow.com/questions/19561574/scrolling-to-bottom-of-page-run-function-function-runs-too-many-times
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();


    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));

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

