$(document).ready(() => {
  console.log("okay");
  $(".deletebutton").on("click", async (event) => {
    // console.log("Test!");
    const itemID = $(event.currentTarget).parents(".card").data("itemid");

    // here as a PLACEHOLDER ONLY. need to fix what's being passed as userID.
    const userID = $(event.currentTarget).parents(".card").data("userid");
    // const userID = $(this).data("user-id");

    try {
      const response = await $.ajax({
        url: "/delete",
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
