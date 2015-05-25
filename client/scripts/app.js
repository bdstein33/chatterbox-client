//https://api.parse.com/1/classes/chatterbox

(function () {
  'use strict';

  var message = {
    'username': '<script type="text/javascript"> alert("escape yoself befo you wreck yoself");</script>',
    'text': '<script type="text/javascript"> alert("escape yoself befo you wreck yoself");</script>',
    'roomname': 'test'
  };

  //POST message to Parse server
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

  var recieved = {};

  //GET messages from Parse server
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      //debugger;
      console.log(data.results);
      console.log('chatterbox: Got messages!');
      recieved = data.results;
      _.each(data.results, function(m) {
        console.log(m.username)
      })
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });
  console.log('recieved: ')
  console.dir(recieved);

})();
