//https://api.parse.com/1/classes/chatterbox
var app = {};

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
  _.each(messages, function(message) {
    var text = app.sanitize(message.text);
    var username = app.sanitize(message.username);
    var date = app.sanitize(message.createdAt);
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

var message = {
  'username': '<img src="http://i.imgur.com/cu0UCYu.gif">',
  'text': 'HAPPY PUG TIME',//'<script type="text/javascript"> $(\'body\').css(\'background\', \'url("http://38.media.tumblr.com/tumblr_meazvxSXKx1qkrm4go1_400.gif")\');</script>',
  'roomname': 'PUGTIME'
};

//POST message to Parse server

  // $.ajax({
  //   // always use this url
  //   url: 'https://api.parse.com/1/classes/chatterbox',
  //   type: 'POST',
  //   data: JSON.stringify(message),
  //   contentType: 'application/json',
  //   success: function (data) {
  //     console.log('chatterbox: Message sent');
  //   },
  //   error: function (data) {
  //     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  //     console.error('chatterbox: Failed to send message');
  //   }
  // });
  // console.log(i);
  // i++;



$(document).ready(function(){
  $(".refresh-button").click(function(event) {
    app.init();
  });
});
