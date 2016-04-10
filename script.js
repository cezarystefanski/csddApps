(function () {
    "use strict";
    var app = new window.App();
    app.slider = new app.Slider({
        sliderContainer: ".slider",
        autoScroll: false
    });
    app.facebook = new app.FacebookPlugin({
        container: ".facebookCon"
    });
}());
