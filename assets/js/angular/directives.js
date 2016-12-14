/**
 * INSPINIA - Responsive Admin Theme
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function slider($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, fn) {
      scope.call_slider = function(elem) {
        $timeout(function(){
          var $ = jQuery.noConflict();
          $(elem).slick({
            slidesToShow: 4,
            slidesToScroll: 3,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 2,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 992,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 750,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });
        },1,false);
      }
    }
  }
}

function datePicker() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      var $ = jQuery.noConflict();
      var modelName = attrs['datePicker'];
      $(element).datetimepicker({
        format:'DD/MM/YYYY',
        minDate: Date(),
      });
      $(element).on("dp.change", function (e) {
          scope[attrs.ngModel] = $(element).find('input').val();
      });

    }
  }
}

function flexSlider() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, fn) {
      var $ = jQuery.noConflict();
      /*====flex  slider for main slider or testimonials====*/
      $(element).flexslider({
          slideshowSpeed: 5000,
          directionNav: false,
          animation: "fade"
      });
    }
  }
}




function mansonry() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, fn) {
      var $ = jQuery.noConflict();
      var $container = $('.mas-boxes');

      var gutter = 30;
      var min_width = 300;
      $container.imagesLoaded( function(){
          $container.masonry({
              itemSelector : '.mas-boxes-inner',
              //gutterWidth: gutter,
              isAnimated: true,
              /*columnWidth: function( containerWidth ) {
                var box_width = (((containerWidth - 2*gutter)/3) | 0) ;

                if (box_width < min_width) {
                    box_width = (((containerWidth - gutter)/2) | 0);
                }

                if (box_width < min_width) {
                    box_width = containerWidth;
                }

                $('.mas-boxes-inner').width(box_width);

                return box_width;
              }*/
          });
      });
    }
  }
}

function loadapp() {
  return {
    restrict: 'A',
    replace: true,
    template: '<header class="header-main" load_app_js>',
    link: function(scope, element, attrs, fn) {
          
          var $ = jQuery.noConflict();
          $(document).ready(function () {
              "use strict";
          // site preloader -- also uncomment the div in the header and the css style for #preloader
          $(window).load(function () {
              $('#preloader').fadeOut('slow', function () {
                  $(this).remove();
              });
          });
          //back to top
          //Check to see if the window is top if not then display button
          $(window).scroll(function () {
              if ($(this).scrollTop() > 300) {
                  $('.scrollToTop').fadeIn();
              } else {
                  $('.scrollToTop').fadeOut();
              }
          });

          //Click event to scroll to top
          $('.scrollToTop').click(function () {
              $('html, body').animate({scrollTop: 0}, 800);
              return false;
          });

          $(window).resize(function () {
              $(".navbar-collapse").css({maxHeight: $(window).height() - $(".navbar-header").height() + "px"});
          });
          /* ==============================================
           Sticky Navbar
           =============================================== */
              $(".sticky").sticky({topSpacing: 0});

              //search trigger
              jQuery('.icon-search, .search-close').click(function () {
                  jQuery('.search-form-nav').animate({height: 'toggle'}, 500);
              });

              $(function () {
                  $('.smooth-scroll a[href*="#"]:not([href="#"])').click(function () {
                      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                          var target = $(this.hash);
                          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                          if (target.length) {
                              $('html, body').animate({
                                  scrollTop: target.offset().top
                              }, 1000);
                              return false;
                          }
                      }
                  });
              });

          /*=========================*/
          /*====main navigation hover dropdown====*/
          /*==========================*/
              $('.js-activated').dropdownHover({
                  instantlyCloseOthers: false,
                  delay: 0
              }).dropdown();

          /*====flex  slider for main slider or testimonials====*/
          $('.main-flex-slider,.testimonials').flexslider({
              slideshowSpeed: 5000,
              directionNav: false,
              animation: "fade"
          });

          /*========portfolio mix====*/
          $('#grid').mixitup();

          /*========tooltip and popovers====*/

          $("[data-toggle=popover]").popover();

          $("[data-toggle=tooltip]").tooltip();


          /*========flex-gallery slide====*/
          $(window).load(function () {
              $('.flexslider').flexslider({
                  directionNav: false,
                  slideshowSpeed: 3000,
                  animation: "fade"
              });
          });

          /*=========================*/
          /*========Animation on scroll with wow.js====*/
          /*==========================*/



          /* -------------------
           Parallax Sections
           ---------------------*/
          if (!Modernizr.touch) {
              $('.parallax-1').parallax("50%", 0.5);
              $('.page-tree-bg').parallax("50%", 0.5);
          }
          });

          $(document).ready(function () {
             wow = new WOW(
                  {
                      animateClass: 'animated',
                      offset: 100,
                      mobile: true
                  }
          );
          wow.init(); 
              
          });
        }
    }
}
/**
 *
 * Pass all functions into module
 */
angular
    .module('impactbrazil')
    .directive('loadapp', loadapp)
    .directive('slider', slider)
    .directive('datePicker', datePicker)
    .directive('flexSlider', flexSlider)
    .directive('mansonry', mansonry);
