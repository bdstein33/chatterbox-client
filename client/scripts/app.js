//https://api.parse.com/1/classes/chatterbox
var app = {};
app.allMessages = {};
app.lastUpdate = 0;
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.friendList = [];

app.init = function() {
  //GET messages from Parse server
  app.fetch();
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.populateMessages(data.results, app.lastUpdate);
      app.addRooms();
      $('.message-container-title').text("All Messages");

      $('.side-bar-friend').remove();
      _.each(app.friendList, function(friend){
        console.log(friend);
        app.addFriend(friend);
      });

      console.log('Chatterbox: Got messages');
    },
    error: function (data) {
      console.error('Chatterbox: Failed to get messages');
    }
  });
};

app.sanitize = function (string) {
  return _.escape(string);
};


app.populateMessages = function(messages, startTime) {
  app.lastUpdate = messages[0].createdAt;
  _.each(messages.reverse(), function(message) {
    if (moment(message.createdAt).isAfter(startTime)) {
      app.addMessage(message);
    }
  });
  $('.message-username').click(function() {
    var friend = $(this).text();
    if (app.friendList.indexOf(friend) === -1) {
      app.friendList.push(friend);
      app.addFriend(friend);
    }
  });
};

app.init();

app.addMessage = function(message) {
  var text = app.sanitize(message.text);
  var username = app.sanitize(message.username);
  var date = moment(app.sanitize(message.createdAt)).fromNow();
  var roomname = app.sanitize(message.roomname);
  roomname = roomname.replace(/^\s+/g, '').replace(/\s+$/g, '');
  if (roomname.length === 0) {
    roomname = "Default";
  }
  if (app.allMessages.hasOwnProperty(roomname)) {
    app.allMessages[roomname].unshift(message);
  } else {
    app.allMessages[roomname] = [message];
  }
  var $message_html =
  "<div class='message' room=" + roomname.replace(/[ |']/, '-') + ">" +
    "<p class='message-text'>" + text + "</p>" +
    "<p class='message-username'>" + username + "</p>" +
    "<p class='message-date'>" + date + "</p>" +
    "<p class='message-room'>" + roomname + "</p></div>";
  $('.message-container').prepend($message_html);
};

app.send = function(messageData) {
  var message = {
    'username': messageData.username,
    'text': messageData.text,
    'roomname': messageData.roomname
  };

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      app.init();
      $("[type='text']").val('');
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.clearMessages = function() {
  $('.message').remove();
  app.lastUpdate = 0;
  $('.message-container-title').text('Refresh to See Messages');
  $('.side-bar-room, .side-bar-friend').remove();
};

app.addRooms = function() {
  var rooms = Object.keys(app.allMessages);
  $('.side-bar-room').remove();
  _.each(rooms, function (room){
    var $sidebar_html = "<p class='side-bar-room' room=\'" + room + "\'>" + room + "  (" + app.allMessages[room].length.toString() + ")" + "</p>";
    $('.side-bar-room-div').append($sidebar_html);
  });
  $('.side-bar-room').click(function(){
    var room = $(this).attr('room');
    app.filterMessages(room);
  });
};

app.addFriend = function(username) {
  var $sidebar_html = "<p class='side-bar-friend' username=\'" + username + "\'>" + "@" + username + "</p>";
  $('.side-bar-friends-div').append($sidebar_html);
};

var togglePostForm = function() {
  if ($('#form-container').is(':visible')) {
    $('#form-container').slideUp();
  }
  else{
    $('#form-container').slideDown();
  }
};

app.filterMessages = function(room) {
  $('.message').show();

  if (room !== undefined) {
    $('.message').each(function(){
      if ($(this).attr('room') !== room.replace(/[ |']/, '-')) {
        $(this).hide();
      }
    });
    $('.message-container-title').text(room);
  }
};



$(document).ready(function(){
  $('#form-container').hide();
  $('.post-button').click(function() {
    togglePostForm();
  });

  app.addRooms();

  $(".refresh-button").click(function() {
    app.init();
  });

  $(".clear-button").click(function() {
    app.clearMessages();
  });

  $('.message-form').submit(function(e) {
    e.preventDefault();
    var messageData = {};
    messageData.username = $("[name='username']").val();
    messageData.text = $("[name='text']").val();
    messageData.roomname = $("[name='roomname']").val();
    app.send(messageData);
    $('#form-container').hide();
  });

});
