//TODO: add blog module, get jQuery from bower modules
var App = function () {
    "use strict";
    var version = "0.0.1",
        githubLink = "https://",
        mainAppContext = this;

    this.logger = function (module, error, params) {
        var errorMsg = module + ": ";
        if (error === "optionsLacking") {
            errorMsg = "Options object lacking information:";
            params.forEach(function (elem) {
                errorMsg += " " + elem;
            });
        } else if (error === "noOptions") {
            errorMsg += "No options object";
        } else if (error === "no$") {
            errorMsg += "No jQuery present";
        } else if (error === "noContainer") {
            errorMsg += "No such DOM element: " + params;
        } else if (error === "noChildren") {
            errorMsg += params + " has no children elements";
        } else if (error === "initFailed") {
            errorMsg += "Initialization failed";
        } else if (error === "wrongDataType") {
            errorMsg += "Wrong data type/types in the options object";
        }
        if (error) {
            window.console.error(errorMsg);
        } else {
            if (module) {
                window.console.info("csddApps " + module + " v." + version + " Github: " + githubLink);
            } else {
                window.console.info("csddApps v." + version + " Github: " + githubLink);
            }
        }
    };

    this.Slider = function (options) {
        var sliderOpts = {},
            moduleName = "cSlider",
            self = this,
            prepareSlides = function (numberOfSlides, slides, $) {
                var widthOfOne = 100 / numberOfSlides + "%";
                slides.each(function () {
                    $(this).css({
                        "width" : widthOfOne,
                        "float" : "left"
                    });
                    $(this).children().css({
                        "width" : "100%"
                    });
                });
            },
            createSlider = function (options) {
                var $,
                    $container,
                    $slides,
                    sliderName = "cSlider",
                    slideName = "cSlide",
                    upperContainerName = "cSliderContainer",
                    iterator,
                    noOfSlides,
                    $sliderUpperContainer,
                    $wrapper;

                if (typeof window.jQuery !== "function") {
                    self.log("no$");
                    return;
                } else {
                    $ = window.jQuery;
                }
                $container = $(options.sliderContainer);
                if (!$container.length) {
                    self.log("noContainer", options.sliderContainer);
                    return;
                }
                $sliderUpperContainer = $("<div></div>").addClass(upperContainerName).css({
                    "width" : "100%",
                    "overflow" : "hidden"
                });
                $container.addClass(sliderName);
                $slides = $container.children();
                if (!$slides.length) {
                    self.log("noChildren", options.sliderContainer);
                    return;
                }
                $wrapper = $container.parent();
                $sliderUpperContainer.append($container);
                $wrapper.append($sliderUpperContainer);
                iterator = 1;
                $slides.addClass(slideName).each(function () {
                    $(this).attr("data-slide_number", iterator);
                    iterator = iterator + 1;
                });
                noOfSlides = iterator - 1;
                $container.css({
                    "width" : noOfSlides * 100 + "%",
                    "transition" : "all 800ms cubic-bezier(0.77, 0, 0.175, 1)",
                    "transform" : "translateZ(0)",
                    "marginLeft" : "0%"
                });
                prepareSlides(noOfSlides, $slides, $);
            };

        this.log = function (error, params) {
            return mainAppContext.logger(moduleName, error, params);
        };

        /**
         * Initialises the slider and stores the options into a local private var
         * the method is exposed from the constructor for ready use
         * @param options as an object containing properties ->
         * sliderContainer (a jQuery selector)
         * autoScroll (a boolean)
         */
        this.init = function (options) {
            var optionsLacking = [];
            if (!options) {
                this.log("noOptions");
                return;
            }
            if (!options.hasOwnProperty("sliderContainer")) {
                optionsLacking.push("sliderContainer");
            }
            if (!options.hasOwnProperty("autoScroll")) {
                optionsLacking.push("autoScroll");
            }
            if (!options.hasOwnProperty("sliderContainer") ||
                    !options.hasOwnProperty("autoScroll")) {
                this.log("optionsLacking", optionsLacking);
            } else {
                sliderOpts.sliderContainer = options.sliderContainer;
                sliderOpts.autoScroll = options.autoScroll;
                createSlider(sliderOpts);
            }
        };

        /**
         * if the options are inserted directly to the constructor
         * run the initialization automatically
         */
        if (options) {
            this.init(options);
        }
    };

    /**
     * Constructs a Facebook page plugin and appends it to a chosen container
     * @param options go like this: {container: *String* jQuery container || MANDATORY,
     * page: *String* facebook page ID (the xxx in facebook.com/xxx) || MANDATORY,
     * fWidth: *Integer* width in pixels || defaults to 340px,
     * fHeight: *Integer* height in pixels || defaults to 500px,
     * hideCover: *Boolean* hide or show cover photo || defaults to false,
     * showFacePile: *Boolean* show which friends liked this? || defaults to true,
     * adaptWidth : *Boolean* if the container width is smaller than width, should it adapt || defaults to true}
     * @constructor
     */
    this.FacebookPlugin = function (options) {
        var moduleName = "cFacebook",
            fbOpts = {
                tabs: ["timeline"]
            },
            self = this,
            $fbSDK = '<div id="fb-root"></div>' +
                '<script>(function(d, s, id) {' +
                'var js, fjs = d.getElementsByTagName(s)[0];' +
                'if (d.getElementById(id)) return;' +
                'js = d.createElement(s); js.id = id;' +
                'js.src = "//connect.facebook.net/pl_PL/sdk.js#xfbml=1&version=v2.5";' +
                'fjs.parentNode.insertBefore(js, fjs);' +
                "}(document, 'script', 'facebook-jssdk'));</script>",
            checkJQuery = function () {
                if (typeof window.jQuery === "function") {
                    return true;
                }
            },
            constructOptions = function (options, $, def) {
                var optionsLacking = [];
                if (!options) {
                    self.log("noOptions");
                    return def.reject();
                }
                if (!options.hasOwnProperty("container")) {
                    optionsLacking.push("container");
                }
                if (!options.hasOwnProperty("page")) {
                    optionsLacking.push("page");
                }
                if (!options.container || !options.page) {
                    self.log("optionsLacking", optionsLacking);
                    return def.reject();
                }
                fbOpts.container = options.container;
                fbOpts.page = options.page;
                fbOpts.fWidth = options.fWidth || 340;
                fbOpts.fHeight = options.fHeight || 500;
                fbOpts.hideCover = options.hideCover || false;
                fbOpts.showFacePile = options.showFacePile || true;
                fbOpts.adaptWidth = options.adaptWidth || true;
                if (typeof options.page !== "string" ||
                        typeof fbOpts.fWidth !== "number" ||
                        typeof fbOpts.fHeight !== "number" ||
                        typeof fbOpts.hideCover !== "boolean" ||
                        typeof fbOpts.showFacePile !== "boolean" ||
                        typeof fbOpts.adaptWidth !== "boolean") {
                    self.log("wrongDataType");
                    return def.reject();
                }
                return def.resolve();
            },
            insertSDK = function ($) {
                $('body').prepend($fbSDK);
            },
            createWidget = function ($) {
                var $container,
                    $widget,
                    page,
                    width,
                    height,
                    cover,
                    tabs,
                    facepile,
                    adaptWidth;
                $container = $(fbOpts.container);
                if (!$container.length) {
                    self.log("noContainer", options.sliderContainer);
                    return;
                }
                $widget = $("<div></div>").addClass("fb-page");
                page = "https://www.facebook.com/" + fbOpts.page;
                width = fbOpts.fWidth;
                height = fbOpts.fHeight;
                cover = fbOpts.hideCover;
                tabs = fbOpts.tabs.join(",");
                facepile = fbOpts.showFacePile;
                adaptWidth = fbOpts.adaptWidth;
                $widget.attr({
                    "data-href" : page,
                    "data-width" : width,
                    "data-height" : height,
                    "data-hide-cover" : cover,
                    "data-tabs" : tabs,
                    "data-show-facepile" : facepile,
                    "data-adapt-container-width" : adaptWidth
                });
                $container.append($widget);
            };

        this.init = function (options) {
            var is$ = checkJQuery(),
                $,
                isOptionsDone;
            if (is$) {
                $ = window.jQuery;
                isOptionsDone = $.Deferred();
                constructOptions(options, $, isOptionsDone);
                $.when(isOptionsDone).done(function () {
                    insertSDK($);
                    createWidget($);
                }).fail(function () {
                    self.log("initFailed");
                });
            }
        };

        this.log = function (error, params) {
            return mainAppContext.logger(moduleName, error, params);
        };

        if (options) {
            this.init(options);
        }
    };

    this.setCookie = function (cname, cvalue, exdays) {
        var d = new Date(),
            expires;
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    this.getCookie = function (cname) {
        var name = cname + "=",
            ca = document.cookie.split(';'),
            i,
            caLength = ca.length,
            c;
        for (i = 0; i < caLength; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    this.logger();
};
