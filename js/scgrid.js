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
    // dataType: 'xml',
    data: {
      'client_id': CLIENT_ID,
      'limit': 200
    },
    success: function(data) {

      console.log("Fetching tracks: Success");
      console.log(data);

    },
    error: function(jqXHR, textStatus, errorThrown) {

      console.log("Fetching tracks failed...");
      console.log("jqXHR: " + jqXHR);
      console.log("Status: " + textStatus);
      console.log("Error: " + errorThrown);
    }



  });



}