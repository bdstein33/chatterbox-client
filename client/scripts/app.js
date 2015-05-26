//https://api.parse.com/1/classes/chatterbox
var app = {};
app.lastUpdate;

app.init = function() {
  //GET messages from Parse server
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.populateMessages(data.results);
      console.log('Chatterbox: Got messages');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('Chatterbox: Failed to get messages');
    }
  });
};

app.sanitize = function(string) {
  var string = string || "";
  return string.replace(/<.*?>/, "");
}

app.populateMessages = function(messages) {
  //append a message div to message-container div
  app.lastUpdate = messages[0].createdAt;
  _.each(messages, function(message) {
    var text = app.sanitize(message.text);
    var username = app.sanitize(message.username);
    var date = moment(app.sanitize(message.createdAt)).fromNow();
    var roomname = app.sanitize(message.roomname);

    var $message_html =
    "<div class='message' room=" + roomname + ">" +
      "<p class='message-text'>" + text + "</p>" +
      "<p class='message-username'>" + username + "</p>" +
      "<p class='message-date'>" + date + "</p>" +
      "<p class='message-room'>" + roomname + "</p></div>"
    $('.message-container').append($message_html);
  });

};

app.init();



//POST message to Parse server




app.submitMessage = function(username, text, roomname) {
  var message = {
    'username': username,
    'text': text,
    'roomname': roomname
  };

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};


$(document).ready(function(){
  $(".refresh-button").click(function() {
    app.init();
  });

  $('.message-form').submit(function(e) {
    e.preventDefault();

    var username = $("[name='username']").val();
    var text = $("[name='text']").val();
    var roomname = $("[name='roomname']").val();
    app.submitMessage(username, text, roomname);
  });
});
