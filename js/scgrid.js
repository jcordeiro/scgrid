var CLIENT_ID = "3bd54dc3bb72fedf2fbb3e415b8ba1bb";
var SC_BASE_URL = "https://api.soundcloud.com";
var DEFAULT_AVATAR_URL = "https://a1.sndcdn.com/images/default_avatar_large.png?30a2558";

$(document).ready(function() {

  //Clicking the title in the header will fetch the tracks from SoundClouad again
  $('.title').click(function() {
    $("#main-content").empty();
    fetchSoundCloudTracks();
  });

  // Pauses and fades out the SoundCloud player widget
  // when the user clicks anywhere else besides the player on the page
  $(document).mouseup(function (e) {
      var player = $("#track-player");

      // Check that the player widget isn't already hidden
      if ($("#track-player").is(":visible")) {
        if (!player.is(e.target) && // if the target of the click isn't the container...
            player.has(e.target).length === 0) // ... nor a descendant of the container
        {
            // Just pause the widget
            widget.pause();


            player.fadeOut("slow");


            console.log("closing...");
        }
      }
      else {
        // Pause the widget and fade it away
        widget.pause();
        player.fadeOut("slow");

        console.log("closing...");

      }
  });

  // Initialize SoundCloud SDK
  SC.initialize({
    client_id: CLIENT_ID,
    redirect_uri: "http://www.joncordeiro.com/projects/scgrid",
  });

  // Initialize the SoundCloud Player Widget
  // and inject the iframe element into the page
  $("#track-player").html('<iframe id="sc-widget"' +
                          ' src="https://w.soundcloud.com/player/?url=' +
                          'https%3A//api.soundcloud.com/tracks/27953592' + // Default URL before we load one the user clicks
                          '" width="100%" height="465" scrolling="no"' +
                          'frameborder="no"></iframe>');

  var widget = SC.Widget("sc-widget");

  // Fetch the tracks from SoundCloud
  fetchSoundCloudTracks();

  $("#main-content").on("click", ".scgrid-image", function(e) {

    var url = $(this).data("url");

        widget.bind(SC.Widget.Events.READY, function() {

            // Load the widget to play the selected song
            widget.load(url, {auto_play: true,
              callback: function() {
              // Display the widget once it's loaded
              $("#track-player").fadeIn("fast");
            }
          });
        });
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

      $(data).find("tracks").find("track").each(function() {

        var url = $(this).find("uri")[0];

        var img_source = null;

        // Get the artwork for each track if it isn't null
        if ($(this).find("artwork-url").attr("nil") != "true") {
          image_source = $(this).find("artwork-url").text();
        }

        // If the track artwork is null, get the track uploader's profile picture
        else {
          image_source = $(this).find("avatar-url").text();

            // Check that the uploader's profile picture isn't SoundCloud's default
            if (image_source === DEFAULT_AVATAR_URL) {

              // If the uploader's profile picture is the default
              // we'll use the SoundCloud logo instead
              // at least it looks a little nicer!
              image_source = "/img/sclogo.png";
            }
        }

        // Add the image to the grid
        $("#main-content").append("<img class='scgrid-image hidden' src='" +
        image_source +
        "' data-url='" + $(this).find(url).text() +"' />");
      });

      $('.scgrid-image').load(function() {

        $(this).fadeIn('slow');
      });
    },
    complete: function() {
      /* Hide ajax loader loader */
      $("#loader").toggleClass("hidden");

      // Some images from SoundCloud give a 403 (Forbidden) error
      // So we replace the broken images with the SoundCloud logo
      $("img").error(function(){
          $(this).attr("src", "/img/sclogo.png");
          console.log("Fixed broken image for: " + $(this));
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