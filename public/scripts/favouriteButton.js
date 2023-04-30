$(document).ready(() => {
  console.log("okay");
  $(".favorite-button").on("click", async (event) => {
    // console.log("Test!");
    const itemID = $(event.currentTarget).parents(".card").data("itemid");
    const userID = $(event.currentTarget).parents(".card").data("userid");
    // const userID = $(this).data("user-id");

    try {
      const response = await $.ajax({
        url: "/favourites",
        method: "POST",
        data: JSON.stringify({ itemID, userID }),
      });
    } catch (err) {
      console.error(err);
    }
  });
});
