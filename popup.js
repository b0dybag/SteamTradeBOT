var AddButton = document.getElementById("addButton");
var StartButton = document.getElementById("startButton");
var AccountAvatar = document.getElementById("accountAvatar");
var AccountName = document.getElementById("accountName");
var WalletStatus = document.getElementById("walletStatus");
var LinkInput = document.getElementById("linkInput");
var ItemsList = document.getElementById("itemsList");

var Console = document.getElementById("console");
Console.textContent = "";

var itterationCount = 0;
var continueScript = true;
var ProfileInfo = {name:"null"};


StartButton.addEventListener("click", StartScript);
AddButton.addEventListener("click", AddNewItem);
ItemsList.addEventListener("mousedown", clickOnItemsTable);
document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    chrome.storage.local.get(null, function (result) {
        console.log(result);
        for (var item in result) {
            let tr = document.createElement("tr");

            let td = [];
            td[0] = document.createElement("td");
            let button = document.createElement("button");
            if (result[item].on) {
                button.textContent = "ON";
                button.style.background = "green";
            } else {
                button.textContent = "OFF";
                button.style.background = "red";
            }
            td[0].appendChild(button);

            td[1] = document.createElement("td");
            let image = document.createElement("img");
            image.src = result[item].image;
            image.style.width = "40px";
            image.style.height = "40px";
            td[1].appendChild(image);

            td[2] = document.createElement("td");
            td[2].textContent = result[item].name;

            td[3] = document.createElement("td");
            td[3].textContent = result[item].price;

            td[4] = document.createElement("td");
            let input = document.createElement("input");
            input.value = result[item].count;
            input.style.width = "30px";
            td[4].appendChild(input);

            td[5] = document.createElement("td");
            let input2 = document.createElement("input");
            input2.value = result[item].yprice;
            input2.style.width = "60px";
            td[5].appendChild(input2);

            td[6] = document.createElement("td");
            let span = document.createElement("button");
            span.textContent = "X";
            span.style.background = "red";
            td[6].appendChild(span);

            for (var i = 0; i < td.length; i++) {
                tr.appendChild(td[i]);
            }

            ItemsList.appendChild(tr);
        }
    });
    GetPageInfo();
}

function clickOnItemsTable(event) {
    let t = event.target;
    if (t.tagName == "TD" || t.tagName == "TR" || t.tagName == "TH") return;

    if (t.tagName == "INPUT") {
        t.addEventListener("change", onInputBlur);

        function onInputBlur() {
            var price = false;
            var name = "";
            var value = this.value;
            
            if (isNaN(value)) {
                this.classList.add("error");
                this.focus();
            } else {

                if (this.parentNode.nextElementSibling.firstElementChild.tagName == "BUTTON") {
                    price = true;
                    name = this.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
                } else {
                    name = this.parentNode.previousElementSibling.previousElementSibling.textContent;
                };

                this.classList.remove("error");
                chrome.storage.local.get(null, function (AllStorage) {
                    if (price) {
                        AllStorage[name].yprice = value;
                    } else {
                        AllStorage[name].count = value;
                    }
                    chrome.storage.local.set(AllStorage);
                });
                this.removeEventListener("change", onInputBlur);
            }
        }
    }

    if (t.tagName == "BUTTON") {
        if (t.textContent == "ON") {
            t.style.background = "red";
            t.textContent = "OFF";

            let name = t.parentNode.nextElementSibling.nextElementSibling.textContent;
            chrome.storage.local.get(null, function (AllStorage) {
                AllStorage[name].on = false;
                chrome.storage.local.set(AllStorage);
            });
            return;
        }

        if (t.textContent == "OFF") {
            t.style.background = "green";
            t.textContent = "ON";

            let name = t.parentNode.nextElementSibling.nextElementSibling.textContent;
            chrome.storage.local.get(null, function (AllStorage) {
                AllStorage[name].on = true;
                chrome.storage.local.set(AllStorage);
            });
            return;
        }

        if (t.textContent == "X") {
            let nameRow = t.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            chrome.storage.local.remove(nameRow, function () {
                ConsoleLog('You have delete item: ' + nameRow);
            });
            t.parentNode.parentNode.remove();
            return;
        }
    }
}

function StartScript() {
    if (this.textContent == "Start") {
        ConsoleLog("You have started!");
        this.textContent = "Stop";
        chrome.runtime.sendMessage({ type: "StatusMessage", text: "You have started script!" });
        chrome.runtime.sendMessage({ type: "CommandMessage", text: "start"});

    } else {
        ConsoleLog("You have Stoped!");
        this.textContent = "Start";
        chrome.runtime.sendMessage({ type: "StatusMessage", text: "You have stoped script!" });
        chrome.runtime.sendMessage({ type: "CommandMessage", text: "stop" });
    }
}

function AddNewItem() {
    //ConsoleLog("Tring to get some info");

    //var xhr = new XMLHttpRequest();

    //xhr.open('GET', "https://steamcommunity.com/market/", true);

    //xhr.send();

    //xhr.onreadystatechange = function () {
    //    if (this.readyState != 4) return;

    //    if (this.status != 200) {
    //        // обработать ошибку
    //        ConsoleLog("Error: cant get item info");
    //        return false;
    //    } else {
    //        var htmlObject = document.createElement('div');
    //        htmlObject.innerHTML = this.responseText;
    //        var BuyOrderInfo = htmlObject.querySelector("#tabContentsMyListings");
    //        if (BuyOrderInfo) {
    //            console.log(BuyOrderInfo);
    //            //ConsoleLog(BuyOrderInfo.lastElementChild.textContent);
    //        }
    //        else
    //        {
    //            ConsoleLog("Error: Can't find item prices block");
    //        }
    //    }
    //}


    chrome.storage.local.clear();


    //chrome.runtime.sendMessage({ type: "StatusMessage", text: "You presed AddItem" });
    ////chrome.runtime.sendMessage({ type: "CommandMessage", text: "refresh" });
    ////onLoad();
    //if (LinkInput.value.indexOf("steamcommunity.com/market/listings/") != -1) GetItemInfo(LinkInput.value);
    //else ConsoleLog("Error: unknown link");
}

function ConsoleLog(text) {
    Console.textContent += text + "\n";
    Console.scrollTop = Console.scrollHeight;
}

//function GetItemInfo(href) {
//    ConsoleLog("Tring to add your link");

//    var xhr = new XMLHttpRequest();

//    xhr.open('GET', href, true);

//    xhr.send();

//    xhr.onreadystatechange = function () {
//        if (this.readyState != 4) return;

//        if (this.status != 200) {
//            // обработать ошибку
//            ConsoleLog("Error: cant get item info");
//            return false;
//        } else {
//            var htmlObject = document.createElement('div');
//            htmlObject.innerHTML = this.responseText;
//            var BuyOrderInfo = htmlObject.querySelector("#market_commodity_buyrequests");
//            if (BuyOrderInfo) {
//                console.log(BuyOrderInfo);
//                ConsoleLog(BuyOrderInfo.lastElementChild.textContent);
//            }
//            else
//            {
//                ConsoleLog("Error: Can't find item prices block");
//            }
//        }
//    }
//}

function GetItemInfo(href) {
    chrome.tabs.create({ index: 0, url: href, active: false }, function (tab) {
        ConsoleLog(" you opened new tab");
        console.log(tab);
        chrome.tabs.executeScript(tab.id, { file: "GetInformation.js", runAt: "document_end" }, function (tab) { console.log(tab); });
    });
}

function GetPageInfo() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://store.steampowered.com/account/store_transactions/', true);

    xhr.send();

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            // обработать ошибку
            console.log('error: ' + (this.status ? this.statusText : 'request has failed'));
            return false;
        } else {
            var htmlObject = document.createElement('div');
            htmlObject.innerHTML = this.responseText;
            ProfileInfo.name = htmlObject.querySelector("#account_pulldown").textContent;
            ProfileInfo.image = htmlObject.querySelector(".user_avatar").firstElementChild.src;
            ProfileInfo.href = htmlObject.querySelector(".user_avatar").href;
            ProfileInfo.count = htmlObject.querySelector("#header_wallet_balance").textContent;
            console.log(ProfileInfo);

            AccountAvatar.src = ProfileInfo.image;
            AccountName.textContent = ProfileInfo.name;
            AccountName.href = ProfileInfo.href;
            WalletStatus.textContent = ProfileInfo.count;

        }
    }
}

function CountFromString(str) {
    var number = "";
    for (var i = 0; i < str.length; i++) {
        if ('0123456789'.indexOf(str[i]) !== -1) {
            number += str[i];
        };
    }
    return number;
}
