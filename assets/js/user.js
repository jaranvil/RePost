/// <reference path="../../typings/jquery/jquery.d.ts"/>

//Gobal Variables 
var signedIn = false,
	google_id = 0,
	username = '',
	user_username = '',
	page = 1,
	sub = 1;
	monthNames = ["January", "February", "March", "April", "May", "June",
				  "July", "August", "September", "October", "November", "December"
				];

function initPage() {
	var urlPageVal = getUrlVars()["page"];
	if (urlPageVal != undefined) {
		page = parseInt(urlPageVal);
	} 
	var urlUserVal = getUrlVars()["user"];
	if (urlUserVal != undefined) {
		user_username = urlUserVal;
	} 
	
	$('#sub'+sub).addClass('current');
	
	getPosts();
	$('#signoutBtn').hide();
	$('#submitBtn').hide();
	$('.sidebar').hide();
	$('#submit_post').hide();
	$('.username_mouseover').hide();
	$('#user_data').hide();
	$('#user_title').text(user_username);

	$('.submission').each(function() {
		$(this).show(500);
	});
	$('.sidebar').show(500);
	
	 $("#submit_form").submit(function(event) {
		event.preventDefault();
					
		if (username == '') {
			alert('You must sign in to submit post.');
		} else {
			var title = $('#title').val(),
				url = $('#url').val(),
				text = $('#text').val();
			
			if (title == '') {
				alert('Title Required');
			} else {
				sendNewPost(title, url, text);
				$('#submit_post').trigger("reset");
				$('#submit_post').hide(250);
				getPosts();
			}
			
		}
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

function sendNewPost(title, url, text) {
	var theParams = {
		a: 'addPost',
		title: title,
		url: url,
		text: text,
		id: google_id
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

function onSignIn(googleUser) {
	signedIn = true;
	$('#signoutBtn').show();
	$('#submitBtn').show();
	
	// Useful data for your client-side scripts:
	var profile = googleUser.getBasicProfile();
	
	username = profile.getName();
	google_id = profile.getId();
	$('#user_data').show();
	
	console.log("ID: " + profile.getId()); // Don't send this directly to your server!
	console.log("Name: " + profile.getName());
	console.log("Image URL: " + profile.getImageUrl());
	console.log("Email: " + profile.getEmail());
	
	// The ID token you need to pass to your backend:
	var id_token = googleUser.getAuthResponse().id_token;
	console.log("ID Token: " + id_token);
	
	
	theParams = {
		a: 'doesUserExist',
		id: profile.getId()	
	}
	
	$.ajax({
		type: "POST",
		url: "assets/code/main.php",
		data: theParams, 
		dataType: 'xml', 
		async: true,
		success: function(xml) {		
			//alert((new XMLSerializer()).serializeToString(xml));	
			if($(xml).find('records').text() == '0') {
				addUser(profile.getId(), profile.getName(), profile.getEmail(), profile.getImageUrl());	
			} else {
				//alert('logged in');
				userInfo(google_id);
			}
		},
		error: function(xhr) {
		  alert(xhr.responseText);
		}
	});
	
	getPosts();
}

 function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
	  $('#signoutBtn').hide();
	  $('#submitBtn').hide();
	  username = '';
		google_id = '';
		$('#user_data').hide();
	});
	getPosts();
}

function getPosts() {
	$('.submissions').empty();
	var template,
		page_controls,
		$blankActivity,
		theParams = {
				a: 'getPosts',
				page: page,
				sub: sub,
				user: user_username,
				comments: '';
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
			
			$('.submissions').append(page_controls);
			intiPageControls();
			
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

			
			 $( ".upVote" ).click(function(e) {
			     e.preventDefault();
				if (!(google_id == 0)) {
					var post_id = $(this).siblings('.post_id').text();
				  var theParams = {
						a: 'castVote',
						post_id: post_id,
						user_id: google_id,
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
			
					getPosts();
				}  else {
					alert('You must sign in to vote');
				}
			});
			
		$(".downVote").click(function (e) {
			     e.preventDefault();

		if (!(google_id == 0)) {
			var post_id = $(this).siblings('.post_id').text();
		  var theParams = {
				a: 'castVote',
				post_id: post_id,
				user_id: google_id,
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
	
			getPosts();
		}  else {
			alert('You must sign in to vote');
		}
	
	});
}

function addUser(id, name, email, url) {
	theParams = {
		a: 'addUser',
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
		id: google_id,
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
			userInfo(google_id);
			$('#newUsername').val('');
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
		username = $(data).attr('username'),
		post_id = $(data).attr('post_id'),
		section = $(data).attr('section'),
		upvotes = 0,
		downvotes = 0;
	
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
	if (!(google_id == 0)) {
		
		theParams = {
			a: 'checkForUserVote',
			post_id: post_id,
			user_id: google_id
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
	} else {
		template = template.replace('[link]', '<a href="'+url+'">');
		template = template.replace('[link_end]', '</a>');
	}
	
	$('.submissions').append(template);
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
		$('#submit_post').show(500);
	}
}

function hideSubmit() {
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

$(document).ready(function() {
	initPage();
});

