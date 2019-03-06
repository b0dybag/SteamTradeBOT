//----------------------------------------------------------------start
var names = [];
itemLink = "";

// ----------------------------------------------------FRAME ONLY
//console.log('Deleting...')
chrome.storage.local.get(null, function (AllStorage) {
    //console.log("get info");
    for (var item in AllStorage) {
        if (item != "statusInfo" && AllStorage[item].on) names.push(item);
    }
    //console.log(names);
    if (names.length !== 0) 
        for (var i = 0; i < names.length; i++) {
            console.log(AllStorage[names[i]].price + " < " + AllStorage[names[i]].xoffer);
            if (AllStorage[names[i]].price > AllStorage[names[i]].xoffer) {
                itemLink = AllStorage[names[i]].href;
                console.log("Del procedure with! " + AllStorage[names[i]].name);
                inFrameWorker();  //---------------------------entrence after getting data
                return;
            }
        }
});

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function inFrameWorker() {
    if (inIframe()) {
        var list = document.getElementById("tabContentsMyListings").lastElementChild;
        list.firstElementChild.remove();
        list.firstElementChild.remove();

        while (list.firstElementChild) {
            var link = list.firstElementChild.lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.href;
            console.log(link);

            if (link == itemLink) {
                var button = list.firstElementChild.lastElementChild.previousElementSibling.firstElementChild.firstElementChild;
                button.click();
                chrome.runtime.sendMessage({ type: "CommandMessage", text: "next" });
            } else console.log("DAFUCK!!!!");
            list.firstElementChild.remove();
        }
    }
}