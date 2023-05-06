$(document).ready(() => {
  $(".sendsmsbutton").on("click", (event) => {
    event.preventDefault();
    // alert("You hit!");
    $("#messageBox").addClass("show");
  });

  $("[id^='sendMessageBtn-']").on("click", async (event) => {
    event.preventDefault();
    const messageBoxId = $(event.target).attr("data-messageboxid");
    const messageBody = $(`#messageBody-${messageBoxId}`).val();

    try {
      const response = await fetch("/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageBody }),
      });

      if (response.ok) {
        // Message sent successfully
        alert("SMS message sent successfully.");
      } else {
        // Error occurred while sending the message
        alert("An error occurred while sending the SMS message.");
      }
    } catch (error) {
      // Handle network or other errors
      console.error(error);
      alert("An error occurred while sending the SMS message.");
    }

    $(`#messageBox-${messageBoxId}`).removeClass("show");
    $(`#messageBody-${messageBoxId}`).val("");
  });
});
