var CLIENT_ID = "3bd54dc3bb72fedf2fbb3e415b8ba1bb";
var SC_BASE_URL = "https://api.soundcloud.com";


/*
<iframe width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F293&show_artwork=true&auto_play=false"></iframe>
*/

$(document).ready(function() {

  SC.initialize({
    client_id: CLIENT_ID,
    redirect_uri: "http://example.com/callback.html",
  });

  console.log("page loaded");

  console.log(SC);

  fetchSoundCloudTracks();



  // SC.oEmbed("http://soundcloud.com/forss/flickermood", {auto_play: false}, function(oembed){
  //    console.log("oEmbed response: ", oembed);

  //    $("#track-player").append(oembed.html);

   // });

  $("#main-content").on("click", ".scgrid-image", function(e) {

    console.log("clicked!");

    console.log(e);

    console.log($(this));

    var url = $(this).data("url");
    console.log(url);

    SC.oEmbed(url, {auto_play: false}, function(oembed){
       console.log("oEmbed response: ", oembed);

       $("#track-player").html(oembed.html);
       $("#track-player").toggleClass("hidden");
    });

  });

  // $(".scgrid-image").click(function(e) {

  //   console.log("clicked!");

  //   console.log(e);

  //   console.log($(this));

  // });






});


// Performs the ajax call to soundcloud
// and fetches an array of tracks
function fetchSoundCloudTracks() {

  $.ajax({
    url: SC_BASE_URL + "/tracks",
    context: document.body,
    dataType: 'xml',
    data: {
      'client_id': CLIENT_ID,
      'limit': 200
    },

    beforeSend: function() {
      console.log("Fetching tracks...");

      /* Show ajax loader */
      $("#loader").toggleClass("hidden");

    },

    success: function(data) {
      console.log("Tracks fetched!");
      console.log(data);

      $(data).find("tracks").find("track").each(function() {

        var a = $(this).find("permalink-url")[1];
        console.log($(this).find(a).text());

        // Get the artwork for each track if it isn't null
        if ($(this).find("artwork-url").attr("nil") != "true") {
          $("#main-content").append("<img class='scgrid-image'  src='" +
            $(this).find("artwork-url").text() +
            // "' data-url='" + $(this).find("permalink-url")[1].text() +"' />");
          "' data-url='" + $(this).find(a).text() +"' />");


          // $("#container").append("<span class='grid-span pure-u-1-20' '><img class='grid-image '  src='" + $(this).find("artwork-url").text() + "' /></span>");

        }

        // If the track artwork is null, get the track uploader's profile picture
        else {
          $("#main-content").append("<img class='scgrid-image' src='" +
            $(this).find("user").find("avatar-url").text() +
             // "' data-url='" + $(this).find("permalink-url"[1]).text() +"' />");
          "' data-url='" + $(this).find(a).text() +"' />");


          // $("#container").append("<span class='grid-span pure-u-1-20 '><img class='grid-image  ' src='" + $(this).find("user").find("avatar-url").text() + "' /></span>");


          // We'll have to check here if the uploader has no profile picture
          // in which case we'll probably just use a default image
          // maybe the SoundCloud logo?




        }

      });

    },
    complete: function() {
      /* Hide ajax loader loader */
      $("#loader").toggleClass("hidden");

    },

    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Fetching tracks failed!");
      console.log("jqXHR: " + jqXHR);
      console.log("Status: " + textStatus);
      console.log("Error: " + errorThrown);
    }



  });





}