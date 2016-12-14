/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/main");
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('index', {
            abstract: true,
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            controller: 'homeCtrl'
        })
        .state('index.opportunities', {
            url: "/oportunidades?backgrounds&languages&sdg_goals&programmes&work_fields&skills&home_mcs&start&end",
            params: {
                backgrounds: { array: true, value:undefined },
                languages: { array: true },
                sdg_goals: { array: true },
                programmes: { array: true },
                work_fields: { array: true },
                skills: { array: true },
                home_mcs: { array: true },
                start: { array: false },
                end: { array: false },
            },
            templateUrl: "views/search.html",
            controller: 'opportunitiesCtrl',
        })
        .state('index.opportunity', {
            url: "/oportunidade/:id",
            templateUrl: "views/opportunity.html",
            controller: 'OpportunityDetailCtrl'
        })
        .state('index.profile', {
            url: "/profile",
            templateUrl: "views/profile/profile.html",
        })
        .state('index.profile.edit', {
            url: "/edit",
            templateUrl: "views/profile/edit.html",
        })
        .state('index.profile.applications', {
            url: "/applications",
            templateUrl: "views/profile/applications.html",
            controller: 'ApplicationsCtrl'
        })
        .state('sign_in', {
            url: "/sign_in?applyTo",
            templateUrl: "views/sign_in.html",
            controller: 'AuthCtrl'
        })
}
angular
    .module('impactbrazil')
    .filter("nl2br", function($filter) {
     return function(data) {
        if (!data) return data;
            return data.replace(/\n\r?/g, '<br />');
        };
    })
    .filter('propsFilter', function() {
        return function(items, props) {
            var out = [];
            if (angular.isArray(items)) {
              items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                          var prop = keys[i];
                          var text = props[prop].toLowerCase();
                          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                              }
                        }

                        if (itemMatches) {
                          out.push(item);
                        }
                  });
            } else {
              // Let the output be the input untouched
                  out = items;
            }

            return out;
          };
    })
    .config(config)
    .run(function($rootScope, $state, $location, $anchorScroll, $stateParams) {
        //$animate.enabled(true);
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {
            $location.hash($stateParams.scrollTo);
            $anchorScroll();
        });
    });