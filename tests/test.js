//QUnit.test("CountFromString()", function( assert ) {
//  assert.ok( 1 == "1", "Passed!" );
//});

QUnit.test("CountFromString(str)", function (assert) {
    function ev(str, num, comment) {
        assert.equal(CountFromString(str), num, comment);
    }
    ev('', '', 'Pusta linia');
    ev('   ', '', 'Tylko spacje');
    ev('test', '', 'Tylko litery');
    ev('te.s,t', '', 'Litery z kropką i Śpiączką');
    ev('324a55', '32455', 'Litera w środku');
    ev('iI11', '11', 'Litery na początku');
    ev('65743432sdfg', '65743432', 'Litery w końcu');
    ev('fadc342s673d234a54f672asf', '34267323454672', 'Mieszane litery');
    ev('123,45', '123.45', 'Śpiączka zostaje zastąpiona kropką');
    ev('123.45', '123.45', 'Kropka zostaje');
    ev('3.', '', 'Konczy sie kropką (3.) ');
    ev('.54', '', 'Zaczyna sie z kropki (.54)');
    assert.deepEqual(CountFromString(34.54), '34.54', 'Format tekstowy');
});

QUnit.test("GetName(href)", function (assert) {
    function ev(str, num, comment) {
        assert.equal(GetName(str), num, comment);
    }
    ev('', '', 'Pusta linia');
    ev('   ', '   ', 'Tylko spacje');
    ev('https://steamcommunity.com/market/listings/730/CS20%20Case', 'CS20 Case', 'CS20 Case');
    ev('/%27Two%20Times%27%20McCoy%20%7C%20USAF%20TACP', '\'Two Times\' McCoy | USAF TACP', '„Two Times” McCoy | USAF TACP');
});

QUnit.test("SenderName(obj)", function (assert) {
    function ev(input, result, comment) { assert.equal(SenderName(input), result, comment); };
    ev('', 'Unknown', 'Wrong input (not object)');
    ev({ url: 'abc' }, 'abc', 'Sender name \'abc\' ');
    ev({ url: 'chrome-extension://bphmfinpbepbcaipnkdnanopopkpmpkl/popup.html' }, 'Popup', 'Popup page');
    ev({ url: 'chrome-extension://bphmfinpbepbcaipnkdnanopopkpmpkl/background.html' }, 'Background', 'Background page');
});

QUnit.test("getTaxes(price)", function (assert) {
    function ev(str, num, comment) {
        assert.equal(getTaxes(str), num, comment);
    }
    ev('', '', 'Pusta linia');
    ev('   ', '', 'Tylko spacje');
    ev('test', '', 'Tylko litery');
    ev('te.s,t', '', 'Litery z kropką i Śpiączką');
    ev('100', '13.04', 'Podatek wynosi okolo 13.04%');
    ev('15', '1.95', 'Ten sam podatek na liczbie 15');
    ev('237', '30.9', 'Podatek na liczbie 237'); // -------------------w steam 30.91
    ev('73,76', '9.61', 'Podatek na liczbie z przecinkiem (73,76)');
    ev('1.7', '0.21', 'Podatek na liczbie z kropka (1.7)');
});

QUnit.test("roundDown(number, decimals)", function (assert) {
    function ev(num, dec, num2, comment) {
        assert.equal(roundDown(num, dec), num2, comment);
    }
    ev('999.999999', '', '999', 'Liczba 999.9999999, zero po przecinku');
    ev('999.999999', '3', '999.999', 'Liczba 999.9999999, 3 po przecinku');
    ev('999.999999', '-1', '990', 'Liczba 999.9999999, -1 po przecinku');
});