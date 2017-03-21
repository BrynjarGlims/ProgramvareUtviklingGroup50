// Importing libraries
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var lectures = {};

// Now we will connect the users to socket.io.
// Socket io is a library that maintains and keeps track of connected users.
// We added things to student.html and student.js to make it work.

// This creates a connection to the
io.on('connection',function(socket){

  // Creates events for the existing connection

  socket.on('usertype',function(type,lectureid){
    // Checks if the type of person connected is using the javascript from the
    // student page or the teacher page, and decides further actions based on
    // this.
    if (type == 'student'){
      console.log('Student has logged on to lecture ' + lectureid);
      // HAVE TO CHECK IF STUDENT ALREADY EXISTS SO WE DONT GET DUPLICATES
      var cookie = socket.handshake.headers.cookie;
      var match = cookie.match(/\buser_id=([a-zA-Z0-9]{32})/);  //parse cookie header
      console.log(cookie);
      var userId = match ? match[1] : null;



      socket.slower = false;
      socket.faster = false;
      if (userId in lectures[lectureid]['students']){
        // USER EXISTS
        console.log('user exists so dont duplicate it ffs')
      }
      else{
          lectures[lectureid]['students'][userId] = socket;
      }
      io.to(lectures[lectureid].teacherid).emit('update',feedbackcalculator(lectureid));

      // Creates a listener for a signal with a name that MAY contain data.
      // Basically an eventlistener across pages.
      socket.on('slower',function(){
        console.log('Student pressed slower button');
        // send message to teacher:
        socket.slower = true;
        socket.faster = false;
        io.to(lectures[lectureid].teacherid).emit('update',feedbackcalculator(lectureid));
      });
      socket.on('faster',function(){
        console.log('Student pressed faster button');
        socket.faster = true;
        socket.slower = false;
        io.to(lectures[lectureid].teacherid).emit('update',feedbackcalculator(lectureid));
      });
      socket.on('disconnect',function(){
        console.log('student disconnect');
        delete lectures[lectureid]['students'][userId];
        io.to(lectures[lectureid].teacherid).emit('update',feedbackcalculator(lectureid));
      });
    }
    else{
      console.log('Teacher has logged on with lecture ' + lectureid);
      // detects the socket id from the teacher connection and sets it.
      if (lectureid in lectures){
        lectures[lectureid].teacherid = socket.id;
        console.log('lecture existed');
        io.to(lectures[lectureid].teacherid).emit('update',feedbackcalculator(lectureid));
      }
      else{
        lectures[lectureid] = {
          teacherid:socket.id,
          students:{},
        };
        console.log('lecture created');
      }

      socket.on('disconnect',function(){
        console.log('teacher disconnect');
        // her må vi først lagre dataene våre sånn at de ikke forsvinner.
        // dvs stuffe inn i db før delete.
        //delete lectures[lectureid];
      });
    }
  });
});

function feedbackcalculator(lectureid){
  var connectedstudents = lectures[lectureid].students;
  var slower = 0;
  var faster = 0;
  var count = 0;
  for (var key in connectedstudents){
    var student = connectedstudents[key];
    if (student.slower == true){
      slower += 1;
    };
    if (student.faster == true){
      faster += 1;
    };
    count +=1;
  };

  return {
    slower:slower,
    faster:faster,
    students:count,
  }
};



// Starts the server on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});
