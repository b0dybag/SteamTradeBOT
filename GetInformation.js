//console.log("Sontent Script Started!");
//window.addEventListener("load", SomeAction);

//----------------------------------------------------INFO Decoding
var href = window.location.href;
var ItemInfo = { href: href, name: GetName(href), appid: GetAppId(href), count: 0, yprice: "", on: false, xoffer: XofferCheck()};

function GetName(href) {
    //href = href.substring(href.lastIndexOf("/") + 1);
    //href = href.replace(/%20/g, " ");
    //href = href.replace(/%28/g, "(");
    //href = href.replace(/%29/g, ")");
    //return href;
    href = href.substring(href.lastIndexOf("/") + 1);
    return decodeURI(href);
};

function GetAppId(href) {
    href = href.substring(href.lastIndexOf("listings/") + 9);
    href = href.substring(0, href.lastIndexOf("/"));
    return href;
};

function XofferCheck() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', "https://steamcommunity.com/market/", true);

    xhr.send();

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            ConsoleLog("Error: cant get item info");
            return false;
        } else {
            var htmlObject = document.createElement('div');
            htmlObject.innerHTML = this.responseText;
            var list = htmlObject.querySelector("#tabContentsMyListings").lastElementChild;
            list.firstElementChild.remove();
            list.firstElementChild.remove();
            //console.log(list);
            ItemInfo.xoffer = "0";
            while (list.firstElementChild) {
                var link = list.firstElementChild.lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.href;
                if (link == ItemInfo.href) {
                    ItemInfo.xoffer = CountFromString(list.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.lastChild.textContent);
                    break;
                }
                list.firstElementChild.remove();
            }

        }
    }
}

console.log(ItemInfo.name);


//----------------------------------------------------smart timer
var time = 0;
var BuyOrderInfo = document.getElementById("market_commodity_buyrequests");
var smartTimer = setInterval(smartTimerFunction, 10);
function smartTimerFunction() {
    var price = 0;

    try {
        price = BuyOrderInfo.lastElementChild.textContent;
    } catch (e) { }

    if (price && ItemInfo.xoffer !== undefined) {
        ItemInfo.price = CountFromString(price);
        console.log("Load time: " + time + "ms");
        clearInterval(smartTimer);
        inFrameWorker();               //-----main entrance
    } else {
        time += 10;

        if (time > 5000) {
            clearInterval(smartTimer);
            console.log("ERROR: Time out!");
        }
    }
}

function SomeAction() {
    //var timeout = setTimeout(function () {
    //    var BuyOrderInfo = document.getElementById("market_commodity_buyrequests");
    //    if (BuyOrderInfo) {
    //        //console.log(BuyOrderInfo);
    //        //console.log(this);
    //        try {
    //            ItemInfo.price = BuyOrderInfo.lastElementChild.textContent;
    //                chrome.runtime.sendMessage({ type: "StatusMessage", text: ItemInfo.price });
    //        } catch (e) {
    //            chrome.runtime.sendMessage({ type: "StatusMessage", text: "cant load information" });
    //        }
    //    }
    //}, 1000);

    var addButton = document.createElement("button");
    chrome.storage.local.get(null, function (AllStorage) {
        if (AllStorage.hasOwnProperty(ItemInfo.name)) {
            addButton.textContent = "Remove Item";
            addButton.addEventListener("click", onRemoveButtonClick);
        } else {
            addButton.textContent = "Add Item";
            addButton.addEventListener("click", onAddButtonClick);
        }

        function onAddButtonClick() {
            //Market_ShowBuyOrderPopup(753, "876740-Duldrum - High Threat", "Duldrum - High Threat" );
            chrome.runtime.sendMessage({ type: "StatusMessage", text: "You have pressed add button" });
            AllStorage[ItemInfo.name] = ItemInfo;
            chrome.storage.local.set(AllStorage, function () {
                console.log('Added new item');
            });

            addButton.textContent = "Remove Item";
            addButton.removeEventListener("click", onAddButtonClick);
            addButton.addEventListener("click", onRemoveButtonClick);
        }

        function onRemoveButtonClick() {
            chrome.runtime.sendMessage({ type: "StatusMessage", text: "You have pressed remove button" });
            chrome.storage.local.remove(ItemInfo.name, function () {
                console.log('You have delete item');
            });

            addButton.textContent = "Add Item";
            addButton.removeEventListener("click", onRemoveButtonClick);
            addButton.addEventListener("click", onAddButtonClick);
        }
    });

    var imageHolder = document.body.getElementsByClassName("market_listing_largeimage")[0];
    ItemInfo.image = imageHolder.firstElementChild.src;
    imageHolder.insertBefore(addButton, imageHolder.firstElementChild);
}

// ----------------------------------------------------FRAME ONLY

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function inFrameWorker() {
    if (inIframe()) {
        //---------------------------------------------------------------------main shadow work

        chrome.storage.local.get(null, function (AllStorage) {

            //if (ItemInfo.price > AllStorage[ItemInfo.name].xoffer) {
            //    console.log("Iwas here!");
            //    var cancelOrderButton = false;
            //    var oldYPrice = 0;
            //    try {
            //        var tabContentsMyListings = document.getElementById("tabContentsMyListings");
            //        cancelOrderButton = tabContentsMyListings.lastElementChild.lastElementChild.lastElementChild.previousElementSibling.firstElementChild.firstElementChild;
            //    } catch (e) { }
            //    if (cancelOrderButton) {
            //        oldYPrice = CountFromString(tabContentsMyListings.lastElementChild.lastElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.lastChild.textContent);
            //        if (ItemInfo.price > oldYPrice) cancelOrderButton.click();
            //    } else {
            //        document.location.href = "https://steamcommunity.com/market/";
            //        var list = document.getElementById("tabContentsMyListings").lastElementChild;
            //        list.firstElementChild.remove();
            //        list.firstElementChild.remove();
            //        //console.log(list);

            //        while (true) {
            //            var link = list.firstElementChild.lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.href;
            //            if (link == ItemInfo.href) {
            //                var button = list.firstElementChild.lastElementChild.previousElementSibling.firstElementChild.firstElementChild;
            //                button.click();
            //                AllStorage[ItemInfo.name].xoffer = "";
            //                chrome.storage.local.set(AllStorage);
            //                return;
            //            }
            //            list.firstElementChild.remove();
            //        }
            //    }
            //}

            if (AllStorage[ItemInfo.name].yprice > ItemInfo.price) {

                if (ItemInfo.price > ItemInfo.xoffer && ItemInfo.xoffer!=0) {
                    console.log("XOFFER: " + ItemInfo.xoffer + " WHEN PRICE: " + ItemInfo.price);
                    AllStorage[ItemInfo.name].xoffer = ItemInfo.xoffer;
                    AllStorage[ItemInfo.name].price = ItemInfo.price;
                    chrome.storage.local.set(AllStorage);
                    chrome.runtime.sendMessage({ type: "CommandMessage", text: "deloffer" });
                } else {
                    var button = 0;
                    try {
                        button = document.getElementsByClassName("market_commodity_buy_button")[0];
                    } catch (e) { }
                    if (!button) {
                        try {
                            button = document.getElementsByClassName("market_noncommodity_buyorder_button")[0];
                        } catch (e) { }
                    };
                    if (button) {
                        button.click();
                        var input = document.getElementById("market_buy_commodity_input_price");
                        var check = document.getElementById("market_buyorder_dialog_accept_ssa");
                        var button = document.getElementById("market_buyorder_dialog_purchase");
                        input.value = ItemInfo.price - (-0.05);
                        check.click();
                        button.click();

                        AllStorage[ItemInfo.name].xoffer = ItemInfo.price - (-0.05);
                        chrome.storage.local.set(AllStorage);
                    }
                }
            }
        });


        chrome.runtime.sendMessage({ type: "CommandMessage", text: "next" });
    } else SomeAction();
}

function CountFromString(str) {
    str = "" + str;
    var number = "";
    for (var i = 0; i < str.length; i++) {
        if ('0123456789.'.indexOf(str[i]) !== -1) {
            number += str[i];
        };
        if (str[i] == ",") {
            number += ".";
        };
    }
    let isNumber = /^\d+\.?\d+$/.test(number);
    if (isNumber) return number; else return '';
}

function getTaxes(price) {
    price = CountFromString(price);
    if (!price) return '';
    let taxProcent = 0.1304;//3478;
    if (price < 10)
        taxProcent = 0.128;
    var tax = parseFloat(price) * taxProcent;
    return roundDown(tax, 2);
}

function roundDown(number, decimals) {
    decimals = decimals || 0;
    return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
}