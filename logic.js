"use strict";
jQuery("img.lazy").lazy(), jQuery(".bg-lazy").lazy();
var ip = null;
if (
  ($.getJSON("https://api.ipify.org?format=json", function (data) {
    ip = data.ip;
  }),
  jQuery(window).scroll(function () {
    var sticky = jQuery("#quest_header_2021");
    jQuery(window).scrollTop() >= 100
      ? sticky.addClass("sticky")
      : sticky.removeClass("sticky");
  }),
  void 0 === window.createCookie)
)
  createCookie = function (name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3);
      var expires = "; expires=" + date.toGMTString();
    } else expires = "";
    var domain = window.location.hostname;
    (domain = (domain = domain.replace("www.", "")).replace("www2.", "")),
      (document.cookie =
        name + "=" + value + expires + ";domain=." + domain + ";path=/");
  };
if (void 0 === window.updateCookie)
  updateCookie = function (name, value) {
    document.cookie = name + "=" + value + "; path=/";
  };
if (void 0 === window.readCookie)
  readCookie = function (name) {
    for (
      var nameEQ = name + "=", ca = document.cookie.split(";"), i = 0;
      i < ca.length;
      i++
    ) {
      for (var c = ca[i]; " " == c.charAt(0); ) c = c.substring(1, c.length);
      if (0 == c.indexOf(nameEQ))
        return unescape(c.substring(nameEQ.length, c.length));
    }
    return "";
  };
var cerrarCountDown = function () {
  createCookie("contador", "true", 1);
  window.innerWidth <= 991
    ? jQuery("#quest_content_2021").css({
        "margin-top": "100px",
      })
    : jQuery("#quest_content_2021").css({
        "margin-top": "180px",
      }),
    $("#countDown").remove();
};
var questFunctions = (function () {
  var shelvs_process = function () {
      $(".contentShelve, .showcase-shelf").each(function () {
        var self = $(this),
          discounter = self
            .find(".customTags .tagDescuento")
            .attr("data-discount");
        if (!self.hasClass("proccessed_tags")) {
          if (
            discounter &&
            discounter.includes("/") &&
            (discounter = discounter.split("/"))[0] != discounter[1]
          ) {
            var value_1 = discounter[0]
                .replace("$", "")
                .replace(".", "")
                .replace(".", "")
                .replace(",00", ""),
              value_2 = discounter[1]
                .replace("$", "")
                .replace(".", "")
                .replace(".", "")
                .replace(",00", ""),
              steo_3 =
                100 * ((Number(value_2) - Number(value_1)) / Number(value_2));
            self
              .find(".customTags .tagDestaque")
              .append(
                '<p class="flag discount">' + steo_3.toFixed(0) + "%</p>"
              );
          }
          self.addClass("proccessed_tags");
        }
        if (!self.hasClass("proccessed_prices")) {
          if (self.find(".bestPrice")) {
            if ((value = self.find(".bestPrice").html()))
              var valorFinalTarjeta = (value = value.replace(",00", ""));
            self.find(".bestPrice").html(value);
          }
          if (self.find(".uniquePrice")) {
            if ((value = self.find(".uniquePrice").html()))
              valorFinalTarjeta = value = value.replace(",00", "");
            self.find(".uniquePrice").html(value);
          }
          if (self.find(".productList")) {
            var value;
            if ((value = self.find(".productList").html()))
              valorFinalTarjeta = value = value.replace(",00", "");
            self.find(".productList").html(value);
          }
          self.find(".customTags .tagDestaque .bancolombia").length > 0 &&
            void 0 != valorFinalTarjeta &&
            null != valorFinalTarjeta &&
            ((valorFinalTarjeta = valorFinalTarjeta
              .replace("$ ", "")
              .replace(".", "")),
            self
              .find(".priceProduct .prices")
              .append(
                "<span class='tc-bancolombia'>$ " +
                  formatPrice(
                    valorFinalTarjeta - 0.4 * valorFinalTarjeta,
                    ".",
                    ",",
                    "2"
                  ) +
                  "</span>"
              )),
            self.addClass("proccessed_prices");
        }
      });
    },
    newsletter_footer = function () {
      $("#neswletter-footer").on("submit", function (e) {
        var nombre = jQuery(".name_footer").val(),
          email = jQuery(".email_footer").val(),
          ruta = jQuery("#custRuta_footer").val(),
          terminos = jQuery(
            "input:checkbox[name=terminos_footer]:checked"
          ).val();
        if ("" == email || null == email || void 0 == email || 0 == terminos)
          $("#neswletter-footer")
            .find(".error")
            .html(
              "Por favor digite todos los datos y aceptar tÃ©rminos y condiciones"
            )
            .show();
        else {
          var co_json = {
            firstName: nombre,
            newsletterPosition: ruta,
            email: email,
            isNewsletterNew: terminos,
            isNewsletterOptIn: !0,
            ipClient: ip,
          };
          $.ajax({
            headers: {
              Accept: "application/vnd.vtex.ds.v10+json",
              "Content-Type": "application/json",
            },
            data: JSON.stringify(co_json),
            type: "PATCH",
            url: "/api/dataentities/CL/documents/",
            success: function (data, textStatus, xhr) {
              console.log(data),
                ("200" != xhr.status &&
                  "201" != xhr.status &&
                  "304" != xhr.status) ||
                  ($("#neswletter-footer").find(".sucsses").show(),
                  $("#neswletter-footer").find(".inputs-content").hide(),
                  $("#neswletter-footer")
                    .find(".terms-content")
                    .find(".terminos-condiciones")
                    .hide(),
                  $("#neswletter-footer")
                    .find(".terms-content")
                    .find("button")
                    .hide());
            },
            error: function (data) {
              console.log(data),
                $("#neswletter-footer")
                  .find(".error")
                  .html("Un error ha ocurrido por favor intente mÃ¡s tarde")
                  .show();
            },
          });
        }
      });
    };
  return {
    init: function () {
      shelvs_process(), newsletter_footer();
    },
    helpers: function () {
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
        }),
        $(
          "#quest_content_2021 .FiltroVitrina .main .sub select option[value=OrderByBestDiscountDESC]"
        ).html("Mejor descuento");
      if ($(window).width() >= 601 && $(window).width() <= 992) {
        $(document).on("click", ".openMenuMobile", function () {
          if ($(".quest_menu_tablet").hasClass("active")) {
            $(".quest_menu_tablet").removeClass("active");
          } else {
            $(".quest_menu_tablet").addClass("active");
          }
        });
        $(document).on("click", ".contentSearch", function () {
          $(".btn_remove_search_mobile")[0] ||
            ($(".contentSearch").addClass("active"),
            $(".contentSearch").append(
              '<div class="btn_remove_search_mobile">x</div>'
            ));
        });
        if ($(".HasTopBanner")[0]) {
          function setWithTopBanner() {
            $("body").addClass("PageHasTopBanner"),
              $(".HasTopBanner").css("height");
          }
          setWithTopBanner(),
            $(window).resize(function () {
              setWithTopBanner();
            });
        }
        $(document).on(
          "click",
          ".quest_menu_tablet li.hasSub .rely .centry a",
          function (e) {
            e.preventDefault();
            $(".quest_menu_tablet li.hasSub").removeClass("active");
            $(this).parent().parent().parent().addClass("active");
            $(".quest_menu_tablet li.hasSub .subMenu").removeClass("active");
            $(this)
              .parent()
              .parent()
              .parent()
              .find(".subMenu")
              .addClass("active");
          }
        );
        $(document).on("click", ".openerFiltersMobile", function () {
          $(".FiltroVitrina .filtros").addClass("active");
        });
        $(document).on("click", ".closerFiltersMobile", function () {
          $(".FiltroVitrina .filtros").removeClass("active");
        });
      }
      if ($(window).width() <= 600) {
        console.log("entro if 2");
        $(document).on(
          "click",
          ".columFooter .innerColumFooter h2",
          function () {
            $(".columFooter .innerColumFooter h2").removeClass("active"),
              $(".columFooter .innerColumFooter ul").removeClass("active"),
              $(this).toggleClass("active"),
              $(this).parent().find("ul").toggleClass("active");
          }
        );
        $(document).on(
          "click",
          "header#quest_header_2021 .quest_menu ul li.hasSub .rely .centry > a",
          function (e) {
            $(this).hasClass("active")
              ? ($(this).removeClass("active"),
                $(this)
                  .parent()
                  .parent()
                  .parent()
                  .find(".subMenu")
                  .removeClass("active"))
              : ($(this).addClass("active"),
                $(this)
                  .parent()
                  .parent()
                  .parent()
                  .find(".subMenu")
                  .addClass("active")),
              e.preventDefault();
          }
        );
        $(document).on("click", ".openMenuMobile", function () {
          if ($(".quest_menu").hasClass("active")) {
            $(".quest_menu").removeClass("active");
          } else {
            $(".quest_menu").addClass("active");
          }
        });
        $(document).on("click", ".closeMenuMobile", function () {
          $(".quest_menu").removeClass("active");
        }),
          $(document).on("click", ".contentSearch", function () {
            $(".btn_remove_search_mobile")[0] ||
              ($(".contentSearch").addClass("active"),
              $(".contentSearch").append(
                '<div class="btn_remove_search_mobile">x</div>'
              ));
          });
        $(document).on("click", ".btn_remove_search_mobile", function () {
          setTimeout(function () {
            $(".contentSearch").removeClass("active"),
              $(".btn_remove_search_mobile").remove();
          }, 200);
        });
        $(document).on("click", ".openerFiltersMobile", function () {
          $(".FiltroVitrina .filtros").addClass("active");
        });
        $(document).on("click", ".closerFiltersMobile", function () {
          $(".FiltroVitrina .filtros").removeClass("active");
        });
        if ($(".HasTopBanner")[0]) {
          function setWithTopBanner() {
            $("body").addClass("PageHasTopBanner"),
              $(".HasTopBanner").css("height");
          }
          setWithTopBanner(),
            $(window).resize(function () {
              setWithTopBanner();
            });
        }
      }
      /*if (window.innerWidth <= 425 && ($(document).on("click", ".columFooter .innerColumFooter h2", function() {
                    $(".columFooter .innerColumFooter h2").removeClass("active"), $(".columFooter .innerColumFooter ul").removeClass("active"), $(this).toggleClass("active"), $(this).parent().find("ul").toggleClass("active")
                }), 
                
                $(document).on("click", "header#quest_header_2021 .quest_menu ul li.hasSub .rely .centry > a", function(e) {
                    $(this).hasClass("active") ? ($(this).removeClass("active"), $(this).parent().parent().parent().find(".subMenu").removeClass("active")) : ($(this).addClass("active"), $(this).parent().parent().parent().find(".subMenu").addClass("active")), e.preventDefault()
                })), 
                
                $(document).on("click", ".openMenuMobile", function() {
                    $(".quest_menu").addClass("active")
                }), 
                
                $(document).on("click", ".closeMenuMobile", function() {
                    $(".quest_menu").removeClass("active")
                }), 
                
                $(document).on("click", ".contentSearch", function() {
                    $(".btn_remove_search_mobile")[0] || ($(".contentSearch").addClass("active"), $(".contentSearch").append('<div class="btn_remove_search_mobile">x</div>'))
                }), 
                
                $(document).on("click", ".btn_remove_search_mobile", function() {
                    setTimeout(function() {
                        $(".contentSearch").removeClass("active"), $(".btn_remove_search_mobile").remove()
                    }, 200)
                }), $(document).on("click", ".openerFiltersMobile", function() {
                    $(".FiltroVitrina .filtros").addClass("active")
                }), $(document).on("click", ".closerFiltersMobile", function() {
                    $(".FiltroVitrina .filtros").removeClass("active")
                }), $(".HasTopBanner")[0]) {
                function setWithTopBanner() {
                    $("body").addClass("PageHasTopBanner"), $(".HasTopBanner").css("height")
                }
                setWithTopBanner(), $(window).resize(function() {
                    setWithTopBanner()
                })
                
                
            }
            function goToSearch() {
                var urlToSearch = jQuery(".buscadorCustomVtex").val();
                "" != urlToSearch && (window.location.href = "/" + urlToSearch)
            }
            jQuery(document).on("click", ".toSearch", function() {
                goToSearch()
            }), jQuery(".buscadorCustomVtex").keypress(function(e) {
                13 == e.which && goToSearch()
            }), $("#quest_content_2021 .FiltroVitrina .main .sub select option[value=OrderByBestDiscountDESC]").html("Mejor descuento")*/
    },
    header: function () {
      $(document).on(
        "click",
        "header#new-header .container-header .container-icons .search-header svg",
        function (e) {
          if ($(".input-buscar").hasClass("active")) {
            $(".input-buscar").removeClass("active");
          } else {
            $(".input-buscar").addClass("active");
          }
        }
      );
      $(document).on(
        "click",
        "header#new-header .container-header  .search-header-mobile svg",
        function (e) {
          if ($(".input-buscar").hasClass("active")) {
            $(".input-buscar").removeClass("active");
          } else {
            $(".input-buscar").addClass("active");
          }
        }
      );
      $(document).on(
        "click",
        "header#new-header .container-header .container-icons .minicart-header a",
        function (e) {
          if ($("#mini-cart").hasClass("active")) {
            $("#mini-cart").removeClass("active");
          } else {
            $("#mini-cart").addClass("active");
          }
        }
      );
      $(document).on("click", ".openMenuMobile", function () {
        if (
          $("#new-header .container-header .menuNew > ul").hasClass("active")
        ) {
          $("#new-header .container-header .menuNew > ul").removeClass(
            "active"
          );
        } else {
          $("#new-header .container-header .menuNew > ul").addClass("active");
        }
      });
      if ($(window).width() >= 601 && $(window).width() <= 992) {
        $(document).on(
          "click",
          "#new-header .container-header .menuNew ul li.hasMenu > a",
          function (e) {
            e.preventDefault();
            $(
              "#new-header .container-header .menuNew ul li.hasMenu"
            ).removeClass("active");
            $(this).parent().addClass("active");
            $(
              "#new-header .container-header .menuNew ul li.hasMenu .submenu"
            ).removeClass("active");
            $(this).parent().find(".submenu").addClass("active");
          }
        );
      }

      if ($(window).width() <= 600) {
        $(document).on(
            
          "click",
          "#new-header .container-header .menuNew ul li.hasMenu > a",
          function (e) {
            if ($(this).parent().find(".submenu").hasClass("active")) {
              $(
                "#new-header .container-header .menuNew ul li.hasMenu .submenu"
              ).removeClass("active");
              $(this).parent().find(".submenu").removeClass("active");
            } else {
              $(this).parent().find(".submenu").addClass("active");
            }

            e.preventDefault();
          }
        );
        $(document).on(
          "click",
          "#new-header .container-header .menuNew ul li.hasMenu .submenu.active .title-menu",
          function (e) {
            if ($(this).parent().find("li").hasClass("active")) {
              $(this).parent().find("li").removeClass("active");
            } else {
              $(this).parent().find("li").addClass("active");
            }
          }
        );
        $(document).on("click", ".closeMenuMobile", function () {
          $(".menuNew ul").removeClass("active");
        });
        $(document).on("click", ".btn_remove_search", function () {
          $(".input-buscar").removeClass("active");
        });
      }
    },
    shelvs_process: shelvs_process,
    generales: function () {
      if (
        (jQuery("#countDown").hide(),
        0 == readCookie("contador").length && jQuery("#countDown").length > 0)
      ) {
        (date = new Date()).getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds();
        var fechaActual = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes()
          ),
          var1 = jQuery("#countDown .dateEnd").html().split(" "),
          fechasola = var1[0].split("-"),
          horasola = var1[1].split(":"),
          countDownDate = new Date(
            fechasola[0],
            parseInt(fechasola[1]) - 1,
            fechasola[2],
            horasola[0],
            horasola[1]
          ),
          var2 = jQuery("#countDown .dateStart").html().split(" "),
          fechasola2 = var2[0].split("-"),
          horasola2 = var2[1].split(":");
        if (
          fechaActual >=
          new Date(
            fechasola2[0],
            parseInt(fechasola2[1]) - 1,
            fechasola2[2],
            horasola2[0],
            horasola2[1]
          )
        )
          if (fechaActual <= countDownDate) {
            var x = setInterval(function () {
              var now = new Date().getTime(),
                distance = countDownDate - now,
                days = Math.floor(Number(distance) / 864e5),
                hours = Math.floor((Number(distance) % 864e5) / 36e5),
                minutes = Math.floor((Number(distance) % 36e5) / 6e4),
                seconds = Math.floor((Number(distance) % 6e4) / 1e3);
              jQuery("#countDown .Days p").html(days),
                jQuery("#countDown .Hours p").html(hours),
                jQuery("#countDown .Minutes p").html(minutes),
                jQuery("#countDown .Seconds p").html(seconds),
                distance < 0 &&
                  (clearInterval(x),
                  (document.getElementById("countDown").innerHTML = "EXPIRED"));
            }, 10);
            jQuery("#countDown").show(),
              window.innerWidth <= 991
                ? jQuery("#quest_content_2021").css({
                    "margin-top": "190px",
                  })
                : jQuery("#quest_content_2021").css({
                    "margin-top": "235px",
                  });
          } else jQuery("#countDown").hide(), jQuery("#countDown").remove();
        else jQuery("#countDown").hide(), jQuery("#countDown").remove();
      } else jQuery("#countDown").remove();
      jQuery(".topheaderrota").length &&
        jQuery(".topheaderrota").slick({
          lazyLoad: "ondemand",
          lazyIndicator: "/arquivos/ajax-loader.gif",
          dots: !1,
          infinite: !1,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: !1,
          speed: 600,
          autoplay: !0,
          autoplaySpeed: 8e3,
        }),
        jQuery(".footerbannerrota").length &&
          jQuery(".footerbannerrota").slick({
            lazyLoad: "ondemand",
            lazyIndicator: "/arquivos/ajax-loader.gif",
            dots: !1,
            infinite: !1,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: !1,
            speed: 600,
            autoplay: !0,
            autoplaySpeed: 8e3,
          });
      var itemsPromo = jQuery(".promo-item").length,
        current_div = jQuery("#sitewide-footer");
      jQuery(".promo-content-text:first").find("span").text();
      if (
        (jQuery(".promo-subtitle").text("( " + itemsPromo + " Disponibles )"),
        current_div.addClass("items-" + itemsPromo),
        jQuery(".promoDrawer-wrapper").click(function () {
          var titlePromo = jQuery(".promo-title").text("mÃ¡s descuentos"),
            current_div =
              (jQuery(".promo-content-text:first").find("span").text(),
              jQuery("#sitewide-footer"));
          current_div.hasClass("open-menu-force") &&
          titlePromo.text("mÃ¡s descuentos")
            ? current_div.removeClass("open-menu-force")
            : (jQuery(".promoDrawer-wrapper").each(function () {
                current_div.removeClass("open-menu-force");
              }),
              current_div.addClass("open-menu-force"),
              titlePromo.text("mÃ¡s descuentos"));
        }),
        jQuery("li.helperComplement").remove(),
        jQuery(document).on("ajaxStop ready", function () {
          jQuery("li.helperComplement").remove();
        }),
        jQuery(".subMenuVitrines").length &&
          jQuery(".subMenuVitrines ul li").length > 0 &&
          jQuery(".subMenuVitrines").show(),
        $(".whatsapp-icon").length > 0)
      ) {
        var date = new Date();
        (fechaActual = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        )),
          "domingo" !=
          [
            "domingo",
            "lunes",
            "martes",
            "miÃ©rcoles",
            "jueves",
            "viernes",
            "sÃ¡bado",
          ][new Date(fechaActual).getDay()]
            ? (date.getHours() < 7 || date.getHours() > 19) &&
              $(".whatsapp-icon").remove()
            : $(".whatsapp-icon").remove();
      }
      jQuery(".boletas-icon").length > 0 &&
        (jQuery(".first-img").click(function () {
          jQuery(this).hide(), jQuery(".hover-big").show();
        }),
        jQuery(".second-img").click(function () {
          jQuery(".first-img").show(), jQuery(".hover-big").hide();
        }));
    },
    newsletter_footer: newsletter_footer,
  };
})();
jQuery(document).ready(function () {
  questFunctions.init();
  questFunctions.generales();
  questFunctions.shelvs_process();
  questFunctions.helpers();
  questFunctions.header();
}),
  jQuery(window).on("load", function () {
    jQuery(document).on("ajaxStop ready", function () {
      questFunctions.shelvs_process();
    });
  });

console.log("first");
