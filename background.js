var ScriptPosition = 0;
var continueScript = false;
var frame = document.body.firstElementChild;
console.log(frame);

chrome.runtime.onMessage.addListener(MessageParse);

function MessageParse(message, sender, sendresposendResponse) {

    if (message.type == 'StatusMessage') console.log(SenderName(sender) + " says: " + message.text);

    if (message.type == 'CommandMessage')
        switch (message.text) {

            case "start":
                console.log("Script has started1");
                ScriptMainFunc();
                continueScript = true;
                //chrome.tabs.executeScript(null, { file: "main.js" });
                break;

            case "stop":
                console.log("Script has stopped");
                continueScript = false;
                break;

            case "next":
                ScriptPosition++;
                if (continueScript) ScriptMainFunc();
                break;

            case "deloffer":
                DeleteTradeOffer();
                break;

            case "refresh":
                RefreshInfo();
                break;

            default:
                console.log("Unknown command");
        }
}

function ScriptMainFunc() {
    chrome.storage.local.get(null, function (AllStorage) {
        var names = [];
        for (var item in AllStorage) {
            if (item != "statusInfo" && AllStorage[item].on) names.push(item);
        }
        if (ScriptPosition >= names.length) ScriptPosition = 0;
        console.log("ScriptMainFunc, ScriptPosition: " + ScriptPosition );
        console.log(AllStorage);
        if (names.length !== 0) frame.src = AllStorage[names[ScriptPosition]].href;
        else console.log(AllStorage);
    });
}

function DeleteTradeOffer() {
    frame.src = "https://steamcommunity.com/market/";
    //ScriptPosition--;
}

function RefreshInfo() {
    console.log("Information Refreshed");
}

function SenderName(sender) {
    if (typeof (sender.url) === "undefined") return 'Unknown';
    switch (sender.url) {
        case "chrome-extension://glffnjpbdfepflnnmcoglojclmdodogn/popup.html":
            return "Popup"; break;
        case "chrome-extension://bphmfinpbepbcaipnkdnanopopkpmpkl/background.html":
            return "Background"; break;
        default:
            return sender.url;
    };
}

chrome.webRequest.onHeadersReceived.addListener(
    function (info) {
        var headers = info.responseHeaders;
        var index = headers.findIndex(x => x.name.toLowerCase() == "x-frame-options");
        if (index != -1) {
            headers.splice(index, 1);
        }
        return { responseHeaders: headers };
    },
    {
        urls: ['https://steamcommunity.com/market/*'], //['*://*.google.fr/*']
        types: ['sub_frame']
    },
    ['blocking', 'responseHeaders']
);

