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
            prepareSlides = function (numberOfSlides) {
                window.console.info(numberOfSlides);
            },
            createSlider = function (options) {
                var $,
                    $container,
                    $slides,
                    sliderName = "cSlider",
                    slideName = "cSlide",
                    iterator,
                    noOfSlides;

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
                $container.addClass(sliderName);
                $slides = $container.children();
                if (!$slides.length) {
                    self.log("noChildren", options.sliderContainer);
                    return;
                }
                iterator = 1;
                $slides.addClass(slideName).each(function () {
                    $(this).attr("data-slide_number", iterator);
                    iterator = iterator + 1;
                });
                noOfSlides = iterator - 1;
                prepareSlides(noOfSlides);
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
                return def.resolve();
            },
            insertSDK = function ($) {
                $('body').prepend($fbSDK);
            },
            createWidget = function ($) {
                window.console.info($);
                window.console.info("Widget created!");
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

    this.logger();
};
