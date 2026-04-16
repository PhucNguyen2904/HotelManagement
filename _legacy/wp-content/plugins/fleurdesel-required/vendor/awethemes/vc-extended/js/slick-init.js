(function($) {
  'use strict';

  if ($.fn.slick) {
    $('[data-init="slick"]').each(function () {
      var $el = $(this);

      var breakpointsWidth = {tn: 319, xs: 479, ss: 519, sm: 767, md: 991, lg: 1199};

      var slickDefault = {
        dots: false,
        arrows: true,

        slidesToShow: 1,
        slidesToScroll: 1,

        fade: false,
        mobileFirst: true,
      };

      // Merge settings.
      var settings = $.extend(slickDefault, $el.data());
      delete settings.init;

      // Build breakpoints.
      if (settings.breakpoints) {
        var _responsive = [];
        var _breakpoints = settings.breakpoints;

        var buildBreakpoints = function (key, value) {
          if (breakpointsWidth[key]) {
            _responsive.push({
              breakpoint: breakpointsWidth[key],
              settings: {
                slidesToShow: parseInt(value),
                slidesToScroll: 1
              }
            });
          };
        };

        if (typeof _breakpoints === "object") {
          $.each(_breakpoints, buildBreakpoints);
        }

        delete settings.breakpoints;
        settings.responsive = _responsive;
      }

      $el.slick(settings);
    });
  }

})(jQuery);
