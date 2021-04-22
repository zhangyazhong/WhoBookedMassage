var showInCalendarSwitch = 'show-in-calendar-switch';
var showInPopupSwitch = 'show-in-popup-switch';

$(function() {
    let eventRegx = /_list_event.push\(\{[^)]+\)/g;
    let htmlSource = $('html').html();
    let eventsRaw = htmlSource.match(eventRegx);
    var eventsObj = eventsRaw.map(eventRaw => {
        var id = getPropertyFromEventRaw(eventRaw, 'id');
        var alias = getAliasFromEmail(getPropertyFromEventRaw(eventRaw, 'description'));
        var status = getPropertyFromEventRaw(eventRaw, 'status');
        return {
            'id': id,
            'alias': alias,
            'statue': status
        };
    });

    eventsObj.forEach(eventObj => console.log(eventObj));

    chrome.storage.local.get(showInCalendarSwitch, function (result) {
        let option = parseInt(result[showInCalendarSwitch] === undefined ? 0 : result[showInCalendarSwitch]);
        if (option === 1) {
            eventsRaw.forEach(eventRaw => {
                var id = getPropertyFromEventRaw(eventRaw, 'id');
                var alias = getAliasFromEmail(getPropertyFromEventRaw(eventRaw, 'description'));
                var status = getPropertyFromEventRaw(eventRaw, 'status');
                if (status.toLowerCase() === 'reserved') {
                    $('.ca-elp' + id).html(alias);
                }
            });
        }
    });

    chrome.storage.local.get(showInPopupSwitch, function (result) {
        let option = parseInt(result[showInPopupSwitch] === undefined ? 1 : result[showInPopupSwitch]);
        if (option === 1) {
            let tooltips = [];
            $('.chip.cbrd').each(function () {
                let className = '';
                for (className of $(this).attr('class').split(' ')) {
                    if (className.includes('ca-evp')) {
                        break;
                    }
                }

                let eventId = className.substring(6);
                let eventObj = getEventById(eventsObj, eventId);
                tooltips.push({
                    'eventId': eventId,
                    'tooltip': new mdb.Tooltip($(this)[0], { title: 'Reserved for ' + eventObj.alias, trigger: 'manual' })
                });
            });
            $('.chip.cbrd').mouseenter(function(e) {
                let element = $(e.target);
                while (!element.hasClass('chip') || !element.hasClass('cbrd')) {
                    element = element.parent();
                }

                let className = '';
                for (className of element.attr('class').split(' ')) {
                    if (className.includes('ca-evp')) {
                        break;
                    }
                }

                let eventId = className.substring(6);
                getTooltipById(tooltips, eventId).show();
            });

            $('.chip.cbrd').mouseleave(function(e) {
                let element = $(e.target);
                while (!element.hasClass('chip') || !element.hasClass('cbrd')) {
                    element = element.parent();
                }

                let className = '';
                for (className of element.attr('class').split(' ')) {
                    if (className.includes('ca-evp')) {
                        break;
                    }
                }

                let eventId = className.substring(6);
                getTooltipById(tooltips, eventId).hide();
            });
        }
    });
});

function getEventById(eventsObj, id) {
    for (var eventObj of eventsObj) {
        if (eventObj.id === id) {
            return eventObj;
        }
    }
}

function getTooltipById(tooltips, id) {
    for (var tooltip of tooltips) {
        if (tooltip.eventId == id) {
            return tooltip.tooltip;
        }
    }
}

function getPropertyFromEventRaw(eventRaw, property) {
    let propertyRegex = new RegExp("'" + property + "'[^,\\r\\n]+", 'g');
    let propertyRaw = eventRaw.match(propertyRegex)[0];
    let valueRaw = propertyRaw.split(':')[1].trim();
    let valueRegex = /[^']+/g;
    return valueRaw.match(valueRegex)[0];
}

function getAliasFromEmail(email)
{
    return email.split('@')[0];
}