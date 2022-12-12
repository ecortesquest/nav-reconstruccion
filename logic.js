function goToSearchMobile() {
  var urlToSearch = jQuery(
    ".search-header-mobile .buscadorCustomVtex"
  ).val();
  "" != urlToSearch && (window.location.href = "/" + urlToSearch);
}
function goToSearch() {
  var urlToSearch = jQuery(".search-header .buscadorCustomVtex").val();
  "" != urlToSearch && (window.location.href = "/" + urlToSearch);
}
jQuery(document).on("click", ".toSearch", function () {
  goToSearch();
}),
  jQuery(".search-header-mobile .buscadorCustomVtex").keypress(function (
    e
  ) {
    13 == e.which && goToSearchMobile();
  }),
  jQuery(".search-header .buscadorCustomVtex").keypress(function (e) {
    13 == e.which && goToSearch();
  });