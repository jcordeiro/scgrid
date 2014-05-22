var CLIENT_ID = "3bd54dc3bb72fedf2fbb3e415b8ba1bb";
var SC_BASE_URL = "https://api.soundcloud.com";



$(document).ready(function() {

  console.log("page loaded");


  fetchSoundCloudTracks();

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
    },

    success: function(data) {
      console.log("Tracks fetched!");
      console.log(data);

      $(data).find("tracks").find("track").each(function() {

        // Get the artwork for each track if it isn't null
        if ($(this).find("artwork-url").attr("nil") != "true") {
          $("#container").append("<img src='" + $(this).find("artwork-url").text() + "' />");
        }

        // If the track artwork is null, get the track uploader's profile picture
        else {
          $("#container").append("<img src='" + $(this).find("user").find("avatar-url").text() + "' />");

          // We'll have to check here if the uploader has no profile picture
          // in which case we'll probably just use a default image
          // maybe the SoundCloud logo?


        }

      });

    },

    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Fetching tracks failed!");
      console.log("jqXHR: " + jqXHR);
      console.log("Status: " + textStatus);
      console.log("Error: " + errorThrown);
    }



  });



}