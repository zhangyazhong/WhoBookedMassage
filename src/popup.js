$('#homepage').click(function() {
    chrome.tabs.create({
        'url': 'https://github.com/zhangyazhong/WhoBookedMassage',
        'active': true
    }, function(tab) {});
});

$('.switch-input').click(function() {
    let switchName = $(this).attr('id');
    let option = $(this).is(':checked') ? 1 : 0;
    setValueToChromStorage(switchName, option);
});

var showInCalendarSwitch = 'show-in-calendar-switch';
var showInPopupSwitch = 'show-in-popup-switch';

$(function () {
    setSwitchOption(showInCalendarSwitch, 0);
    setSwitchOption(showInPopupSwitch, 1);
    $('body').removeAttr('style');
});

function setSwitchOption(switchName, defaultValue = 0) {
    chrome.storage.local.get(switchName, function (result) {
        let option = parseInt(result[switchName] === undefined ? defaultValue : result[switchName]);
        setSwitchOnHtml(switchName, option);
    });
}

function setSwitchOnHtml(name, option) {
    $('#' + name).prop('checked', option === 1);
}

function setValueToChromStorage(name, value) {
    chrome.storage.local.set({[name]: value}, function() {});
}