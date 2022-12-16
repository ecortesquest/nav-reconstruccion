var map = null,
  infoWindow = null,
  markers = [];
function loadScript() {
  console.log("Store-locator modificado 12/15/2020");
  var color = $(".produto .dimension-Color").text();
  $(".produto .dimension-Color").css("color", "#" + color),
    $(".produto .dimension-Color").css("background", "#" + color);
  var optionStore = $("<option>")
    .addClass("seleccionadoTienda")
    .val("selecciona la tienda")
    .text("selecciona la tienda");
  $("#stores_ul").prepend(optionStore);
  var script = document.createElement("script");
  (script.type = "text/javascript"),
    (script.src =
      "http://maps.googleapis.com/maps/api/js?key=AIzaSyAyGueEW_KYkMAKzfdncQa_ZOO0j3yiCo4&sensor=false&callback=initialize"),
    document.body.appendChild(script),
    deleteGoogleMapMessage(),
    getStores(),
    $("#stores_ul").live("change", function () {
      var optionTiendaSelected = $("#stores_ul option:selected");
      console.log(optionTiendaSelected),
        setStoreMap(
          optionTiendaSelected.attr("id"),
          optionTiendaSelected.attr("rel")
        );
    }),
    getCities("Colombia"),
    $("#pais").live("change", function () {
      (pais = $(this).val()), getMarkersByCountry(pais), getCities(pais);
    }),
    $("#ciudad").live("change", function () {
      $("#stores_ul").first().val($(".seleccionadoTienda").first());
      var ciud = $(this).val();
      (pais = $("#pais").val()),
        addMarkersOfCity(ciud, pais, map),
        $(".ciudad").remove();
      reemplazarTodo(ciud, " ", ".");
      updateStores(reemplazarTodo(ciud, " ", "."));
    });
}
function reemplazarTodo(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function initialize() {
  if (
    ((map = initializeMap()),
    deleteGoogleMapMessage(),
    deleteMarkers(),
    $("#search").length > 0 &&
      $("#search").autocomplete({
        source: getAutoCompleteValues(),
        minLength: 2,
        select: function (event, ui) {
          event.preventDefault(),
            deleteMarkers(),
            (value = ui.item.value),
            $("#search").val(ui.item.label),
            console.log(map),
            "Store" == value.type
              ? ((store = ui.item.id),
                (city = value.city),
                (country = value.country),
                addMarkersOfStore(store, city, country, map))
              : "City" == value.type
              ? ((city = value.city),
                (country = value.country),
                addMarkersOfCity(city, country, map))
              : "Country" == value.type &&
                ((country = value.country), getMarkersByCountry(country));
        },
        open: function (event, ui) {
          $(".ui-autocomplete").css("z-index", 1e3);
        },
      }),
    (ciudad = getParametroUrl("ciudad")),
    (pais = getParametroUrl("pais")),
    (markerFound = !1),
    "" == ciudad || (null != pais && "" != pais))
  )
    null != ciudad && "" != ciudad && null != pais && "" != pais
      ? ((markerFound = addMarkersOfCity(ciudad, pais, map)),
        $("#ciudad").val(ciudad))
      : "" == pais ||
        (null != ciudad && "" != ciudad) ||
        (markerFound = getMarkersByCountry(pais));
  else {
    $(".ciudad").hide();
    var ciudadTiendasCss = "." + reemplazarTodo(ciudad, " ", ".");
    $(ciudadTiendasCss).show(),
      (markerFound = addMarkersOfCity(ciudad, "Colombia", map)),
      $("#ciudad").val(ciudad);
  }
  markerFound || getMarkersByCountry("Colombia"),
    google.maps.event.addListenerOnce(map, "tilesloaded", function () {
      deleteGoogleMapMessage();
    }),
    google.maps.event.addListenerOnce(map, "idle", function () {
      deleteGoogleMapMessage();
    });
}
function deleteGoogleMapMessage() {
  (firstGmnoPrint = $(".gmnoprint").first()),
    (nextfirstGmnoPrint = firstGmnoPrint.next()),
    nextfirstGmnoPrint.remove();
}
function getParametroUrl(paramName) {
  paramName = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
    href = window.location.href;
  href = href.replace(/&amp;/g, "&");
  var results = regex.exec(href);
  return null == results ? "" : decodeURIComponent(results[1]);
}
function initializeMap() {
  var mapOptions = {
    center: new google.maps.LatLng(4.630513, -73.481229),
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  return new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}
function getAutoCompleteValues() {
  return (
    (data = getAllData()),
    (values = []),
    $.each(data, function (countryName, countryVal) {
      (countryObj = new Object()),
        (countryObj.id = countryName),
        (countryObjValue = new Object()),
        (countryObjValue.type = "Country"),
        (countryObjValue.country = countryName),
        (countryObj.value = countryObjValue),
        (countryObj.label = countryName),
        values.push(countryObj),
        $.each(countryVal.cities, function (cityName, cityVal) {
          (cityObj = new Object()),
            (cityObj.id = cityName + ", " + countryName),
            (cityObjValue = new Object()),
            (cityObjValue.type = "City"),
            (cityObjValue.country = countryName),
            (cityObjValue.city = cityName),
            (cityObj.value = cityObjValue),
            (cityObj.label = cityName + ", " + countryName),
            values.push(cityObj),
            $.each(cityVal.stores, function (storeName, storeVal) {
              (storeObj = new Object()),
                (storeObj.id = storeName),
                (storeObjValue = new Object()),
                (storeObjValue.type = "Store"),
                (storeObjValue.country = countryName),
                (storeObjValue.city = cityName),
                (storeObj.value = storeObjValue),
                (storeObj.label = storeName),
                values.push(storeObj);
            });
        });
    }),
    values
  );
}
function getStores() {
  (data = getAllData()),
    $.each(data, function (countryName, countryVal) {
      var opt2 = $("<option>").val(countryName).text(countryName);
      $("#pais").append(opt2),
        $.each(countryVal.cities, function (cityName, cityVal) {
          $.each(cityVal.stores, function (storeName, storeVal) {
            var optionsTienda = $("<option/>")
              .text(storeName)
              .attr("id", storeName)
              .attr("rel", cityName + "," + countryName)
              .addClass(cityName)
              .addClass("ciudad");
            $("#stores_ul").append(optionsTienda);
          });
        });
    });
}
function updateStores(xx) {
  (data = getAllData()),
    $.each(data, function (countryName, countryVal) {
      var opt2 = $("<option>").val(countryName).text(countryName);
      $("#pais").append(opt2),
        $.each(countryVal.cities, function (cityName, cityVal) {
          $.each(cityVal.stores, function (storeName, storeVal) {
            for (
              var optionsTienda = $("<option/>")
                  .text(storeName)
                  .attr("id", storeName)
                  .attr("rel", cityName + "," + countryName)
                  .addClass(cityName)
                  .addClass("ciudad"),
                i = 0;
              i < optionsTienda.length;
              i++
            )
              xx.length > 0 &&
                optionsTienda[i].id.split("-")[1].indexOf(xx) > -1 &&
                ($("#stores_ul").append(optionsTienda[i]),
                console.log("alguno"),
                console.log(optionsTienda[i].id.split("-")[1] + " " + xx));
          });
        });
    });
}
function getCities(pais) {
  (data = getAllData()), (values = []);
  $("<ul/>");
  $.each(data, function (countryName, countryVal) {
    $.each(countryVal.cities, function (cityName, cityVal) {
      countryName == pais && values.push(cityName);
    });
  }),
    $("#ciudad").html("");
  var opt = $("<option>")
    .val("selecciona la ciudad")
    .text("selecciona la ciudad");
  $("#ciudad").append(opt),
    $.each(values, function (index, value) {
      ciudadNuevo = value.replace(/[-\.]+/g, " ");
      var opt2 = $("<option>").val(value).text(ciudadNuevo);
      $("#ciudad").append(opt2);
    });
}
function setStoreMap(store, atrtibutes) {
  (data = atrtibutes.split(",")),
    (city = data[0]),
    (country = data[1]),
    addMarkersOfStore(store, city, country, map);
}
function getMarkersByCountry(country) {
  return (
    (data = getAllData()),
    (objCountry = data[country]),
    null != objCountry &&
      ($.each(objCountry.cities, function (cityName, city) {
        $.each(city.stores, function (storeName, store) {
          (latLng = new google.maps.LatLng(store.lat, store.lng)),
            (title = storeName);
          var marker = addMarker(latLng, title, map);
          google.maps.event.addListener(marker, "click", function () {
            map.setCenter(latLng),
              infoWindow && (infoWindow.close(), (infoWindow = null)),
              (infoWindow = new google.maps.InfoWindow({
                content: getContentString(store, storeName, cityName, country),
              })).open(map, marker),
              setSelectedStore(store, storeName, cityName, country);
          });
        });
      }),
      (countryLatLng = new google.maps.LatLng(objCountry.lat, objCountry.lng)),
      map.setCenter(countryLatLng),
      map.setZoom(5),
      !0)
  );
}
function addMarkersOfCity(cityName, country, map) {
  return (
    clearSelectedStore(),
    (data = getAllData()),
    (city = data[country].cities[cityName]),
    null != city &&
      ($.each(city.stores, function (storeName, store) {
        (latLng = new google.maps.LatLng(store.lat, store.lng)),
          (title = storeName);
        var marker = addMarker(latLng, title, map);
        google.maps.event.addListener(marker, "click", function () {
          map.setCenter(latLng),
            infoWindow && (infoWindow.close(), (infoWindow = null)),
            (infoWindow = new google.maps.InfoWindow({
              content: getContentString(store, storeName, cityName, country),
            })).open(map, marker),
            setSelectedStore(store, storeName, cityName, country);
        });
      }),
      (cityLatLng = new google.maps.LatLng(city.lat, city.lng)),
      map.setCenter(cityLatLng),
      map.setZoom(12),
      !0)
  );
}
function cityLocationCallBack(location) {
  return location;
}
function addMarkersOfStore(store, city, country, map) {
  (data = getAllData()),
    (stores = data[country].cities[city].stores),
    (storeObj = stores[store]),
    (latLng = new google.maps.LatLng(storeObj.lat, storeObj.lng)),
    (title = store),
    (marker = addMarker(latLng, title, map)),
    map.setCenter(latLng),
    map.setZoom(16),
    setSelectedStore(storeObj, title, city, country),
    google.maps.event.addListener(marker, "click", function () {
      map.setCenter(latLng),
        infoWindow && (infoWindow.close(), (infoWindow = null)),
        (infoWindow = new google.maps.InfoWindow({
          content: getContentString(storeObj, title, city, country),
        })).open(map, marker),
        setSelectedStore(storeObj, title, city, country);
    });
}
function getContentString(store, storeName, city, country) {
  return (
    '<div id="content"><div id="siteNotice"></div><h2 id="firstHeading" class="firstHeading"><span>' +
    city +
    "</span>" +
    storeName +
    '</h2><div id="bodyContent"><ul>' +
    (null != store.address && "" != $.trim(store.address)
      ? "<li><strong>Dirección: </strong> " + store.address + "</li>"
      : "") +
    (null != store.phone && "" != $.trim(store.phone)
      ? "<li><strong>Teléfono: </strong> " + store.phone + "</li>"
      : "") +
    (null != store.schedules && "" != $.trim(store.schedules)
      ? "<li><strong>Horarios: </strong> " + store.schedules + "</li>"
      : "") +
    "</ul></div></div>"
  );
}
function clearSelectedStore() {
  $("#storeContent").empty();
}
function setSelectedStore(store, storeName, city, country) {
  (contentString = getContentString(store, storeName, city, country)),
    $("#storeContent").empty(),
    $("#storeContent").append(contentString);
}
function markerImage() {
  return "/arquivos/map-ico-tienda.png";
}
function addMarker(latLng, title, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: title,
    icon: markerImage(),
  });
  return markers.push(marker), marker;
}
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) markers[i].setMap(map);
}
function clearMarkers() {
  setAllMap(null);
}
function showMarkers() {
  setAllMap(map);
}
function deleteMarkers() {
  clearMarkers(), (markers = []);
}
function getAllData() {
  return {
    Colombia: {
      lat: 4.630513,
      lng: -73.481229,
      cities: {
        Acacías: {
          lat: "3.9866674",
          lng: "-73.7601682",
          stores: {
            "FQ36 - Acacías - QUEST ACACIAS": {
              lat: 3.9866674,
              lng: -73.7601682,
              address: "CALLE 14 #16-66 CENTRO",
              phone: "3214231957",
              schedules:
                "Lunes a sábado (9:00am - 8:00 pm) Domingos y Festivos (9:00am - 5:00pm)",
            },
          },
        },
        Antioquía: {
          lat: "6.1724857",
          lng: "-75.3349662",
          stores: {
            "FQ39-Antioquía - Marinilla": {
              lat: 6.1724857,
              lng: -75.3349662,
              address: "CRA 30 ·28-81",
              phone: "",
              schedules:
                "Lunes a sábado (10:00 am - 7:00 pm) Domingo y festivos (10:00 am - 7:00 pm)",
            },
            "FQ40-Antioquía - La Ceja": {
              lat: 4.6834148,
              lng: -74.1161958,
              address: "CRA19 #19-56 INTERIOR 104",
              phone: "",
              schedules:
                "Lunes a sábado (10:00 am - 7:00 pm) Domingo y festivos (10:00 am - 7:00 pm)",
            },
            "Q125-Antioquía - Bello - Parque Fabricato": {
              lat: 6.32611566559552,
              lng: -75.5579123176429,
              address: "Calle 40 #50-205 local 1348",
              phone: "(2) 4895000 Ext. 9125",
              schedules:
                "Lunes a sábado (10:00 am - 9:00 pm) Domingo y festivos (10:00 am - 9:00 pm)",
            },
          },
        },
        Armenia: {
          lat: "4.540437",
          lng: "-75.664996",
          stores: {
            "Q061 - Armenia - CC Unicentro": {
              lat: 4.540437,
              lng: -75.664996,
              address: "Carrera 14 # 06 - 02 Locales 121 - 122 - 123",
              phone: "+57 2 4895000 Ext. 9061 - 7344404",
              schedules:
                "Lunes a sábado (10:00am - 8:00pm) Domingo (11:00am - 7:00pm)",
            },
            "Q091 - Armenia - Centro": {
              lat: 4.535683,
              lng: -75.669952,
              address: "Carrera 14 # 13-18",
              phone: "+57 2 4895000 Ext. 9091",
              schedules:
                "Lunes a Sábado (9:30am - 7:00pm) Domingo (10:00am - 4:00pm)",
            },
          },
        },
        Arauca: {
          lat: "7.086479187011719",
          lng: "-70.75591278076172",
          stores: {
            "FQ43 - Arauca - Quest Arauca": {
              lat: 7.086479187011719,
              lng: -70.75591278076172,
              address: "Cra 16 #22 - 34 Local 2",
              phone: "320 9008349",
              schedules:
                "Lunes a Sábado (9:00am - 8:00pm) Domingos y festivos (9:30am - 5:00pm)",
            },
          },
        },
        Barrancabermeja: {
          lat: "7.059074",
          lng: "-73.860069",
          stores: {
            "Q052 - Barrancabermeja - Centro": {
              lat: 7.059074,
              lng: -73.860069,
              address: "calle 49 # 17-43 Barrio Colombia",
              phone: "+57 2 4895000 Ext. 9052 - 6201208",
              schedules:
                "Lunes a Sábado (8:30am - 7:00pm) Domingo (9:00am - 3:00pm)",
            },
          },
        },
        Barranquilla: {
          lat: "10.989011",
          lng: "-74.789291",
          stores: {
            "Q023 - Barranquilla - CC Portal del Prado": {
              lat: 10.989011,
              lng: -74.789291,
              address: "calle 53 # 43 - 192 local 129, 130, 131",
              phone: "+57 2 4895000 Ext. 9023 - +57 2 3344508",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingos(11:00am - 8:00pm)",
            },
            "Q035 - Barranquilla - CC Unico": {
              lat: 10.988406,
              lng: -74.812123,
              address: "Calle 74 # 38D-113 Local 6",
              phone: "+57 2 4895000 Ext. 9035 - 3014535",
              schedules:
                "Lunes a sábado (9:30am - 8:30pm) Domingos (10:00am - 8:30pm)",
            },
            "Q106 - Barranquilla - CC Nuestro Atlántico": {
              lat: 10.90534,
              lng: -74.8018956,
              address: "calle 63 #13-71 Avenida Murillo local 10-10 ",
              phone: "+57 2 4895000 Ext. 9106",
              schedules:
                "Lunes a jueves (10:00am - 8:00pm) viernes (10:00am - 8:30pm) sábado (10:00am - 9:00pm) domingos (11:00am - 8:00pm)",
            },
          },
        },
        Bogotá: {
          lat: "4.5982616",
          lng: "-74.1537454",
          stores: {
            "Q119-Bogotá- C.C Paseo villa del rio": {
              lat: 4.5982616,
              lng: -74.1537454,
              address:
                "Diagonal 57C # 62-60 local 119-120 c.c paseo villa del rio ",
              phone: "(2)4895000 Ext 9119",
              schedules:
                "Lunes a sábado (10:00 am - 8:00 pm) Domingo y festivos (11:00 am - 8:00 pm)",
            },
            "Q124-Bogotá - CC Nuestro": {
              lat: 4.6834148,
              lng: -74.1161958,
              address: "Avenida carrera 86 #55A-75-Local 209-213",
              phone: "(2)4895000 EXT 9124",
              schedules:
                "Lunes a viernes (10:00 am - 8:00 pm) sábado (10:00am - 8:30pm) Domingo y festivos (11:00 am - 8:00 pm)",
            },
            "Q129-Bogotá - Plaza Américas": {
              lat: 4.618737210282422,
              lng: -74.1352015152618,
              address: "C.C. Plaza Américas de Bogotá Cra. 71d #6-94",
              phone: "3195817615",
              schedules:
                "Lunes a Jueves (10:00 am - 8:30 pm) Viernes y Sábados (10:00am - 9:00pm) Domingos y festivos (10:00 am - 8:00 pm)",
            },
          },
        },
        Buenaventura: {
          lat: "3.883",
          lng: "-77.067",
          stores: {
            "FQ017 - Buenaventura - Centro": {
              lat: 3.888602,
              lng: -77.075377,
              address: "Calle 5 # 4A-15 Centro",
              phone: "+57 (2) 2418995",
              schedules:
                "Lunes a Sábado (9:00 am - 7:00 pm) Domingo (9:00 am - 1:00 pm)",
            },
          },
        },
        Buga: {
          lat: "3.9",
          lng: "-76.3",
          stores: {
            "FQ012 - Buga - Centro": {
              lat: 3.89959,
              lng: -76.29977,
              address: "Calle 7 # 13 - 12",
              phone: "+57 (2) 2391559",
              schedules:
                "Lunes a Sábado (8:30am - 7:00pm) Domingo (9:00am - 2:00pm)",
            },
            "FQ014 - Buga - CC Buga Plaza": {
              lat: 3.900453,
              lng: -76.31071,
              address: "Calle 4 # 23-86 Centro Comercial Buga Plaza Local 149",
              phone: "+57 (2) 2391559",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingo (11:00am - 7:00pm)",
            },
          },
        },
        Caldas: {  
          lat: "5.307886",
          lng: "-75.449667",
          stores: {
            "Quest la dorada": {
              lat: 5.452346,
              lng: -74.66913,
              address: "CALLE 13 # 2-27 BARRIO CENTRO",
              phone: "+57 3113679330",
              schedules:
                "Lunes a Sábado (10:00am - 7:00pm) Domingo (10:00am - 7:00pm)",
            },
            "FQ59 - Chinchina ": {
              lat: 3.900453,
              lng: -76.31071,
              address: "Calle 11 #7 - 45 BRR/ EL CENTRO",
              phone: "+57 3137805979",
              schedules:
                "Lunes a Sábado (10:00am - 7:00pm) Domingo (10:00am - 7:00pm)",
            },
          },
        },
        Cauca: {  
          lat: "-76.8410",
          lng: "-75.449667",
          stores: {
            "VALENCIA LEONARDO FABIO / SUCURSAL SANTANDER DE QUILICHAO": {
              lat: 3.00484,
              lng: -76.4846,
              address: "CARRERA 11 # 4 - 24 ",
              phone: "+57 3162592491",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingo (9:00am - 1:00pm)",
            },
            "FQ59 - Chinchina ": {
              lat: 3.900453,
              lng: -76.31071,
              address: "Calle 11 #7 - 45 BRR/ EL CENTRO",
              phone: "+57 3137805979",
              schedules:
                "Lunes a Sábado (10:00am - 7:00pm) Domingo (10:00am - 7:00pm)",
            },
          },
        },
        Cali: {
          lat: "3.436983",
          lng: "-76.520355",
          stores: {
            "Q003 - Cali - Calle 23/Aranjuez": {
              lat: 3.436983,
              lng: -76.520355,
              address: "Calle 23 # 20 -62/64 Arajuez",
              phone: "+57 2 4895000 Ext. 9003",
              schedules:
                "Lunes a sábado (9:00am - 7:00pm), Domingos (9:00am - 2:00pm)",
            },
            "Q008 - Cali - Alameda": {
              lat: 3.438465,
              lng: -76.534405,
              address: "Cra 20 # 8A - 99",
              phone: "+57 2 4895000 Ext.9008",
              schedules: "Lunes a Sábado (9:00am - 6:00pm)",
            },
            "Q011 - Cali - CC Cosmocentro": {
              lat: 3.414366,
              lng: -76.546996,
              address: "Calle 5 # 50 - 103 Local 115",
              phone: "+57 2 4895000 Ext.9011 - +57 2 3799307",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes (10:00am - 8:30pm) Sábados (10:00am - 9:00pm) Domingos (11:00am -8:00pm)",
            },
            "Q016 - Cali - CC Palmetto": {
              lat: 3.412802,
              lng: -76.540934,
              address: "Calle 9 # 48 - 81 Local 154",
              phone: "+57 2 4895000 Ext. 9016 - +57 2 3087152",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes (10:00am - 8:30pm) Sábado (10:00am - 9:00pm) Domingo (11:00am - 7:00pm)",
            },
            "Q018 - Cali - CC Jardin Plaza": {
              lat: 3.36941,
              lng: -76.527779,
              address: "Cra 98 # 16 - 200 Local 48",
              phone: "+57 2 4895000 Ext. 9018 - +57 2 3799357",
              schedules:
                "Lunes a jueves (10:00am - 8:00pm) Viernes (10:00am - 8:30pm) Sábado (10:00am - 9:00pm) Domingos (11:00am - 8:00pm)",
            },
            "Q021 - Cali - CC Chipichape": {
              lat: 3.477279,
              lng: -76.527862,
              address: "CALLE 38N # 6N-45 LOCAL 145-146",
              phone: "+57 2 4895000 Ext. 9021 - +57 2 3087594",
              schedules:
                "Lunes a Viernes (10:00am - 8:00pm) Sábados (10:00am - 9:00pm) Domingos (11:00am - 8:00pm)",
            },
            "Q028 - Cali - Centro": {
              lat: 3.4498383,
              lng: -76.5327652,
              address: "Calle 13 # 7 - 68 Centro",
              phone: "(2) 4895000 Ext. 9028",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingos y Festivos (10:00am - 2:00pm)",
            },
            "Q029 - Cali - CC Unico 2": {
              lat: 3.4498597,
              lng: -76.5327652,
              address: "CARRERA 52 CALLE 5-6 LOCAL 472",
              phone: "(2) 4895000 Ext. 9029",
              schedules:
                "Lunes a viernes (09:30am - 8:00pm) Sábado y Domingo (09:30am - 9:00pm)",
            },
            "Q031 - Cali - Centro - Calle 15": {
              lat: 3.453487, 
              lng: -76.529604,
              address: "Calle 15 # 4 - 68",
              phone: "+57 2 4895000 Ext. 9031 - 8960462",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingo (10:00am - 2:00pm)",
            },
            "Q039 - Cali - CC Unico": {
              lat: 3.468684,
              lng: -76.50075,
              address: "Calle 52 entre Carreras 3 y 4 Local 1025",
              phone: "+57 2 4895000 Ext. 9039 - 3087414",
              schedules:
                "Lunes a Jueves (9:30am - 8:00pm) Viernes (9:30am - 8:30pm) Sábado (9:30am - 9:00pm) y Domingo (10:00am - 9:00pm)",
            },
            "Q040 - Cali - CC Unicentro": {
              lat: 3.374622,
              lng: -76.539441,
              address: "Carrera 100 # 5 - 169 Local 344",
              phone: "+57 2 4895000 Ext. 9040 - 3087415",
              schedules:
                "Lunes a viernes (10:00am - 8:00pm) Domingo (11:00am - 8:00pm)",
            },
            "Q041 - Cali - CC Calima": {
              lat: 3.484801,
              lng: -76.497693,
              address: "carrera 1 calle 70. Local 125",
              phone: "+57 2 4895000 Ext. 9041 - 3799459",
              schedules:
                "Lunes a Sábado (10:00am - 8:00 pm) Domingo (10:00am - 8:00pm)",
            },
            "Q081 - Cali - CC Elite": {
              lat: 3.450746,
              lng: -76.529397,
              address: "calle 7 carrera 14 esquina local 157",
              phone: "+57 2 4895000 Ext. 9081 - 3816313",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingo (10:00am - 1:00pm)",
            },
            "Q120 - Cali Plaza Q": {
              lat: 3.4661466,
              lng: -76.4914531,
              address: "Carrera 5 #62-142 Local 7",
              phone: "(2)4895000 Ext. 9120",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingos y Festivos (10:00am - 3:00pm)",
            },
          },
        },
        Cartagena: {
          lat: "10.414044",
          lng: "-75.529771",
          stores: {
            "Q033 - Cartagena - CC Caribe Plaza": {
              lat: 10.414044,
              lng: -75.529771,
              address: "Calle 29D # 22 - 62 Local 139",
              phone: "+57 2 4895000 Ext. 9033 - 6931652",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (10:00am - 8:00pm)",
            },
            "Q92 - Cartagena - Centro Comercial San fernando": {
              lat: 10.3987884,
              lng: -75.5116057,
              address: "Av. Pedro Heredia 31 #82 -327B local 217 -218",
              phone: "+57 (2) 4895000 Ext. 9092 - 6636126",
              schedules:
                "Lunes a sábado (9:45am - 8:00pm) Domingo (9:00am - 7:00pm)",
            },
            "Q068 - Cartagena - CC Outlet del Bosque": {
              lat: 10.388608,
              lng: -75.504826,
              address: "Trasversal 53 # 29E - 44 Local 6 ",
              phone: "+57 2 4895000 Ext. 9068 - 6637022",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingo (9:00am - 5:00pm)",
            },
            "Q109 - Cartagena - CC la Castellana ": {
              lat: 10.384224,
              lng: -75.467754,
              address: "2da etapa calle 31 #64-30 local 23A ",
              phone: "+57 (2) 4895000 Ext. 9109",
              schedules:
                "Lunes a sábado (9:45am - 8:00pm) Domingo (10:00am - 7:00pm)",
            },
          },
        },
        Cartago: {
          lat: "4.742616",
          lng: "-75.916284",
          stores: {
            "Q097 - Cartago - Centro": {
              lat: 4.750836,
              lng: -75.912558,
              address: "Calle 11 # 3 - 52",
              phone: "+57 (2) 4895000 Ext. 9097 - 2093985",
              schedules:
                "Lunes a jueves (9:00am - 7:00pm) viernes y sábado (9:00am - 7:30pm) Domingo (9:00am - 1:00pm)",
            },
            "Q116 - Cartago - CC NUESTRO CARTAGO": {
              lat: 4.7574611,
              lng: -75.9340052,
              address: "CRA 2 # 33 - 33 LOCAL 152",
              phone: "(2)4895000 Ext 9116",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingos y Festivos (11:00am - 8:00pm)",
            },
          },
        },
        Cesar: {
          lat: "8.3098706",
          lng: "-73.6219738",
          stores: {
            "FQ41-Cesar - Aguachica": {
              lat: 8.3098706,
              lng: -73.6219738,
              address: "Calle 5 # 12 - 57",
              phone: "3102201118",
              schedules:
                "Lunes a sábado (9:00 am - 7:15 pm) Domingo y festivos (9:00 am - 1:00 pm)",
            },
          },
        },
        Cucuta: {
          lat: "7.887541",
          lng: "-72.496983",
          stores: {
            "Q027 - Cucuta - CC Ventura Plaza": {
              lat: 7.887541,
              lng: -72.496983,
              address: "Calle 10 y 11 DG Santander Local 1-14",
              phone: "+57 2 4895000 Ext. 9027 - 5955958",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábados (10:00am - 9:00pm) Domingos (11:00am - 7:00pm)",
            },
            "Q046 - Cucuta - Centro 2": {
              lat: 7.918289,
              lng: -72.521981,
              address: "Calle 10 #1 - 73 centro 2 ",
              phone: "+57 2 4895000 Ext. 9046 - 5956026",
              schedules:
                "Lunes a Jueves (8:30am - 7:00pm) Viernes y Sábado (9:00am - 8:00pm) Domingo (9:00am - 3:00pm)",
            },
            "Q115 - Cucuta - CENTRO": {
              lat: 7.88784,
              lng: -72.49842,
              address: "calle 10 entre avenida 4 y 5 #4-24 centro ",
              phone: "+57 2 4895000 Ext. 9115",
              schedules:
                "Lunes a Jueves (8:30am - 7:00pm) Viernes y Sábado (8:30am - 8:00pm) Domingo (9:00am - 3:00pm)",
            },
            "FQ008 - Cucuta - CC Unicentro": {
              lat: 7.917479,
              lng: -72.492888,
              address:
                "Avenida Libertadores # 1 - 21 Centro Comercial Unicentro Local 1-24",
              phone: "+57 (7) 5782688",
              schedules:
                "Lunes a Sábado (10:00 am - 8:00 pm) Domingo: (10:00 am - 8:00 Pm)",
            },
          },
        },
        Dosquebradas: {
          lat: "4.82903",
          lng: "-75.678372",
          stores: {
            "Q049 - Dosquebradas - CC Unico": {
              lat: 4.82903,
              lng: -75.678372,
              address: "Calle 24 #16-25 Av. Simón Bolivar local 1011",
              phone: "+57 2 4895000 Ext. 9049 - 3421770",
              schedules:
                "Lunes a Viernes (10:00am - 8:00pm) Sábado (10:00am - 9:00pm) Domingo (10:00am - 8:30pm)",
            },
          },
        },
        Florencia: {
          lat: "1.626016",
          lng: "-75.605951",
          stores: {
            "Q077 - Florencia - CC Gran Plaza": {
              lat: 1.626016,
              lng: -75.605951,
              address:
                "Carrera 3 A bis #21A -14 Gran Plaza Florencia Caqueta local ",
              phone: "+57 2 4895000 Ext. 9077 - 4347636",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingos (11:00am - 8:00pm)",
            },
          },
        },
        Florida: {
          lat: "3.32322",
          lng: "-76.2328",
          stores: {
            "FQ006 - Florida - Centro": {
              lat: 3.323087,
              lng: -76.232511,
              address: "CL 9 N15-04 ESQUINA BARRIO PUERTO NUEVO",
              phone: "+57 (2) 2643243 - 2640622, Cel: +57 3104370386",
              schedules:
                "Lunes a Sábado (8:30am - 7:00pm) Domingo (9:00am - 1:00pm)",
            },
          },
        },
        Granada: {
          lat: "3.5471",
          lng: "-73.7124",
          stores: {
            "FQ021 - Granada - Centro": {
              lat: 3.5471,
              lng: -73.7124,
              address: "Calle 15 # 13 - 34 Local 1",
              phone: "3102588692",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingo (9:00am - 5:00pm)",
            },
          },
        },
        Huila: {
          lat: "2.1972338",
          lng: "-75.6285436",
          stores: {
            "FQ048 - Huila - Garzón": {
              lat: 2.1972338,
              lng: -75.6285436,
              address: "Calle 7  10  44 Barrio CENTRO",
              phone: "3123811427",
              schedules:
                "Lunes a Jueves (9:00am - 1:00pm y 2:30pm a 7:00pm) Viernes y Sábados (Jornada contínua) Domingo (9:00am - 1:00pm)",
            },
          },
        },
        Ibague: {
          lat: "4.436275",
          lng: "-75.202837",
          stores: {
            "Q069 - Ibague - Centro": {
              lat: 4.443341,
              lng: -75.240153,
              address: "Cra 3 # 12 - 57 ",
              phone: "+57 2 4895000 Ext. 9069 - 2619116",
              schedules:
                "Lunes a Jueves (9:30am - 7:30pm) Viernes y Sábado (9:00am - 8:00pm) Domingos (10:00am - 2:00pm)",
            },
            "Q085 - Ibague - CC la Estacion": {
              lat: 4.447496,
              lng: -75.203294,
              address: "Calle 60 # 12 - 224 Locales 225 - 226",
              phone: "+57 2 4895000 Ext. 9085 - 2761721",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 8:30pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        Ipiales: {
          lat: "0.827852",
          lng: "-77.648832",
          stores: {
            "Q090 - Ipiales - CC Gran Plaza": {
              lat: 0.827852,
              lng: -77.648832,
              address: "Calle 245 #23-6B local 136",
              phone: "+57 2 4895000 Ext. 9090",
              schedules:
                "Lunes a Jueves (10:00am - 8:00 pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
            "Q090 - Ipiales - Centro": {
              lat: 0.8248245,
              lng: -77.6390291,
              address: "Cra 7 #13-07 esquina barrio centro ",
              phone: "+57 2 4895000 Ext. 9126",
              schedules: "Por Definir",
            },
          },
        },
        Jamundí: {
          lat: "3.2632650123750904",
          lng: "-76.54012799263",
          stores: {
            "FQ16 - Jamundí - QUEST JAMUNDI": {
              lat: 3.2632650123750904,
              lng: -76.54012799263,
              address: "CC EL CACIQUE - CARRERA 11 # 11 - 51 LOCAL 26",
              phone: "+57 2481050",
              schedules:
                "Lunes a Sábado (10:00am - 8:00 pm) Domingos y Festivos (10:00am - 2:00pm)",
            },
          },
        },
        Medellin: {
          lat: "6.161005",
          lng: "-75.605289",
          stores: {
            "Q94 - Medellin - Centro Comercial Aventura": {
              lat: 6.1815656,
              lng: -75.6013374,
              address: "carrera 52 #65-86 segundo piso local 250 ",
              phone: "+57 (2) 4895000 Ext. 9112 - 3664327",
              schedules:
                "Lunes a Sábado (10:00AM-08:00PM) Domingos (11:00AM-07:00PM)",
            },
            "Q113 - Medellin - viva envigado": {
              lat: 6.1759308,
              lng: -75.593299,
              address: "carrera 48 # 32b sur 139 Local 221",
              phone: "+57 (2) 4895000 Ext 9113",
              schedules:
                "Lunes a Sábado (10:00AM-09:00PM) Domingos (11:00AM-08:00PM)",
            },
            "Q076 - Medellin - CC Florida": {
              lat: 6.270771,
              lng: -75.577255,
              address: "Calle 71 # 65 - 150 Local 1405",
              phone: "+57 2 4895000 Ext. 9076 - 3664169",
              schedules:
                "Lunes a jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
            "Q112 - Medellin - CC Los Molinos": {
              lat: 6.264233,
              lng: -75.567326,
              address: "Calle 30A #82A-26 Local 13-05",
              phone: "",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        Monteria: {
          lat: "8.76333",
          lng: "-75.872885",
          stores: {
            "Q062 - Monteria - CC Alamedas de Sinú": {
              lat: 8.76333,
              lng: -75.872885,
              address: "Calle 44 #10-91",
              phone: "+57 2 4895000 Ext. 9062 - 7892823",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 7:00pm)",
            },
            "Q107 - Monteria - CC Nuestro Monteria": {
              lat: 8.75,
              lng: -75.8833,
              address: "Calle 29 #29-69 local 471- 473 Barrio San José ",
              phone: "+57 (2)4895000 Ext. 9107 - 7890517",
              schedules:
                "Lunes y Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        Nariño: {
          lat: "1.8072113990783691",
          lng: "-78.76390075683594",
          stores: {
            "FQ38 - Nariño - QUEST Tumaco": {
              lat: 1.8072113990783691,
              lng: -78.76390075683594,
              address: "CARRERA 7 #13-07 ESQUINA -BARRIO CENTRO",
              phone: "316 4311091",
              schedules:
                "Lunes a Sábado (9:00am - 8:00pm) Domingos y festivos (9:00am - 1:00pm)",
            },
          },
        },
        Neiva: {
          lat: "2.949905",
          lng: "-75.287826",
          stores: {
            "Q053 - Neiva - CC San Pedro Plaza": {
              lat: 2.949905,
              lng: -75.287826,
              address: "Carrera 8 # 38 - 42 Local 166",
              phone: "+57 4895000 Ext. 9053 - 8624545",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingos (11:00am - 8:00pm)",
            },
            "Q071 - Neiva - Centro": {
              lat: 2.928449,
              lng: -75.289516,
              address: "Carrera 5 #9-24 local 1 centro Neiva ",
              phone: "+57 2 4895000 Ext. 9071 - 8643531",
              schedules:
                "Lunes a Jueves (9:00am - 7:00pm) Viernes y Sábado (9:00am - 7:30pm) Domingos (9:00am - 2:00pm)",
            },
            "Q098 - Neiva - CC Santa Lucia": {
              lat: 2.93433,
              lng: -75.248029,
              address: "Calle8 # 48 - 145 Local 102-103",
              phone: "+57 2 4895000 Ext. 9098",
              schedules:
                "Lunes a Jueves (10:00am - 8:30pm) Viernes y Sábado (10:00am - 9:00pm) Domingos (11:00am - 8:00pm)",
            },
            "Q117 - Neiva - CC UNICO LOCAL 17": {
              lat: 2.9622568,
              lng: -75.2942312,
              address: "Calle 64 # 1d-140 local 17",
              phone: "(2) 4895000 Ext. 9117",
              schedules:
                "Lunes a jueves (10:00am - 8:00pm) Viernes y Sábados (10:00am - 9:00pm) Domingos y Festivos (10:00am - 8:00pm)",
            },
          },
        },
        Norte_de_Santander: {
          lat: "7.375532",
          lng: "-72.6481618",
          stores: {
            "FQ042 - Norte_de_Santander - Pamplona": {
              lat: 7.375532,
              lng: -72.6481618,
              address: "Calle 6 # 6-16 Barrio Centro",
              phone: "3143444389",
              schedules:
                "Lun-Sab 9:00 am a 7:00 pm, Dom-Fest 9:00 am a 1:00 pm.",
            },
          },
        },
        Palmira: {
          lat: "3.527835",
          lng: "-76.296861",
          stores: {
            "Q087 - Palmira - Centro": {
              lat: 3.5274995,
              lng: -76.2993794,
              address: "Carrera 26 # 30 - 91 Local 107",
              phone: "+57 2 4895000 Ext. 9087 - 2855680",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingos y Festivos (9:00am - 1:00pm)",
            },
            "Q088 - Palmira - CC Llano Grande": {
              lat: 3.52771,
              lng: -76.3186187,
              address: "Cl 31 #44 239 Local 402-405",
              phone: "(2) 4895000 Ext. 9088",
              schedules:
                "Lunes a jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingos y Festivos (11:00am - 8:00pm)",
            },
            "Q089 - Palmira - CC Unicentro": {
              lat: 3.540361,
              lng: -76.31072,
              address: "Calle 42 # 39 - 68 Locales 104 - 105",
              phone: "+57 2 4895000 Ext. 9089 - 2855679",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        ocana: {
          lat: "8.1230",
          lng: "-73.215",
          stores: {
            "FQ034 - ocana - CC City Gold": {
              lat: 8.23575,
              lng: -73.35333,
              address: "CALLE 11 # 13-50 CC CITY GOLD LOCAL 102",
              phone: "+57 7 5528883",
              schedules:
                "Lunes a Sábado (8:30am - 7:15pm) Domingo (9:00am - 1:00pm)",
            },
          },
        },
        Pasto: {
          lat: "1.216548",
          lng: "-77.288679",
          stores: {
            "Q045 - Pasto - CC Unicentro": {
              lat: 1.216548,
              lng: -77.288679,
              address: "Carrera 35A #11-137 local 142-143",
              phone: "+57 2 4895000 Ext. 9045 - 7226599",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingo (10:00am - 7:00pm)",
            },
            "Q057 - Pasto - CC Unico": {
              lat: 1.206368,
              lng: -77.262479,
              address: "Calle 22 # 6 - 61 Local 15",
              phone: "+57 2 4895000 Ext. 9057 - 7364364",
              schedules:
                "Lunes a jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 8:30pm) Domingo (10:00am - 8:30pm)",
            },
            "FQ33 - Pasto - QUEST PASTO": {
              lat: 1.2152524093037294,
              lng: -77.278733253479,
              address: "CALLE 18 No 24-93 PLAZA NARIÑO ESQUINA CHIRACABA",
              phone: "3122967295",
              schedules: "Lunes a Sábado (9:00am - 7:00pm)",
            },
          },
        },
        Pereira: {
          lat: "4.809089",
          lng: "-75.741955",
          stores: {
            "Q038 - Pereira - CC Unicentro": {
              lat: 4.809089,
              lng: -75.741955,
              address:
                "Centro comercial Unicentro AVN 30 de agosto #75-80 local B10",
              phone: "+57 2 4895000 Ext. 9038 - 3441494",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingo (11:00am - 7:00pm)",
            },
            "Q058 - Pereira - CC Victoria Plaza": {
              lat: 4.804154,
              lng: -75.693746,
              address: "Carrera 11 Bis # 17 - 20 Local 207",
              phone: "+57 2 4895000 Ext. 9058 - 3413451",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingo (11:00am - 7:00pm)",
            },
            "Q105 - Pereira - Centro, Edificio Beneficencia": {
              lat: 4.813714,
              lng: -75.693097,
              address: "Carrera 8 # 17 - 59 Local 101",
              phone: "+57 2 4895000 Ext. 9105 - 3402460",
              schedules:
                "Lunes a viernes (9:00am - 7:30pm) Sábado (9:00am - 7:30pm) Domingo (10:00am - 4:00pm)",
            },
          },
        },
        Pitalito: {
          lat: "1.860995",
          lng: "-76.051596",
          stores: {
            "Q056 - Pitalito - CC San Antonio Plaza": {
              lat: 1.860995,
              lng: -76.051596,
              address:
                "Carrera 15 #19A-01-sur cc Gran Plaza San Antonio local 191-192-193",
              phone: "+57 2 4895000 Ext. 9056",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        Popayan: {
          lat: "2.459129",
          lng: "-76.594705",
          stores: {
            "Q030 - Popayan - CC Campanario": {
              lat: 2.459129,
              lng: -76.594705,
              address: "Carrera 9 # 24AN - 21 Local 104",
              phone: "+57 2 4895000 Ext. 9030 - 8339364",
              schedules:
                "Lunes a Viernes (10:00am - 8:00pm) Sábado (10:00am - 9:00pm) Domingos (11:00am - 8:00pm)",
            },
            "Q044 - Popayan - Centro": {
              lat: 2.440741,
              lng: -76.607326,
              address: "Calle 6 # 7 - 32",
              phone: "+57 2 4895000 Ext.9044 - 8393818",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingo (9:00am - 1:00pm)",
            },
          },
        },
        Putumayo: {
          lat: "0.494988",
          lng: "-76.4988989",
          stores: {
            "FQ044 - Putumayo - Puerto Asis": {
              lat: 0.494988,
              lng: -76.4988989,
              address: "Calle 10 #25-67 BARRIO EL CARMEN.",
              phone: "3132888241",
              schedules:
                "Lunes a Sábados (8:00am - 7:30pm) Domingos y festivos (8:30am - 2:00pm)",
            },
            "FQ047 - Putumayo - Mocoa": {
              lat: 1.1458548307418823,
              lng: -76.6463851928711,
              address: "calle 8 #4-36-40",
              phone: "310 4124151",
              schedules:
                "Lunes a Sábado (8:30am - 8:00pm) Domingos y festivos (9:00am - 6:00pm)",
            },
          },
        },
          Quibdo: {
          lat: "5.683",
          lng: "-76.65",
          stores: {
            "FQ013 - Quibdo - Centro": {
              lat: 5.687688,
              lng: -76.661193,
              address: "Carrera 4 # 22-40",
              phone: "3216243092",
              schedules:
                "Lunes a Sábados (9:00am - 7:00pm) Domingo (10:00am - 2:00pm)",
            },
          },
        },
        San_Jose_Del_Guaviare: {
          lat: "2.5728251",
          lng: "-72.6418511",
          stores: {
            "FQ46 - San_Jose_Del_Guaviare": {
              lat: 2.5728251,
              lng: -72.6418511,
              address: "CL 8 24 42 BRR CENTRO",
              phone: "318 2507009",
              schedules:
                "Lunes a Sábado (8:00am - 9:00pm) Domingos y Festivos (9:00am - 7:00pm)",
            },
          },
        },
        Santander: {
          lat: "3.007209",
          lng: "-76.4838578",
          stores: {
            "FQ32 - Santander - QUEST SANTANDER": {
              lat: 3.007209,
              lng: -76.4838578,
              address: "CARRERA 11 # 4 - 49",
              phone: "3162592491",
              schedules:
                "Lunes a Sábado (9:00am - 7:30pm) Domingos y Festivos (9:00am - 1:00pm)",
            },
          },
        },
        "Santa Marta": {
          lat: "11.231967",
          lng: "-74.199988",
          stores: {
            "Q84 - Santa Marta - Centro ": {
              lat: 11.24396,
              lng: -74.2104458,
              address: "Carrera 5 #15-19 cc Catedral plaza local 3 ",
              phone: "(2) 4895000 Ext 9084",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingos y Festivos (9:00am - 1:00pm)",
            },
          },
        },
        Sevilla: {
          lat: "4.2657684",
          lng: "-75.9368913",
          stores: {
            "Q123 - Sevilla - Centro ": {
              lat: 4.2657684,
              lng: -75.9368913,
              address: "cra 51 con calle 52 esquina #52-13 centro",
              phone: "(2)4895000 ext 9123",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingos y Festivos (9:00am - 1:00pm)",
            },
          },
        },
        Sincelejo: {
          lat: "9.300907",
          lng: "-75.394518",
          stores: {
            "Q054 - Sincelejo - Centro": {
              lat: 9.300907,
              lng: -75.394518,
              address: "Cra 19 # 23 - 12 ",
              phone: "+57 2 4895000 Ext.9054 - 2760022",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingos (9:00am - 2:00pm)",
            },
            "Q118 - Sincelejo - CC Guacari LOCAL 2304": {
              lat: 9.3002527,
              lng: -75.384184617,
              address: "Centro comercial Guacari local 2304",
              phone: "+57 2 4895000 Ext.9118",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingos (11:00am - 7:00pm)",
            },
          },
        },
        Soledad: {
          lat: "10.926857",
          lng: "-74.779403",
          stores: {
            "Q078 - Soledad - CC Gran Plaza del Sol": {
              lat: 10.927015,
              lng: -74.779295,
              address: "Cra 37 # 30 - 33",
              phone: "+57 2 4785000 Ext. 9078 - 3286851",
              schedules:
                "Lunes (10:00am - 8:00pm) Martes a Sábado (10:00am - 9:00pm) Domingo (10:00am - 8:00pm)",
            },
            "Q106 - Soledad - CC Nuestro Atlántico": {
              lat: 10.904876,
              lng: -74.801949,
              address: "calle 63 # 13-71 Local 10-10",
              phone: "+57 2 4895000 Ext. 9106 - 3930020",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        Tulua: {
          lat: "4.078577",
          lng: "-76.200988",
          stores: {
            "Q007 - Tulua - CC del Parque": {
              lat: 4.078577,
              lng: -76.200988,
              address: "Calle 27 # 26 - 26 Local 201",
              phone: "+57 2 4895000 Ext. 9007",
              schedules:
                "Lunes a Sábado (9:00am - 7:00pm) Domingo(9:00am - 1:00pm)",
            },
            "Q014 - Tulua - CC la Herradura": {
              lat: 4.083807,
              lng: -76.203781,
              address: "Carrera 19 # 28 - 76 Locales F1 - F2",
              phone: "+57 2 4895000 Ext. 9014 - +57 2 2334433",
              schedules:
                "Lunes a Sábado (10:00am - 8:00pm) Domingo (11:00am - 7:00pm)",
            },
            "Q122 - Tulua - Centro ": {
              lat: 4.084443,
              lng: -76.1978645,
              address: "Calle 27 #25-01 - centro",
              phone: "(2)4895000 Ext 9122",
              schedules:
                "Lunes a Sábado (08:00am - 8:00pm) Domingos y Festivos (08:00am - 5:00pm)",
            },
          },
        },
        Valledupar: {
          lat: "10.454488",
          lng: "-73.248222",
          stores: {
            "Q080 - Valledupar - CC Mayales Plaza": {
              lat: 10.454488,
              lng: -73.248222,
              address: "Calle 31 # 64 - 133 Local 109",
              phone: "+57 2 4895000 Ext. 9080 - 5885824",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingos (10:00am - 8:00pm)",
            },
            "Q102 - Valledupar - CC Guatapuri": {
              lat: 10.49487,
              lng: -73.268781,
              address: "Avenida Hurtado diagonal 10 # 6n-15 Local 001-002",
              phone: "+57 2 4895000 Ext 9102",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingos (12:00pm - 8:00pm)",
            },
          },
        },
        Valle_del_Cauca: {
          lat: "4.532569",
          lng: "-76.1038637",
          stores: {
            "FQ045 - Valle_del_Cauca - La Union": {
              lat: 4.532569,
              lng: -76.1038637,
              address: "CALLE15 #15-48 LA CRUZ CENTRO",
              phone: "3106242560",
              schedules:
                "Lunes a Sábado (09:00am - 7:30pm) Domingos (9:30am - 1:00pm)",
            },
            "FQ049 - Valle_del_Cauca - Candelaria": {
              lat: 3.408374547958374,
              lng: -76.34701538085938,
              address: "CARRERA 7 # 3-20 BARRIO OBRERO",
              phone: "3104370386",
              schedules:
                "Lunes a Sábado (09:00am - 7:30pm) Domingos (9:00am - 1:00pm)",
            },
            "FQ050 - Valle_del_Cauca - Roldanillo": {
              lat: 4.413021087646484,
              lng: -76.1545181274414,
              address: "Calle 7 #04 -82/104 local 4",
              phone: "3106242560",
              schedules:
                "Lunes a Sábado (09:00am - 7:30pm) Domingos (9:30am - 2:00pm)",
            },
          },
        },
        Villavicencio: {
          lat: "4.141603",
          lng: "-73.633869",
          stores: {
            "Q074 - Villavicencio - CC Unico": {
              lat: 4.129113,
              lng: -73.623149,
              address: "Carrera 22 # 8A - 285 Local 13",
              phone: "+57 2 4895000 Ext. 9074 - 6674117",
              schedules:
                "Lunes a Jueves (10:00am - 8:30pm) Viernes (10:00am - 9:00pm) Sábado (9:30am - 9:30pm) Domingo (10:00am - 8:30pm)",
            },
            "Q086 - Villavicencio - CC Viva Villavicencio": {
              lat: 4.130509,
              lng: -73.619259,
              address: "Calle 7A # 45 - 185 Local 111",
              phone: "+57 2 4895000 Ext. 9086",
              schedules:
                "Lunes a Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        Yopal: {
          lat: "5.335039",
          lng: "-72.383469",
          stores: {
            "Q083 - Yopal - CC Unicentro": {
              lat: 5.34775,
              lng: -72.38986,
              address: "Carrera 29 # 14 - 470 Local 101",
              phone: "+57 2 4895000 Ext. 9083 - 6333047",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes y Sábado (10:00am - 9:00pm) Domingo (11:00am - 8:00pm)",
            },
          },
        },
        Yumbo: {
          lat: "3.580266",
          lng: "-76.486572",
          stores: {
            "Q073 - Yumbo - CC Unico": {
              lat: 3.580266,
              lng: -76.486572,
              address: "Calle 15 # 5 - 6 Local 19",
              phone: "+57 2 4895000 Ext. 9073 - 6957311",
              schedules:
                "Lunes a Jueves (10:00am - 8:00pm) Viernes (10:00am - 8:30pm) Sábado (10:00am - 9:00pm) Domingo (10:00am - 8:00pm)",
            },
          }
        },
      },
    },
  };
}
window.onload = loadScript;
