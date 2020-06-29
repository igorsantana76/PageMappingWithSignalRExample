"use strict";
var app = app || {};

app = (function (w) {

    var connection = new signalR.HubConnectionBuilder().withUrl("/trackHub").build();
    var connected = false;
    var id = localStorage['id'];

    if (!id) {
        id = localStorage['id'] = createUUID();
    }

    function registerPageAccess() {
        if (connected) {
            onFocus = true;

            var relativeUrl = getRelativeUrl().trim();

            console.log(relativeUrl)

            if (!!relativeUrl)
                connection.invoke("RegisterPageAccess", id, relativeUrl).catch(function (err) {
                    return console.error(err.toString());
                });
        }
    }

    function registerDisconnectFromPage() {
        if (connected) {
            onfocus = false;
            connection.invoke("RegisterDisconnectFromPage").catch(function (err) {
                return console.error(err.toString());
            });
        }

    }

    // Hub do chat
    var onFocus = false;
    var idleTime = 0;

    // Visiblity
    // main visibility API function 
    // check if current tab is active or not
    var hasVisibility = (function () {

        var stateKey,
            eventKey,
            keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
            };

        for (stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }

        return function (c) {
            if (c) document.addEventListener(eventKey, c);
            return !document[stateKey];
        }
    })();

    // Utils
    function createUUID() {
        return "uuid-" + ((new Date).getTime().toString(16) + Math.floor(1E7 * Math.random()).toString(16));
    }

    function getRelativeUrl() {
        return window.location.pathname + window.location.search
    }

    function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    return {
        init: function () {

            // initiating the signalR connection
            connection.start()
                .then(function () {
                    connected = true;
                })
                .catch(function (error) {
                    return console.error(err.toString());
                });

            connection.onreconnecting(function () {
                connected = true;
            });

            connection.onclose(function () {
                connected = false;
            });

            this.listeners();

            // increment the idle time counter every minute
            var idleInterval = setInterval(timerIncrement, 60000);

            // reset the idle timer on any action
            $(w).mousemove(throttle(function (e) {
                reset();
            }, 5000));
            $(w).keypress(throttle(function (e) {
                reset();
            }, 5000));
            $(w).click(throttle(function (e) {
                reset();
            }, 5000));
            $(w).scroll(throttle(function (e) {
                reset();
            }, 5000));

            function reset() {

                idleTime = 0;

                if (!onFocus)
                    registerPageAccess();
            }

            function timerIncrement() {

                idleTime = idleTime + 1;

                if (idleTime > 4 && onFocus) { // 5 minutes
                    console.log('Five minutes away, registering disconnect from page to tracking analytics.')
                    registerDisconnectFromPage();
                }
            }
        },

        listeners: function () {
            // https://greensock.com/forums/topic/9059-cross-browser-to-detect-tab-or-window-is-active-so-animations-stay-in-sync-using-html5-visibility-api/
            // check if current tab is active or not
            hasVisibility(function () {

                if (hasVisibility()) {
                    setTimeout(function () {
                        console.log(true)
                        registerPageAccess();
                    }, 300);

                } else {
                    registerDisconnectFromPage();
                }
            });

            // check if browser window has focus        
            var notIE = (document.documentMode === undefined),
                isChromium = w.chrome;

            if (notIE && !isChromium) {

                // checks for Firefox and other NON IE Chrome versions
                $(w).on("focusin", function () {
                    setTimeout(function () {
                        registerPageAccess();
                    }, 300);
                })
                    .on("focusout", function () {
                        registerDisconnectFromPage();
                    });

            } else {

                // checks for IE and Chromium versions
                if (w.addEventListener) {

                    // bind focus event
                    w.addEventListener("focus", function (event) {

                        setTimeout(function () {
                            registerPageAccess();
                        }, 300);

                    }, false);

                    // bind blur event
                    w.addEventListener("blur", function (event) {
                        registerDisconnectFromPage();
                    }, false);

                } else {

                    // bind focus event
                    w.attachEvent("focus", function (event) {

                        setTimeout(function () {
                            registerPageAccess();
                        }, 300);

                    });

                    // bind focus event
                    w.attachEvent("blur", function (event) {
                        registerDisconnectFromPage();
                    });
                }
            }
        }
    }
})(window);

app.init();