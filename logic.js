if ($(window).width() <= 600) {
  $(".o-openMenuMobile").click(function () {
    $(".o-openMenuMobile").addClass("hide");
    $(".o-closeMenuMobile").addClass("show");
    /* $(".container-bottom-header").addClass("active");*/
    $(".menu-movil").addClass("mm-desplegar");
  });

  $(".mm-top-header a").click(function () {
    $(".o-openMenuMobile").removeClass("hide");
    $(".o-closeMenuMobile").removeClass("show");
    /* $(".container-bottom-header").removeClass("active");*/
    $(".menu-movil").addClass("mm-desplegar");
    $(".menu-movil").removeClass("mm-desplegar");
  });
  /* OCULTAR Y MOSTRAR MENú HOMBRE/MUJER*/
  $(".selec-mujer").click(function () {
    $(".mm-nuevo-h").addClass("mm-hide");
    $(".mm-nuevo-m").addClass("mm-show");
    $(".mm-nuevo-m").removeClass("mm-hide");
    $(".selec-hombre").removeClass("isSelected");
    $(".selec-mujer").addClass("isSelected");
  });
  $(".selec-hombre").click(function () {
    $(".mm-nuevo-h").addClass("mm-show");
    $(".mm-nuevo-m").addClass("mm-hide");
    $(".mm-nuevo-h").removeClass("mm-hide");
    $(".selec-mujer").removeClass("isSelected");
    $(".selec-hombre").addClass("isSelected");
  });
  /* OCULTAR Y MOSTRAR OTROS MENÚS*/

  $(document).on("click", ".mm-items > li", function (e) {
    
    var seleccion = $(this).text();
    switch (seleccion) {
      case "value":
        break;
      case "ROPA":
        $(".mm-ropa").addClass("mm-transladar");
        $(".mm-ropa").addClass("mm-transladar");
        break;

      default:
        break;
    }

    e.preventDefault();
  });

  $(document).on(
    "click",
    "#header-2023 .container-bottom-header ul li.menu-item .submenu.desplegar .title-menu",
    function (e) {
      $(".title-menu a").removeAttr("href");
      if (
        $(".title-menu")
          .parent()
          .find("li")
          .hasClass("desplegar-item")
      ) {
        $(this).parent().find("li").removeClass("desplegar-item");
      } else {
        $(this).parent().find("li").addClass("desplegar-item");
      }
    }
  );
  // $(document).on("click", ".buscadorCustomVtex", function (e) {console.log("holamundo")});

  /*  $(".menu-item").click(function () {
    $(".submenu").addClass("desplegar");
  });

  $(".title-menu a").click(function () {              
    $(".title-menu a").removeAttr("href");

  });*/
}