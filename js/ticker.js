function startTicker() {
  // RENDER LOOP
  app.ticker.add(function(delta) {
    if (document.hidden) return;

    // SORT MESSAGES SO BIGGEST IS IN FRONT
    chatContainer.children.sort(depthCompare);

    // INPUT HANDLER
    if (channelInput.grow) {
      if (channelInput.width < window.innerWidth * .45)
        channelInput.scale.x = channelInput.scale.y += .05;
      else if (channelInput.width > window.innerWidth * .55)
        channelInput.scale.x = channelInput.scale.y -= .05;
    } else if (channelInput.scale.x > 0)
      channelInput.scale.x = channelInput.scale.y -= .005;
    else channelInput.scale.x = channelInput.scale.y = 0;

    // PROCESS
    var count = chatContainer.children.length;
    for (var message in messages) {
      messages[message].applyGrow(count);
      messages[message].applyVelocity();
      messages[message].slowDown();
    }
  });

  // PHYSICS LOOP
  setInterval(function() {
    if (document.hidden) return;
    document.getElementById('channel').focus();

    // APPLY PHYSICS
    var count = chatContainer.children.length;
    for (var message in messages) {
      messages[message].collision();
      messages[message].keepInBounds();
      messages[message].checkRemove();
    }

    // HANDLE NEW MESSAGES
    if (newChat.length > 0) {
      var newMessage = newChat.shift();
      if (typeof messages[newMessage] !== 'undefined') {
        messages[newMessage].addGrow(chatContainer.children.length);
      } else {
        if (!badwords.some(function(v) {
            return newMessage.indexOf(v) >= 0;
          }))
          setTimeout(function() {
            messages[newMessage] = new Chat(newMessage);
          }, delay || 0);
      }
    }
  }, 1000 / 10);
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}