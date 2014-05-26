var CLIENT_ID = "3bd54dc3bb72fedf2fbb3e415b8ba1bb";
var SC_BASE_URL = "https://api.soundcloud.com";

$(document).ready(function() {

  // Pauses and fades out the SoundCloud player widget
  // when the user clicks anywhere else besides the player on the page
  $(document).mouseup(function (e)
  {
      var player = $("#track-player");

      if (!player.is(e.target) // if the target of the click isn't the container...
          && player.has(e.target).length === 0) // ... nor a descendant of the container
      {
          // Pause the widget and fade it away
          widget.pause();
          player.fadeOut("slow");
          console.log("closing..");
      }
  });

  // Initialize SoundCloud SDK
  SC.initialize({
    client_id: CLIENT_ID,
    redirect_uri: "http://example.com/callback.html",
  });

  // Initialize the SoundCloud Player Widget
  // and inject the iframe element into the page
  $("#track-player").html('<iframe id="sc-widget"' +
                          ' src="https://w.soundcloud.com/player/?url=' +
                          'http://soundcloud.com/asma2fawzy' +
                          '" width="100%" height="465" scrolling="no"' +
                          'frameborder="no"></iframe>');

  var widget = SC.Widget("sc-widget");

  // Fetch the tracks from SoundCloud
  fetchSoundCloudTracks();


  $("#main-content").on("click", ".scgrid-image", function(e) {

    var url = $(this).data("url");


    console.log(url);

    // Load the widget to play the selected song
    widget.load(url, {auto_play: true});

    // Display the widget
    $("#track-player").fadeIn("fast");

  });

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

        var url = $(this).find("uri")[0];

        // Get the artwork for each track if it isn't null
        if ($(this).find("artwork-url").attr("nil") != "true") {
          $("#main-content").append("<img class='scgrid-image'  src='" +
            $(this).find("artwork-url").text() +
          "' data-url='" + $(this).find(url).text() +"' />");
        }

        // If the track artwork is null, get the track uploader's profile picture
        else {
          $("#main-content").append("<img class='scgrid-image' src='" +
            $(this).find("user").find("avatar-url").text() +
          "' data-url='" + $(this).find(url).text() +"' />");

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