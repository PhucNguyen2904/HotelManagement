(function($) {
  'use strict';

  /**
   * VCEResponsive class.
   */
  function VCEResponsive($el) {
    this.$el = $el;
    this.$input = $el.find('.wpb_vc_param_value');
    this.$groups = $el.find('.vce-param-responsive__group > .vce-input-group');

    var paramValue = $el.data('json');
    this.paramValue = _.isEmpty( paramValue ) ? {} : paramValue;

    this.init();
  };

  VCEResponsive.prototype.init = function () {
    var self = this;

    this.$groups.find('input').on('change', function() {
      self.updateInputValue();
    });

    if (this.isMinimalLayout()) {
      this.buildMinimalDesign();
    }

    // Ready!!!
    this.$el.addClass('ready');

    $(document).trigger('vc_extended_responsive_ready', [this]);
  };

  VCEResponsive.prototype.isMinimalLayout = function () {
    return this.$el.hasClass('minimal');
  };

  VCEResponsive.prototype.isExpanded = function () {
    if (! this.isMinimalLayout()) {
      return false;
    }

    return this.$el.hasClass('open');
  };

  VCEResponsive.prototype.syncInputValue = function (value) {
    if (! this.isMinimalLayout()) {
      return;
    }

    this.$el.find('.vce-param-responsive__subgroup .vce-input-group__input').val(value);
    this.updateInputValue();
  };

  VCEResponsive.prototype.updateInputValue = function () {
    var inputValue = [];
    var value = this.paramValue;

    this.$groups.each(function() {
      var $input  = $(this).find('.vce-input-group__input');
      var id = $input.data('name');

      if (typeof value[id] !== undefined) {
        value[id] = $.trim($input.val());

        if (!_.isEmpty(value[id])) {
          inputValue.push(id+':'+encodeURIComponent(value[id]));
        }
      }
    });

    if (inputValue.length > 0) {
      this.$input.val(inputValue.join('|'));
      this.$input.attr('data-json', JSON.stringify(value));
    } else {
      this.$input.val('');
    }
  };

  VCEResponsive.prototype.updateToggleButton = function ($button) {
    if (this.isExpanded()) {
      $button.attr('title', $button.data('originTitle'));
      $button.find('.vce-input-group__tooltip').text($button.data('originTitle'));
      $button.find('.dashicons').removeClass('dashicons-arrow-right-alt2').addClass('dashicons-arrow-left-alt2');
    } else {
      $button.attr('title', $button.data('moreTitle'));
      $button.find('.vce-input-group__tooltip').text($button.data('moreTitle'));
      $(this).find('.dashicons').removeClass('dashicons-arrow-left-alt2').addClass('dashicons-arrow-right-alt2');
    }
  };

  VCEResponsive.prototype.buildMinimalDesign = function () {
    var self = this;
    var $firstInput = self.$groups.first().find('.vce-input-group__input');

    self.$groups.not(':first-child').wrapAll('<div class="vce-param-responsive__subgroup" />');
    var $subGroup = self.$el.find('.vce-param-responsive__subgroup');

    $subGroup.after(self.$el.find('.vce-param-responsive_hide_button').html());
    var $btnToggle = self.$el.find('.vce-param-responsive__toggle');
    self.updateToggleButton($btnToggle);

    $btnToggle.on('click', function(e) {
      e.preventDefault();

      self.$el.toggleClass('open');
      self.updateToggleButton($(this));
    });

    $firstInput.on('change', function() {
      if (! self.isExpanded()) {
        self.syncInputValue($(this).val());
      }
    });
  };

  /**
   * Listen document ready event...
   */
  $(function() {

    // And init the VCEResponsive!
    $('.vce-param-responsive').each(function() {
      new VCEResponsive($(this));
    });

  });

})(jQuery);
