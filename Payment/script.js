let paymentID;

let createCheckoutUrl = 'https://merchantserver.sandbox.bka.sh/api/checkout/v1.2.0-beta/payment/create';
let executeCheckoutUrl = 'https://merchantserver.sandbox.bka.sh/api/checkout/v1.2.0-beta/payment/execute';

$(document).ready(function () {
    initBkash();
});

function initBkash() {
    bKash.init({
      paymentMode: 'checkout',
      paymentRequest: {"amount": '85.50', "intent": 'sale'},

      createRequest: function (request) {
        $.ajax({
          url: createCheckoutUrl,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(request),
          success: function (data) {
              
            if (data && data.paymentID != null) {
              paymentID = data.paymentID;
              bKash.create().onSuccess(data);
            } 
            else {
              bKash.create().onError(); 
              alert(data.errorMessage + " Tag should be 2 digit, Length should be 2 digit, Value should be number of character mention in Length, ex. MI041234 , supported tags are MI, MW, RF");
            }

          },
          error: function () {
            bKash.create().onError(); 
            alert(data.errorMessage);
          }
        });
      },
      executeRequestOnAuthorization: function () {
        $.ajax({
          url: executeCheckoutUrl,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({"paymentID": paymentID}),
          success: function (data) {

            if (data && data.paymentID != null) {
              
              alert('[SUCCESS] data : ' + JSON.stringify(data));
              window.location.href = "/success_page.html";

            } else {
              alert('[ERROR] data : ' + JSON.stringify(data));
              bKash.execute().onError();
            }

          },
          error: function () {
            alert('An alert has occurred during execute');
            bKash.execute().onError(); 
          }
        });
      },
      onClose: function () {
        alert('User has clicked the close button');
      }
    });

    $('#bKash_button').removeAttr('disabled');

}


