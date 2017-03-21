function generateHash(len) {
	var symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	var hash = '';
	for (var i = 0; i < len; i++) {
		var symIndex = Math.floor(Math.random() * symbols.length);
		hash += symbols.charAt(symIndex);
	}
	return hash;
}

$(document).ready(function(){
	if (!/\buser_id=/.test(document.cookie)) { //if no 'user_id' in cookies
		document.cookie = 'test';  //add cookie 'user_id'
	}
	// Starts up socket.io. Creates connection.

  var socket = io.connect('http://localhost:3000');
	var lectureid = $('#lectureid').html();
	console.log('asd'+lectureid);

	socket.emit('usertype','student', lectureid);





	/*Speed up and down buttons with animation*/
	var toSlow = 0;
	var toFast = 0;
	$("#down").mouseout(function(){
		$("#down").css("background-color","#d1c0c0");
	});
	$("#up").mouseout(function(){
		$("#up").css("background-color","#c0d1be");
	});

	$("#up").mouseover(function(){
		$("#up").css("background-color","grey");
	});
	$("#down").mouseover(function(){
		$("#down").css("background-color","grey");
	});

	$("#up").mousedown(function(){
		$("#up").css("background-color","lightgrey");
	});
	$("#down").mousedown(function(){
		$("#down").css("background-color","lightgrey");
	});

	$("#down").mouseup(function(){
		$("#down").css("background-color","#d1c0c0");
	})
	$("#up").mouseup(function(){
		$("#up").css("background-color","#c0d1be");
	})
/*Fade functionality and feedback from buttons.*/
	$("#down").click(function(){
		toFast += 1;


		// Counter on page
		$("#message").text("You pressed the too fast button")
		$("#toFast").text(toFast);
		$("#message").fadeIn("slow");
		setTimeout(function(){
			$("#message").fadeOut("slow");
		}
		,2000);
		// sending message to the server:
		socket.emit('slower');
	});
	$("#up").click(function(){
		toSlow += 1;


		// Counter on page
		$("#message").text("You pressed the too slow button");
		$("#toSlow").text(toSlow);
		$("#message").fadeIn("slow");
		setTimeout(function(){
			$("#message").fadeOut("slow");
		},2000);
		// sending message to the server:
		socket.emit('faster');
	});

});
