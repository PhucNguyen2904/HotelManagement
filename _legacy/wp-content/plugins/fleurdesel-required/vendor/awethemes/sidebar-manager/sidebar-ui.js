(function($, ATSidebar) {
  'use strict';

  ATSidebar = window.ATSidebar || {};

  /**
   * Handles sidebar requests.
   */
  var sidebarManager = function(name, action, reload) {
    var request = $.ajax({
      url: ajaxurl,
      method: 'POST',
      dataType: 'json',
      data: {
        action: 'at_' + action + '_sidebar',
        name: name
      }
    });

    request.done(function( response ) {
      if ( !response || !response.success ) {
        alert( response.error || 'An error occurred while trying to ' + action + ' the sidebar.' );
      }
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( 'Request failed: ' + textStatus );
    });

    if (reload) {
      request.always(function() {
        window.location.reload();
      });
    }

    return request;
  }

  $(function() {
    // New widget area button
    var $button = $(ATSidebar.button);
    $('#wpbody-content > .wrap > :first:header').append($button);

    var temp = wp.template('at-sidebar-manager');
    $('#at-sidebar-manager-popup').append(temp);

    $('.sidebar-at-sidebar').each(function() {
      var id = $(this).find('.widgets-sortables').attr('id');
      var data = ATSidebar.sidebars[id];

      var template = wp.template('at-sidebar-action');
      $(this).append(template(data));
    });

    $(document).on('click', '.submitdelete', function(e) {
      e.preventDefault();

      if (!confirm('Are you sure you want to do this?')) {
        return;
      }

      var $sidebar = $(this).parents('.sidebar-at-sidebar');
      $sidebar.addClass('removing');

      $.ajax({
        url: ajaxurl,
        type: 'POST',
        dataType: 'json',
        data: {
          id: $(this).data('id'),
          action: 'at_delete_sidebar',
          _atnonce: ATSidebar.nonce,
        },
      })
      .done(function() {
        $sidebar.remove();
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

    });

    $(document).on('click', '.show', function(e) {
      e.preventDefault();
      $(this).parent().find('.display').toggle();
    });

  });

})(jQuery, window.ATSidebar);
