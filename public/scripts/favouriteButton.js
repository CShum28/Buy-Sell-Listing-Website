$(document).ready(() => {
  $(".favourite-button").on("click", async (event) => {
    // console.log("Test!");
    const itemID = $(event.currentTarget).parents(".card").data("itemid");

    // here as a PLACEHOLDER ONLY. need to fix what's being passed as userID.
    const userID = $(event.currentTarget).parents(".card").data("userid");
    // const userID = $(this).data("user-id");

    try {
      const response = await $.ajax({
        url: "/favourites",
        method: "POST",
        data: {
          itemID: itemID,
          userID: userID,
        },
      });
    } catch (err) {
      console.error(err);
    }
  });
});

$(document).ready(function () {
  $(".favourite-button").hover(
    function (e) {
      var offset = 10; // Adjust the offset as needed
      var posX = e.pageX + offset;
      var posY = e.pageY + offset;

      $('<div class="hover-content">Click to add to your favourites!</div>')
        .css({
          position: "absolute",
          top: posY + "px",
          left: posX + "px",
          padding: "5px",
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "3px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          zIndex: "9999",
        })
        .appendTo("body");
    },
    function () {
      $(".hover-content").remove();
    }
  );
});
