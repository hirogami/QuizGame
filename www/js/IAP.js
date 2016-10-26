/**
 * Created by Raihan on 9/25/2016.
 */

var PRODUCT_ID_ADFREE = "com.dteam.halloween.adfree";
var PRODUCT_ID_QUESTIONS = "com.dteam.halloween.questions";
var localStorage = window.localStorage | {};

IAP = {
  list: [PRODUCT_ID_ADFREE,PRODUCT_ID_QUESTIONS],
  adFree: false,
  boughtQuestion: false
};

IAP.load = function () {
  if(localStorage.getItem(PRODUCT_ID_ADFREE) !== null){
    IAP.adFree = localStorage.getItem(PRODUCT_ID_ADFREE);
  }

  if(localStorage.getItem(PRODUCT_ID_QUESTIONS) !== null){
    IAP.boughtQuestion = localStorage.getItem(PRODUCT_ID_QUESTIONS);
  }

  // Check availability of the storekit plugin
  if (!window.storekit) {
    alert("In-App Purchases not available");
    return;
  }

  // Initialize
  storekit.init({
    debug:    true, // Enable IAP messages on the console
    ready:    IAP.onReady,
    purchase: IAP.onPurchase,
    restore:  IAP.onRestore,
    error:    IAP.onError
  });
};

IAP.onReady = function () {
  storekit.load(IAP.list, function (products, invalidIds) {
    IAP.products = products;
    IAP.loaded = true;
    for (var i = 0; i < invalidIds.length; ++i) {
      console.log("Error: could not load " + invalidIds[i]);
    }
  });
};

IAP.onPurchase = function (transactionId, productId, receipt) {
  if(productId === PRODUCT_ID_ADFREE){
    IAP.adFree = true;
    //Code to remove ads for the user
    localStorage.setItem(PRODUCT_ID_ADFREE, true);
    IAP.removePurchaseButtons();
  }

  if(productId === PRODUCT_ID_QUESTIONS){
    IAP.boughtQuestion = true;
    localStorage.setItem(PRODUCT_ID_QUESTIONS, true);
    IAP.removePurchaseButtons();
    alert("Please restart the game");
  }
};

IAP.onRestore = function (transactionId, productId, transactionReceipt) {
  if(productId == PRODUCT_ID_ADFREE){
    //Code to remove ads for the user
    IAP.adFree = true;
    localStorage.setItem(PRODUCT_ID_ADFREE, true);
    IAP.removePurchaseButtons();
  }

  if(productId === PRODUCT_ID_QUESTIONS){
    IAP.boughtQuestion = true;
    localStorage.setItem(PRODUCT_ID_QUESTIONS, true);
    IAP.removePurchaseButtons();
    alert("Please restart the game");
  }
};

IAP.onError = function (errorCode, errorMessage) {
  console.log(errorCode);
  console.log(errorMessage);
};

IAP.buy = function(productId){
  storekit.purchase(productId);
};

IAP.restore = function(){
  storekit.restore();
};

IAP.removePurchaseButtons = function () {
  var parent = document.getElementById("iap");

  if(IAP.adFree) {
    var child = document.getElementById("iap-button");
    parent.removeChild(child);
  }

  if(IAP.boughtQuestion){
    var child = document.getElementById("question-button");
    parent.removeChild(child);
  }

  if(IAP.adFree && IAP.boughtQuestion) {
    child = document.getElementById("restore-button");
    parent.removeChild(child);
  }
}