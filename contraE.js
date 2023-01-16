addiAllySlug = "quest-ecommerce";
$.getScript(
  "https://s3.amazonaws.com/statics.addi.com/vtex/js/vtex-checkout-co.bundle.min.js"
);

(function ($) {
  $.fn.changes = function (cb, e) {
    e = e || {
      subtree: true,
      childList: true,
      characterData: true,
    };
    $(this).each(function () {
      function callback(changes) {
        cb.call(node, changes, this);
      }
      var node = this;
      new MutationObserver(callback).observe(node, e);
    });
  };
})(jQuery);
var addressAutocomplete = function () {
  function addAutocomplete() {
    $("#contenedor-direccion, .tipo-via, .street-error").remove();
    $("#ship-street")
      .unbind("change")
      .off("change")
      .attr("readonly", "readonly");
    var html = "<span class='tipo-via'>Tipo de vía*</span>";
    html += "<div id='contenedor-direccion'>";
    html += "<div class='contenedor-tipo-via'>";
    html += "<select id='tipo-via'>"; // onchange='validateAddress()'
    html += '<option value="">Seleccionar tipo de vía</option>';
    html += '<option value="Avenida">Avenida</option>';
    html += '<option value="Avenida Calle">Avenida Calle</option>';
    html += '<option value="Avenida Carrera">Avenida Carrera</option>';
    html += '<option value="Calle">Calle</option>';
    html += '<option value="Carrera">Carrera</option>';
    html += '<option value="Circular">Circular</option>';
    html += '<option value="Diagonal">Diagonal</option>';
    html += '<option value="Transversal">Transversal</option>';
    html += '<option value="Autopista">Autopista</option>';
    html += '<option value="Kilometro">Kilómetro</option>';
    html += '<option value="Circunvalar">Circunvalar</option>';
    html += '<option value="Manzana">Manzana</option>';
    html += '<option value="Apartado Aéreo">Apartado Aéreo</option>';
    html += "</select>";
    html += "</div>";
    html +=
      '<input type="text" id="numero-1" placeholder="Ej: 46C" maxlength="15" />';
    html += "<span>#</span>";
    html +=
      '<input type="text" id="numero-2" placeholder="42A" maxlength="15" />';
    html += "<span> - </span>";
    html +=
      '<input type="text" id="numero-3" placeholder="21" maxlength="15" />';
    html += "</div>";

    $(html).insertBefore("#ship-street");
    $(
      '<span class="help error street-error">Este valor es requerido.</span>'
    ).insertAfter("#ship-street");
    validateChar();
    validateShipStreet();

    $(document).on("change", "#tipo-via", validateAddress);
  }

  function validateShipStreet() {
    if (vtexjs.checkout.orderForm) {
      let orderFormShippingData = vtexjs.checkout.orderForm.shippingData;
      if (
        orderFormShippingData &&
        orderFormShippingData.selectedAddresses != ""
      ) {
        if (orderFormShippingData.selectedAddresses.length > 0) {
          let selectedAddress =
            orderFormShippingData.selectedAddresses[0].street;
          if (selectedAddress) {
            selectedAddress = selectedAddress
              .replace(" #", "")
              .replace(" -", "")
              .split(" ");
            $(document).find("#tipo-via").val(selectedAddress[0]);
            $(document).find("#numero-1").val(selectedAddress[1]);
            $(document).find("#numero-2").val(selectedAddress[2]);
            $(document).find("#numero-3").val(selectedAddress[3]);
          }
        }
      }
      if ($("#ship-street").val() !== "") {
        $("#btn-go-to-payment").removeAttr("disabled");
      }
    }
  }
  function validateAddress() {
    const tipoVia = $("#tipo-via").val();
    if (tipoVia !== "Kilometro") {
      $("#numero-1,#numero-2,#numero-3").removeAttr("disabled");
      $("#btn-go-to-payment, #ship-street").attr("disabled", "disabled");
      var val1 = $.trim($("#tipo-via").val());
      var val2 = $.trim($("#numero-1").val());
      var val3 = $.trim($("#numero-2").val());
      var val4 = $.trim($("#numero-3").val());
      if (val1 == "") {
        $("#btn-go-to-payment,#numero-1,#numero-2,#numero-3").attr(
          "disabled",
          "disabled"
        );
        $("#numero-1,#numero-2,#numero-3").val("");
      } else $("#numero-1,#numero-2,#numero-3").removeAttr("disabled");

      var value =
        val1 +
        " " +
        val2 +
        (val3 != "" ? " # " : "") +
        val3 +
        (val4 != "" ? " - " : "") +
        val4;

      var input = document.getElementById("ship-street");
      var addEventValue = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      addEventValue.call(input, value);
      value = new Event("input", {
        bubbles: true,
      });
      input.dispatchEvent(value);

      if (val1 == "" || val2 == "") {
        $("#ship-street").val("");
      }

      if (val1 != "" && val2 != "" && val3 != "" && val4 != "") {
        console.log("address details are complete");
        $("#btn-go-to-payment").removeAttr("disabled");
      } else if (val1 != "" || val2 != "" || val3 != "" || val4 != "") {
        console.log("address not complete yet");
        // $("#ship-street").val('');
        // $("#btn-go-to-payment").attr("disabled", "disabled");
      }
      if ($("#ship-street").val() !== "") {
        $("#ship-street").next(".error").hide();
        $("#btn-go-to-payment").removeAttr("disabled");
      } else {
        $("#ship-street").next(".error").show();
        $("#btn-go-to-payment").attr("disabled", "disabled");
      }
    } else {
      $("#numero-1,#numero-2,#numero-3").attr("disabled", "disabled");
      $("#btn-go-to-payment").removeAttr("disabled");
      $("#ship-street").removeAttr("disabled").removeAttr("readonly");
    }
  }

  function validateChar() {
    var val1 = $.trim($("#tipo-via").val());
    if (val1 == "") {
      $("#btn-go-to-payment,#numero-1,#numero-2,#numero-3").attr(
        "disabled",
        "disabled"
      );
      $("#numero-1,#numero-2,#numero-3").val("");
    } else $("#numero-1,#numero-2,#numero-3").removeAttr("disabled");
    $("#numero-1,#numero-2,#numero-3")
      .off("keyup paste")
      .on("keyup paste", function (e) {
        var alphaNumericAndSpaces = /^[a-zA-Z0-9 ]*$/;
        if (!e) var e = window.event;
        if (e.keyCode) code = e.key.charCodeAt(0);
        else if (e.which) code = e.which;
        var character = String.fromCharCode(code);
        if (code == 27) {
          this.blur();
          return false;
        }
        if (character.match(alphaNumericAndSpaces)) {
          $(".help.error.street-char-error").remove();
          validateAddress();
          return true;
        } else {
          $(".help.error.street-char-error").remove();
          $("#btn-go-to-payment").attr("disabled", "disabled");
          $(
            '<span class="help error street-char-error" style="margin-top:0;margin-bottom:10px;">Sólo se pueden introducir números y letras.</span>'
          ).insertAfter($("#contenedor-direccion"));
          return false;
        }
      });
    $("#numero-1,#numero-2,#numero-3")
      .off("blur change")
      .on("blur change", function (e) {
        var alphaNumericAndSpaces = /^[a-zA-Z0-9 ]*$/;
        if (this.value.match(alphaNumericAndSpaces)) {
          validateAddress();
        } else {
          return false;
        }
      });
  }

  addAutocomplete();
};
var popupRevisarDatos = function () {
  $("#popuprevisar").show(0, function () {
    jQuery(this).addClass("open");
  });
  $("#popuprevisar.open").click(function () {
    jQuery(this).hide();
    jQuery(this).removeClass("open");
  });
};
var addMetodoEnvio = function () {
  vtexjs.checkout.getOrderForm().then(function (orderform) {
    if (orderform.clientProfileData != null) {
      var email = orderform.clientProfileData.email;
      $.ajax({
        url: `/api/dataentities/CL/search?_where=email=${email}&_fields=id,isEmploye`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.vtex.ds.v10+json",
          "X-VTEX-API-AppKey": "vtexappkey-quest-VOFQPP",
          "X-VTEX-API-AppToken":
            "VBUFGZMVOUVWQPGYDIRDHLSOZHNBHBRNBRICXRCZOFAOQGBIHVSPUSEVETRJNXKPPHWEFVBKIBZGJYCWVJGONZVGEQTEINOLUIHLJXKUJCODBGVEUMOJUANZCVLMCGDX",
        },
      })
        .done((data) => {
          if (data[0].isEmploye === true) {
            console.log("soy empleado");
            $(".shp-lean-option#Entrega-en-oficina").css("display", "flex");
            $(".shp-lean-option#Entrega-en-oficina input").trigger("click");
          } else {
            console.log("no soy empleado");
            $(".shp-lean-option#Entrega-en-oficina").css("display", "none");
            if ($(".shp-lean-option#Entrega-en-oficina input").is(":checked")) {
              $("#delivery-packages-options > div:nth-child(1) input").trigger(
                "click"
              );
            }
          }
        })
        .error((error) => {
          console.log(error, "error");
        });
    } else {
      if ($(".shp-lean-option#Entrega-en-oficina input").is(":checked")) {
        $("#delivery-packages-options > div:nth-child(1) input").trigger(
          "click"
        );
      }
    }
  });
};
var contraentrega = function () {
  vtex.events.subscribe("CheckoutStates", function (state) {
    var method =
      vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].selectedSla;
    switch (method) {
      case "Contra Entrega":
        $("#payment-group-promissoryPaymentGroup > span").text(
          "Pago Contra Entrega"),
          $("#payment-group-custom201PaymentGroupPaymentGroup").click(),
          $("#payment-group-customPrivate_501PaymentGroup").hide(),
          $(".link-gift-card").hide(),
          $("#payment-group-SisteCreditoPaymentGroup").hide(),
          $("#payment-group-AddiPaymentGroup").hide(),
          $("#payment-group-custom201PaymentGroupPaymentGroup").hide(),
          $("#payment-group-debitPaymentGroup").hide(),
          $("#payment-group-bankInvoicePaymentGroup").hide(),
          $("#payment-group-creditCardPaymentGroup").hide(),
          $("#show-gift-card-group ").hide(),
          $("fieldset.custom201PaymentGroupPaymentGroup").show();
        break;
      default:
        $("#payment-group-custom201PaymentGroupPaymentGroup").hide(),
          $("fieldset.custom201PaymentGroupPaymentGroup").hide(),
          $("#payment-group-creditCardPaymentGroup").click();
    }

    0 ==
      $(".vtex-omnishipping-1-x-submitPaymentButton .message-remember")
        .length &&
      $(".vtex-omnishipping-1-x-submitPaymentButton").prepend(
        "<div class='message-remember'>Por favor verifique que los datos de envío estén correctos antes de continuar.</div>"
      );
  }),
    setInterval(function () {
      var method =
        vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].selectedSla;
      switch (method) {
        case "Contra Entrega":
          $("#payment-group-promissoryPaymentGroup > span").text(
            "Pago Contra Entrega"
          ),
            $("#payment-group-custom201PaymentGroupPaymentGroup").click(),
            $("#payment-group-customPrivate_501PaymentGroup").hide(),
            $(".link-gift-card").hide(),
            $("#payment-group-SisteCreditoPaymentGroup").hide(),
            $("#payment-group-AddiPaymentGroup").hide(),
            $("#payment-group-custom201PaymentGroupPaymentGroup").hide(),
            $("#payment-group-debitPaymentGroup").hide(),
            $("#payment-group-bankInvoicePaymentGroup").hide(),
            $("#payment-group-creditCardPaymentGroup").hide(),
            $("#show-gift-card-group ").hide(),
            $("fieldset.custom201PaymentGroupPaymentGroup").show();
          break;
        default:
          $("#payment-group-custom201PaymentGroupPaymentGroup").hide(),
            $("fieldset.custom201PaymentGroupPaymentGroup").hide();
      }
      0 ==
        $(".vtex-omnishipping-1-x-submitPaymentButton .message-remember")
          .length &&
        $(".vtex-omnishipping-1-x-submitPaymentButton").prepend(
          "<div class='message-remember'>Por favor verifique que los datos de envío estén correctos antes de continuar.!</div>"
        );
    }, 2e3);
};
$("body").changes(function (changes, observer) {
  if (
    $(".ship-street").length > 0 &&
    $(".ship-street").find("#contenedor-direccion").length < 1
  ) {
    addressAutocomplete();
    addMetodoEnvio();
  }
});

$(window).on("hashchange, orderFormUpdated.vtex", function (evt, orderForm) {
  addressAutocomplete();
});
window.addEventListener("popstate", function () {
  vtex.events.subscribe("CheckoutStates", function (state) {
    if (state == "payment") {
      popupRevisarDatos();
    }
  });
  setTimeout(function () {
    if ($("#ship-city").val()) {
      console.log("hola 2");
      addMetodoEnvio();
    }
  }, 2000);
});
$(document).ready(function () {
  vtex.events.subscribe("CheckoutStates", function (state) {
    if (state == "payment") {
      popupRevisarDatos();
    }
  });

  setTimeout(function () {
    if (location.hash == "#/cart") {
      document
        .querySelector(".cart-active .totalizers table.table")
        .insertAdjacentHTML(
          "afterend",
          '<div class="accordion-terminos"> <p>     <input type="checkbox" id="terminosch" value="terminoschx"   required="required" checked><span>Confirmo que soy mayor de edad y acepto los Terminos y condiciones de la <a href="/privacidad-seguridad" target="_blank">Politica de Tratamiento de Datos</a>     </span> </p></div>'
        );
      document
        .getElementById("terminosch")
        .addEventListener("change", function () {
          if (event.target.checked == false) {
            document.getElementById("cart-to-orderform").style.opacity = "0.4";
            document.getElementById("cart-to-orderform").style.pointerEvents =
              "none";
          } else {
            document.getElementById("cart-to-orderform").style.opacity = "1";
            document.getElementById("cart-to-orderform").style.pointerEvents =
              "inherit";
          }
        });
    }
  }, 1000);
});
$(window).load(function () {
  //addMetodoEnvio();
  contraentrega();
});
