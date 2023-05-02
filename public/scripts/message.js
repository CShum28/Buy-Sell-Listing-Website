$(document).ready(function() {

  const loadMessages = () => {
    return $.ajax({
      type: "GET",
      url: `http://localhouse:8080/message/-something-`,
      success: function() {

      }
    })
  }

  const createMessageElement = (messageObj) => {
    return `
      <p>${messageObj.user}:</p>
      <p>${messageObj.content}</p>
    `
  }

  const renderMessages = (messages) => {
    for (const message of messages) {
      $("#messages-container").append(createMessageElement(message))
    }
  }

  loadMessages();
})
