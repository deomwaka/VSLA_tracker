var map, featureList, boroughSearch = [], householdSearch=[], getMarkersSearch=[];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#logout-btn").click(function() {
  $.ajax({
    url: 'php/logout.php',
    data: { logout: true },
    success: function(data) {
      var response = JSON.parse(data);
      if (response.success) {
        location.reload();
        alert('You have been successfully logged out.');
      }
    }
  });
});

$(document).ready(function() {
  $('#login-form').submit(function(event) {
    event.preventDefault(); // prevent the form from submitting normally
    var email = $('#email').val();
    var password = $('#password').val();

    $.ajax({
      url: 'login.php',
      type: 'post',
      data: { email: email, password: password },
      success: function(response) {
        if (response === "logged in successfully") {
          $("#loginModal").modal("hide");
          $(".navbar-collapse.in").collapse("hide");
          alert('Successfully logged in')
          location.reload();

        } else {
           alert('Incorrect email or password.');
        }
      }
    });
  });
});


$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
 
/* Loop through households layer and add only features which are in the map bounds */
  households.eachLayer(function (layer) {
  if (map.hasLayer(householdLayer)) {
    // if (map.getBounds().contains(layer.getLatLng())) {
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.group_id + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    // }
  }
});

 /* Loop through getmarkers layer and add only features which are in the map bounds */
  
 getmarkers.eachLayer(function (layer) {
  if (map.hasLayer(getMarkersLayer)) {
    // if (map.getBounds().contains(layer.getLatLng())) {
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.groupId + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    // }
  }
});

  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
 /* Sorting the feature list in ascending order. */
  // featureList.sort("feature-name", {
  //   order: "asc"
  // });
}

/* Basemap Layers */
// var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
// });

var cartoLight = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
//   maxZoom: 15,
// }), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
//   minZoom: 16,
//   maxZoom: 19,
//   layers: "0",
//   format: 'image/jpeg',
//   transparent: true,
//   attribution: "Aerial Imagery courtesy USGS"
// })]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/boroughs.geojson", function (data) {
  boroughs.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});


/* Empty layer placeholder to add to layer control for listening when to add/remove households to markerClusters layer */
var householdLayer = L.geoJson(null);
var households = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/museum.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },

  
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      
      var content = "<table class='table table-responsive table-striped table-bordered table-condensed'>" +
      "<tr id='preview-show' style='display:none'><td colspan='2'><video id='video-preview'></video></td></tr>"+
      "<tr><td colspan='2'>"+
      "<div class='row-sm-6'>"+
          "<button class='btn btn-xs btn-primary' id='take-photo'>Take photo</button>"+ "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+
          "<button class='btn btn-xs btn-secondary' id='capture-photo'>Capture</button>"+
      "</div>"+
      "<tr><th>Group Id</th><td>" + feature.properties.group_id + "</td></tr>"+"<tr><th>Group name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>CBT name</th><td>" + feature.properties.cbt_name + "</td></tr>" + "<tr><th>CBT phone</th><td>" + feature.properties.cbt_phone + "</td></tr>" + "<tr><th>Chairperson name</th><td>" + feature.properties.chairperson_name + "</td></tr>" + "<tr><th>Chairperson phone</th><td>" + feature.properties.chairperson_phone + "</td></tr>"+
      "<tr><th>Activity</th><td>"+
        "<input type='radio' name='vsla' value='VSLA methodology' id='vsla_methodology'/><label for='vsla_methodology'>VSLA methodology</label><br>"+
        "<input type='radio' name='vsla' value='Savings and Borrowing' id='savings_and_borrowing'/><label for='savings_and_borrowing'>Savings and Borrowing</label><br>"+
        "<input type='radio' name='vsla' value='VSLA TOT' id='tot'/><label for='tot'>VSLA TOT</label><br>"+
        "<input type='radio' name='vsla' value='Financial Literacy' id='fl'/><label for='fl'>Financial Literacy</label><br>"+
        "<input type='radio' name='vsla' value='Bank Linkages' id='bl'/><label for='bl'>Bank Linkages</label><br>"+
        "<input type='radio' name='vsla' value='SPM Training' id='spm'/><label for='spm'>SPM training</label><br>"+
      "</td></tr>"+

      "<tr id='checkbox_content' style='display:none'>"+
      "<th>Modules</th>"+
      "<td>"+
        "<div>"+
          "<input type='checkbox' name='vsla_methodology_data' id='introduction' value='Group formation and Assembly' />"+
          "<label for='introduction'>Group formation</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' name='vsla_methodology_data' value='VSLA concept' id='concept' />"+
        "<label for='concept'>VSLA concept</label>"+
      "</div>"+
        "<div>"+
          "<input type='checkbox' name='vsla_methodology_data' value='Leadership and Election of the Management committee' id='leaders' />"+
          "<label for='leaders'>Leadership & Elections</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' name='vsla_methodology_data' value='Development of internal rules and regulations' id='rules' />"+
          "<label for='rules'>Developing rules</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' name='vsla_methodology_data' value='Introduction to written record keeping' id='record' />"+
          "<label for='record'>Intro to record keeping</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' name='vsla_methodology_data' value='Meeting procedures/ meeting steps' id='procedure' />"+
          "<label for='procedure'>Meeting procedures</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' name='vsla_methodology_data' value='Conflicts resolution' id='conflict' />"+
          "<label for='conflict'>Conflict resolution</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' name='vsla_methodology_data' value='Share-out & Action audit' id='audit' />"+
          "<label for='audit'>Share-out & Audit</label>"+
        "</div>"+

        "<div>"+
          "<input type='checkbox' name='savings_and_borrowing_data' value='Savings' id='savings' />"+
          "<label for='savings'>Savings</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' name='savings_and_borrowing_data' value='Borrowings' id='borrowing' />"+
          "<label for='borrowing'>Borrowing</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' name='savings_and_borrowing_data' value='Access to Social fund' id='social' />"+
          "<label for='social'>Access to social fund</label>"+
        "</div>"+


        "<div>"+
          "<input type='checkbox' value='TOT on VSLA methodology'  name='tot_data' id='tot1' />"+
          "<label for='tot1'>TOT on VSLA methodology</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' name='tot_data' value='Financial Literacy and Bank Linkages' id='tot2' />"+
          "<label for='tot2'>Financial Literacy </label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' name='tot_data' value='Selection Planning and Management of IGA' id='tot3' />"+
          "<label for='tot3'>Managing IGAs</label>"+
        "</div>"+

        "<div>"+
          "<input type='checkbox' value='Personal financial Management'  name='fl_data' id='fl1' />"+
          "<label for='fl1'>Finacial management</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Saving' name='fl_data' id='fl2' />"+
          "<label for='fl2'>Saving</label>"+
        "</div>"+
        "<div>"+ 
          "<input type='checkbox' value='Loan Management'  name='fl_data' id='fl3' />"+
          "<label for='fl3'>Loan management</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Investment' name='fl_data' id='fl4' />"+
          "<label for='fl4'>Investment</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Insurance' name='fl_data' id='fl5' />"+
          "<label for='fl5'>Insurance</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Planning for Old age' name='fl_data' id='fl6' />"+
          "<label for='fl6'>Planning for Old age</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Financial Service providers' name='fl_data' id='fl7' />"+
          "<label for='fl7'>Service providers</label>"+
        "</div>"+


        "<div>"+
          "<input type='checkbox' value='Rating of Mature groups for Bank linkage' name='bl_data' id='bl1' />"+
          "<label for='bl1'>Rating of Mature groups</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Sensitization on linkage banking' name='bl_data' id='bl2' />"+
          "<label for='bl2'>Senstization on banking</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Account opening process' name='bl_data' id='bl3' />"+
          "<label for='bl3'>Account opening</label>"+
        "</div>"+
        "<div>"+
          "<input type='checkbox' value='Monitoring the performance of the linked group' name='bl_data' id='bl4' />"+
          "<label for='bl4'>Monitoring linked groups</label>"+
        "</div>"+



        "<div>"+
        "<input type='checkbox' value=' IGA slection process' name='spm_data' id='spm1' />"+
          "<label for='spm1'>IGA selection</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='Market Assessment' name='spm_data' id='spm2' />"+
          "<label for='spm2'>Market assessment</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='Knowledge and skills' name='spm_data' id='spm3' />"+
          "<label for='spm3'>Knowledge and skills</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='Estimation of start-up and working costs' name='spm_data' id='spm4' />"+
          "<label for='spm4'>Estimation of start-up</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='Estimating sales and inccome' name='spm_data' id='spm5' />"+
          "<label for='spm5'>Estimate sales & income</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='Weekly expense and weekly income' name='spm_data' id='spm6' />"+
          "<label for='spm6'>Weekly expenses & income</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='Actual IGA Selection' name='spm_data' id='spm7' />"+
          "<label for='spm7'>Actual IGA selection</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='IGA planning' name='spm_data' id='spm8' />"+
          "<label for='spm8'>IGA planning</label>"+
        "</div>"+
        "<div>"+
        "<input type='checkbox' value='IGA management' name='spm_data' id='spm9' />"+
          "<label for='spm9'>IGA management</label>"+
        "</div>"+
        


      "</td>"+
      "</tr>"+

      "<tr><th>Activity photo</th><td><canvas id='photo-canvas' width='200' height='200'></canvas></td></tr>"+
      "</td></tr>"+
      "</table>";

      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html([content,'<br>',button]);
          $("#featureModal").modal("show");
          
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
      
          /* This code below is adding an event listener to each radio input. When the radio input is
          clicked, the code will check if the checkbox content is hidden. If it is, it will display
          it. Then, the code will loop through each checkbox and hide it. If the checkbox name
          matches the radio input id, it will display it. */
          const radioInputs = document.querySelectorAll('input[type="radio"]');
          for (let i = 0; i < radioInputs.length; i++) {
            radioInputs[i].addEventListener("click", function() {
              const checkboxContent = document.getElementById("checkbox_content");
              if (checkboxContent.style.display === "none") {
                checkboxContent.style.display = "";
              }
              const checkboxes = checkboxContent.querySelectorAll('input[type="checkbox"]');
              for (let j = 0; j < checkboxes.length; j++) {
                const divEl = checkboxes[j].parentElement;
                divEl.style.display = "none";
                if (checkboxes[j].name === this.id + "_data") {
                  divEl.style.display = "";
                }
              }
            });
          }                


          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

            document.getElementById("take-photo").addEventListener("click", function() {
              var row = document.getElementById("preview-show");
              row.style.display = "";
              
              navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
                var video = document.getElementById("video-preview");

                video.width = 220;
                video.height = 180;
                video.srcObject = stream;
                video.play();
                
              });

  
            });
            document.getElementById("capture-photo").addEventListener("click", function() {

              var video = document.getElementById("video-preview");
              var canvas = document.getElementById("photo-canvas");
              var ctx = canvas.getContext("2d");
              canvas.width = video.width;
              canvas.height = video.height;
              // Draw the video frame on the canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 


            /* Stopping the video stream. */
              var video = document.getElementById("video-preview");
              var row = document.getElementById("preview-show");
              row.style.display = "none";
              var stream = video.srcObject;
              var tracks = stream.getTracks();
              tracks.forEach(function(track) {
              track.stop();
              });
            });
          }
        }
      });
     
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      householdSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.addrcity,
        source: "Households",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });



      var button = document.createElement("button");
      button.textContent = "submit";
      button.addEventListener("click", function() {
        $('#loading').show();
        var canvas = document.getElementById("photo-canvas");
        var ctx = canvas.getContext("2d");
        var imageData = canvas.toDataURL("image/png");

        // geting home cordinates
        var training= document.querySelector('input[name="vsla"]:checked').value;
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const modules = Array.from(checkboxes).map(cb => cb.value);
        var lat_home= feature.geometry.coordinates[1];
        var lng_home= feature.geometry.coordinates[0];
        var group_id= feature.properties.group_id;
        var group_name= feature.properties.name;
        var cbt_name= feature.properties.cbt_name;
        var cbt_phone= feature.properties.cbt_phone;
        var chairperson_name= feature.properties.chairperson_name;
        var chairperson_phone= feature.properties.chairperson_phone;
        var home = L.marker([lat_home,lng_home]);
        var homeLatLng = L.latLng(home.getLatLng());

        
        // getting current cordinates

        // navigator.geolocation.getCurrentPosition(function(position) {
        //   var lat_current = position.coords.latitude,
        //       lng_current = position.coords.longitude;
        //       L.marker([lat_current,lng_current])

        //   var currentLatLng = L.latLng(lat_current, lng_current);
      
        //   var distance = homeLatLng.distanceTo(currentLatLng);


        //   if (distance <= 200000000) {
        //     L.marker(homeLatLng).addTo(map);
        //     L.marker([lat_current,lng_current]).addTo(map);
            
        //     $.ajax({
        //       url: 'markers.php',
        //       type: 'POST',
        //       data: {latitude: homeLatLng.lat, longitude: homeLatLng.lng, groupId:group_id, groupName:group_name, cbtName:cbt_name, cbtPhone:cbt_phone, chairpersonName:chairperson_name, chairpersonPhone:chairperson_phone },
        //       success: function(response) {
        //         if (response === "New marker created successfully") {
        //           alert("Data sent successfully!");
        //           $('.modal').modal('hide');

        //       }else {
        //         alert("Error during sending data!");
        //         console.log(response);
        //       }
        //       },
        //       error: function(xhr, status, error) {
        //       alert('sorry, an error has occured. Try again!');
        //       }
        //     });

        //   }else{
        //     alert(["Sorry, You\'re not in the group location",distance]);
        //   }

        // });
        var options = {
          enableHighAccuracy: true
        };
        
        var watchID = navigator.geolocation.watchPosition(function(position) {
          var lat_current = position.coords.latitude,
              lng_current = position.coords.longitude;
              L.marker([lat_current,lng_current])
        
          var currentLatLng = L.latLng(lat_current, lng_current);
      
          var distance = homeLatLng.distanceTo(currentLatLng);
    
    
          if (distance <= 200) {
            L.marker(homeLatLng).addTo(map);
            L.marker([lat_current,lng_current]).addTo(map);
            navigator.geolocation.clearWatch(watchID);
            

            $.ajax({
              url: 'markers.php',
              type: 'POST',
              data: {image: imageData, latitude: homeLatLng.lat, longitude: homeLatLng.lng, groupId:group_id, groupName:group_name, cbtName:cbt_name, cbtPhone:cbt_phone, chairpersonName:chairperson_name, chairpersonPhone:chairperson_phone ,training:training, modules:modules },
              success: function(response) {
                if (response === "New marker created successfully") {
                  $('.modal').modal('hide');
                  $('#loading').hide();
                  alert("Data sent successfully!");
            

                }else if (response !== "New marker created successfully") {
                  alert("Error during sending data!");
                  console.log(response);
                }
              },
              error: function(xhr, status, error) {
                alert('sorry, an error has occured. Try again!');
              }
            });

          }else{
            L.marker([lat_current,lng_current]).addTo(map);
            $('#loading').hide();
            alert(["Sorry, You\'re not in the group location. You\'re ",distance, "meters away from the group"]);
            navigator.geolocation.clearWatch(watchID);
            $('.modal').modal('hide');
          }
        
        },  
        function(error) {
                // handle error
        }, options);
        
    
      });
   
    }
  }
});
$.getJSON("data/vsla_groups.geojson", function (data) {
  households.addData(data);
  map.addLayer(householdLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove getmarkers to markerClusters layer */
var getMarkersLayer = L.geoJson(null);
var getmarkers = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/theater.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Group Id</th><td>" + feature.properties.groupId + "</td></tr>"+"<tr><th>Group name</th><td>" + feature.properties.groupName + "</td></tr>" + "<tr><th>CBT name</th><td>" + feature.properties.cbtName + "</td></tr>" + "<tr><th>CBT phone</th><td>" + feature.properties.cbtPhone + "</td></tr>" + "<tr><th>Chairperson name</th><td>" + feature.properties.chairpersonName + "</td></tr>" + "<tr><th>Chairperson phone</th><td>" + feature.properties.chairpersonPhone + "</td></tr>"+  "<tr><th>Meeting Date</th><td>" + feature.properties.createdAt + "</td></tr>"+"<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.groupName);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.groupName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      getMarkersSearch.push({
        name: layer.feature.properties.groupName,
        // address: layer.feature.properties.id,
        source: "GetMarkers",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("getmarkers.php", function (data) {
  getmarkers.addData(data);
  // map.addLayer(getMarkersLayer);
});



map = L.map("map", {
  zoom: 14,
  // center: [43.702222, -73.979378],
  // center: [3.015643, 30.913635], 
  layers: [cartoLight, boroughs, markerClusters, highlight],
  zoomControl: true,
  attributionControl: false
});


/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === householdLayer) {
    markerClusters.addLayer(households);
    syncSidebar();
  }
  if (e.layer === getMarkersLayer) {
    markerClusters.addLayer(getmarkers);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === householdLayer) {
    markerClusters.removeLayer(households);
    syncSidebar();
  }
  if (e.layer === getMarkersLayer) {
    markerClusters.removeLayer(getmarkers);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by <a href='https://github.com/bazirakye'>bazirakye</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": cartoLight,
  // "Aerial Imagery": usgsImagery
};

var groupedOverlays = {
  "Points of Interest": {
    "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;VSLA groups": householdLayer,
    "<img src='assets/img/theater.png' width='24' height='28'>&nbsp;Visited": getMarkersLayer,

  },
  "Reference": {
    "Boroughs": boroughs,
    // "Subway Lines": subwayLines
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  map.fitBounds(boroughs.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });


  var householdsBH = new Bloodhound({
    name: "Households",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: householdSearch,
    limit: 10
  });

  var getMarkersBH = new Bloodhound({
    name: "GetMarkers",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: getMarkersSearch,
    limit: 10
  });
  

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  boroughsBH.initialize();
  geonamesBH.initialize();
  householdsBH.initialize();
  getMarkersBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Boroughs</h4>"
    }
  },
  {
    name: "Households",
    displayKey: "name",
    source: householdsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Households</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },
  {
    name: "GetMarkers",
    displayKey: "name",
    source: householdsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;GetMarkers</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },
  {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }
   

    if (datum.source === "Households") {
      if (!map.hasLayer(householdLayer)) {
        map.addLayer(householdLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }

    if (datum.source === "GetMarkers") {
      if (!map.hasLayer(getMarkersLayer)) {
        map.addLayer(getMarkersLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
   
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
