function homeCtrl($scope,$state,$stateParams,$localStorage,OpportunitiesService,AuthService,ListsService,$timeout) {
	$scope.loading = [false,false,false];
	$scope.lists = [[],[],[]];
	$scope.error = [false,false,false];
	$scope.page = [1,1,1];
	$scope.sliderCtrl = {};
	$scope.selectedFilters = {selected:[]};
	$scope.filters = [];
	$scope.start_date = '';
	$scope.end_date = '';

	function load_lists(token) {
		ListsService.get_lists(token).then(
			function (response) {
				console.log(response);
				$localStorage.lists = response.data;
				for(var i = 0;i < $localStorage.lists.backgrounds.length; i++) {
					$localStorage.lists.backgrounds[i].type = 'Formação';
					$localStorage.lists.backgrounds[i].filter = 'backgrounds';
					$scope.filters.push($localStorage.lists.backgrounds[i]);
				}
				for(var i = 0;i < $localStorage.lists.languages.length; i++) {
					$localStorage.lists.languages[i].type = 'Línguas';
					$localStorage.lists.languages[i].filter = 'languages';
					$scope.filters.push($localStorage.lists.languages[i]);
				}
				for(var i = 0;i < $localStorage.lists.skills.length; i++) {
					$localStorage.lists.skills[i].type = 'Conhecimento';
					$localStorage.lists.skills[i].filter = 'skills';
					$scope.filters.push($localStorage.lists.skills[i]);
				}
				for(var i = 0;i < $localStorage.lists.work_fields.length; i++) {
					$localStorage.lists.work_fields[i].type = 'Campo de trabalho';
					$localStorage.lists.work_fields[i].filter = 'work_fields';
					$scope.filters.push($localStorage.lists.work_fields[i]);
				}
				for(var i = 0;i < $localStorage.lists.home_mcs.length; i++) {
					$localStorage.lists.home_mcs[i].type = 'País';
					$localStorage.lists.home_mcs[i].filter = 'home_mcs';
					$scope.filters.push($localStorage.lists.home_mcs[i]);
				}
				for(var i = 0;i < $localStorage.lists.sdg_goals.length; i++) {
					$localStorage.lists.sdg_goals[i].type = 'SDG';
					$localStorage.lists.sdg_goals[i].filter = 'sdg_goals';
					$scope.filters.push($localStorage.lists.sdg_goals[i]);
				}
				$scope.filters.push({id:1,name:'Global Volunteer',type:'Programa',filter:'programmes'});
				$scope.filters.push({id:2,name:'Global Talent',type:'Programa',filter:'programmes'});
				$scope.filters.push({id:5,name:'Global Entrepeneur',type:'Programa',filter:'programmes'});
			},function (response) {
				console.log(response);
			});
	}

	function get_opportunities(page, list, params, i) {
		$scope.loading = true;
		return OpportunitiesService.list($localStorage.token,page,params).then(
			function(response) {
				$scope.lists[i] = $scope.lists[i].concat(response.data.data);
				$scope.loading = false;
				console.log($scope.lists);
				$scope.$broadcast('dataloaded');
			},
			function(response) {
				console.log('Não rolou '+response.status);
				console.log(response);
				$scope.loading = false;
				$scope.error = true;
				$localStorage.token = null;
				$state.transitionTo($state.current, $stateParams, {reload: true, inherit: true, notify: true});
		});
	};

	function get_country_partners() {

	}

	if ($localStorage.token==null) {
		AuthService.simple_token().then(function(token) {
			if (token == null){
				$localStorage.token = null;
				$state.transitionTo($state.current, $stateParams, {reload: true, inherit: true, notify: true});
			} else {
				$localStorage.token = token;
			}
			load_lists($localStorage.token);
			get_opportunities($scope.page[0],$scope.listGV,{'programmes':1},0);
			get_opportunities($scope.page[1],$scope.listGE,{'programmes':5},1);
			get_opportunities($scope.page[2],$scope.listGT,{'programmes':2},2);
		});
	} else {
		load_lists($localStorage.token);
		get_opportunities($scope.page[0],$scope.listGV,{'programmes':1},0).then(function(){$scope.call_slider('#gv'); $scope.call_slider('#country_partners');});
		get_opportunities($scope.page[1],$scope.listGE,{'programmes':5},1).then(function(){$scope.call_slider('#ge');});
		get_opportunities($scope.page[2],$scope.listGT,{'programmes':2},2).then(function(){$scope.call_slider('#gt');});
	}

	$scope.tagTransform = function(name) {
		return $scope.filters.filter(function(x) {return x == name})[0];
	}

	$scope.search = function() {
		params = {};
		for(var i = 0; i < $scope.selectedFilters.selected.length; i++){
			switch ($scope.selectedFilters.selected[i].filter) {
				case 'languages':
					if(params['languages']==null) {params['languages']=[]}
					params['languages'].push($scope.selectedFilters.selected[i].id); break;
				case 'backgrounds':
					if(params['backgrounds']==null) {params['backgrounds']=[]}
					params['backgrounds'].push($scope.selectedFilters.selected[i].id); break;
				case 'skills':
					if(params['skills']==null) {params['skills']=[]}
					params['skills'].push($scope.selectedFilters.selected[i].id); break;
				case 'work_fields':
					if(params['work_fields']==null) {params['work_fields']=[]}
					params['work_fields'].push($scope.selectedFilters.selected[i].id); break;
				case 'sdg_goals':
					if(params['sdg_goals']==null) {params['sdg_goals']=[]}
					params['sdg_goals'].push($scope.selectedFilters.selected[i].id); break;
				case 'home_mcs':
					if(params['home_mcs']==null) {params['home_mcs']=[]}
					params['home_mcs'].push($scope.selectedFilters.selected[i].id); break;
			}
		}
		if($scope.start_date != null && $scope.start_date != '') {params['start'] = $scope.start_date;}
		if($scope.end_date != null && $scope.end_date != '') {params['end'] = $scope.end_date;}
		console.log(params);
		
		$state.go('index.opportunities',params);
	}
}

function opportunitiesCtrl($scope,$state,$stateParams,$localStorage,OpportunitiesService,AuthService,ListsService) { 
	$scope.loading = false;
	$scope.opportunities = [];
	$scope.error = false;
	$scope.storage = $localStorage;
	$scope.page = 1;
	$scope.filters = {};
	$scope.tag_filters = [];
	$scope.selectedFilters = {selected:[]};
	$scope.start_date = '';
	$scope.end_date = '';

	function init_params() {
		$scope.filters['backgrounds'] = $stateParams.backgrounds;
		$scope.filters['sdg_goals'] = $stateParams.sdg_goals;
		$scope.filters['languages'] = $stateParams.languages;
		$scope.filters['skills'] = $stateParams.skills
		$scope.filters['work_fields'] = $stateParams.work_fields;
		$scope.filters['home_mcs'] = $stateParams.home_mcs;
		$scope.filters['earliest_start_date'] = $stateParams.start;
		$scope.filters['latest_start_date'] = $stateParams.end;
		$scope.filters['programmes'] = $stateParams.programmes;
		/*lists = ['backgrounds','sdg_goals'];
		for (var j = 0; j<lists.length; j++) {
			if ($scope.filters[lists[j]]!= null) {
				for (var i = 0; i < $scope.filters[lists[j]].length; i++) {
					$scope.selectedFilters.selected.push($scope.filters[lists[j]][i]);
				}
			}
		}*/
	}
	
	function load_lists(token) {
		ListsService.get_lists(token).then(
			function (response) {
				console.log(response);
				$localStorage.lists = response.data;
				for(var i = 0;i < $localStorage.lists.backgrounds.length; i++) {
					$localStorage.lists.backgrounds[i].type = 'Formação';
					$localStorage.lists.backgrounds[i].filter = 'backgrounds';
					$scope.tag_filters.push($localStorage.lists.backgrounds[i]);
				}
				for(var i = 0;i < $localStorage.lists.languages.length; i++) {
					$localStorage.lists.languages[i].type = 'Línguas';
					$localStorage.lists.languages[i].filter = 'languages';
					$scope.tag_filters.push($localStorage.lists.languages[i]);
				}
				for(var i = 0;i < $localStorage.lists.skills.length; i++) {
					$localStorage.lists.skills[i].type = 'Conhecimento';
					$localStorage.lists.skills[i].filter = 'skills';
					$scope.tag_filters.push($localStorage.lists.skills[i]);
				}
				for(var i = 0;i < $localStorage.lists.work_fields.length; i++) {
					$localStorage.lists.work_fields[i].type = 'Campo de trabalho';
					$localStorage.lists.work_fields[i].filter = 'work_fields';
					$scope.tag_filters.push($localStorage.lists.work_fields[i]);
				}
				for(var i = 0;i < $localStorage.lists.home_mcs.length; i++) {
					$localStorage.lists.home_mcs[i].type = 'País';
					$localStorage.lists.home_mcs[i].filter = 'home_mcs';
					$scope.tag_filters.push($localStorage.lists.home_mcs[i]);
				}
				for(var i = 0;i < $localStorage.lists.sdg_goals.length; i++) {
					$localStorage.lists.sdg_goals[i].type = 'SDG';
					$localStorage.lists.sdg_goals[i].filter = 'sdg_goals';
					$scope.tag_filters.push($localStorage.lists.sdg_goals[i]);
				}
				$scope.tag_filters.push({id:1,name:'Global Volunteer',type:'Programa',filter:'programmes'});
				$scope.tag_filters.push({id:5,name:'Global Entrepeneur',type:'Programa',filter:'programmes'});
				$scope.tag_filters.push({id:2,name:'Global Talent',type:'Programa',filter:'programmes'});
			},function (response) {
				console.log(response);
			});
	}

	function get_opportunities(page) {
		init_params();
		$scope.loading = true;
		OpportunitiesService.list($localStorage.token,page,$scope.filters).then(
			function(response) {
				console.log('Rolou! '+response.status);
				console.log(response.data);
				$scope.opportunities = $scope.opportunities.concat(response.data.data);
				$scope.loading = false;
			},
			function(response) {
				console.log('Não rolou '+response.status);
				console.log('Não rolou '+response.data);
				$scope.loading = false;
				$scope.error = true;
				$localStorage.token = null;
				$state.transitionTo($state.current, $stateParams, {reload: true, inherit: true, notify: true});
		});
	};

	if ($localStorage.token==null) {
		AuthService.simple_token().then(function(token) {
			if (token == null){ 
				$localStorage.token = null;
				$state.transitionTo($state.current, $stateParams, {reload: true, inherit: true, notify: true});
			} else {
				$localStorage.token = token;
			}
			get_opportunities(1);
			load_lists(token);
		});
	} else {
		get_opportunities(1);
		load_lists($localStorage.token);
	}
	console.log($stateParams);
	

	$scope.more_opportunities = function() {
		$scope.error = false;
		$scope.loading = true;
		$scope.page++;
		get_opportunities($scope.page);
		mixpanel.track("more_opportunities", {"sdg": $scope.filter});
	};

	$scope.load_selecteds = function(ids) {
		$scope.selectedFilters = {selected:[]};
		for (var i = 0; i < $scope.tag_filters.length; i++) {
			if(ids.indexOf($scope.tag_filters[i].id) != -1) {
				$scope.selectedFilters.selected.push($scope.tag_filters[i]);
			}
		}
	}

	$scope.add_programmee = function(id) {
		$scope.selectedFilters = {selected:[]};
		switch (parseInt(id)) {
			case 1:
				$scope.selectedFilters.selected.push({id:1,name:'Global Volunteer',type:'Programa',filter:'programmes'});
				break;
			case 2:
				$scope.selectedFilters.selected.push({id:2,name:'Global Talent',type:'Programa',filter:'programmes'});
				break;
			case 5:
				$scope.selectedFilters.selected.push({id:5,name:'Global Entrepeneur',type:'Programa',filter:'programmes'});
				break;
		}
	}

	$scope.search = function() {
		params = {};
		$stateParams = {};
		for(var i = 0; i < $scope.selectedFilters.selected.length; i++){
			switch ($scope.selectedFilters.selected[i].filter) {
				case 'languages':
					if(params['languages']==null) {params['languages']=[]}
					params['languages'].push($scope.selectedFilters.selected[i].id); break;
				case 'backgrounds':
					if(params['backgrounds']==null) {params['backgrounds']=[]}
					params['backgrounds'].push($scope.selectedFilters.selected[i].id); break;
				case 'skills':
					if(params['skills']==null) {params['skills']=[]}
					params['skills'].push($scope.selectedFilters.selected[i].id); break;
				case 'work_fields':
					if(params['work_fields']==null) {params['work_fields']=[]}
					params['work_fields'].push($scope.selectedFilters.selected[i].id); break;
				case 'sdg_goals':
					if(params['sdg_goals']==null) {params['sdg_goals']=[]}
					params['sdg_goals'].push($scope.selectedFilters.selected[i].id); break;
				case 'home_mcs':
					if(params['home_mcs']==null) {params['home_mcs']=[]}
					params['home_mcs'].push($scope.selectedFilters.selected[i].id); break;
				case 'programmes':
					if(params['programmes']==null) {params['programmes']=[]}
					params['programmes'].push($scope.selectedFilters.selected[i].id); break;
			}
		}
		if($scope.start_date != null && $scope.start_date != '') {params['start'] = $scope.start_date;}
		if($scope.end_date != null && $scope.end_date != '') {params['end'] = $scope.end_date;}
		
		$state.go('index.opportunities',params, {reload: true, inherit: false});
	}

	$scope.tagTransform = function(name) {
		return $scope.filters.filter(function(x) {return x == name})[0];
	}
};

function OpportunityDetailCtrl($scope,$state,$stateParams,$localStorage,OpportunitiesService,AuthService) {
	$scope.opportunity = null;
	$scope.loading = false;

	if($localStorage.login_token != null) {
		load_opportunity($localStorage.login_token);
	} else if ($localStorage.token != null) {
		load_opportunity($localStorage.token);
	} else {
		AuthService.simple_token().then(function(token) {
			if (token == null){
				$localStorage.token = null;
				$state.reload();
			} else {
				$localStorage.token = token;
			}
			load_opportunity($localStorage.token);
		});
	}

	$scope.apply = function () {
		$scope.loading = true;
		if($localStorage.login_token != null) {
			OpportunitiesService.apply($localStorage.login_token,$localStorage.my.id,$stateParams.id).then(
				function(response) {
					console.log(response);
					$scope.opportunity.applied_to = true;
					$scope.loading = false;
				},function(response) {
					console.log(response);
					$scope.loading = false;
				});
		} else {
			$state.go('sign_in',{'applyTo':$stateParams.id});
		}
	};

	$scope.can_apply = function() {
		return $localStorage.missing_profile_fields == null || $localStorage.missing_profile_fields.length == 0;
	}

	function load_opportunity(token) {
		OpportunitiesService.find(token,$stateParams.id).then(
			function(response) {
				console.log(response);
				$scope.opportunity = response.data;
			},function(response) {
				console.log(response);
				$localStorage.$reset();
				$state.transitionTo($state.current, $stateParams, {reload: true, inherit: true, notify: true});
			});
	}
};

function AuthCtrl($scope,$state,$location,$stateParams,$localStorage,OpportunitiesService,AuthService) {
	$scope.storage = $localStorage;
	$scope.loading = false;
	$scope.message = '';

	$scope.login = function() {
		$scope.loading = true;
		if ($scope.email != undefined && $scope.password != undefined) {
			AuthService.sign_in($scope.email,$scope.password).then(
				function successCallback(response) {
					if (response.data['token'] == null) {
						$scope.message = 'Email or Password incorrect';
					} else {
						$localStorage.login_token = response.data['token'].match(/access_token:.*,token/)[0].replace('access_token:','').replace(',token','');

						AuthService.my($localStorage.login_token).then(
							function(response){
								console.log(response);
								$localStorage.my = response.data.person;
								$localStorage.missing_profile_fields = response.data.missing_profile_fields;
							},function(response){
								console.log(response);
							}).then(function() {
								console.log($localStorage.token);
								if ($stateParams.applyTo) {
									console.log($stateParams);
									OpportunitiesService.apply($localStorage.login_token,$localStorage.my.id,parseInt($stateParams.applyTo)).then(
										function(response) {
											console.log(response);
										},function(response) {
											console.log(response);
										}).then(function() {
											$state.go('index.opportunity',{'id':parseInt($stateParams.applyTo)});
										});
								} else {
									$state.go('index.main');
								}
							});
					}
					$scope.loading = false;
				}, function errorCallback(response) {
					$scope.message = 'Something is incorrect, try again';
					$scope.loading = false;
				});
		} else {
			$scope.loading = false;
			$scope.message = 'You need to fill your email and password';
		}
	}

	$scope.sign_out = function() {
		$localStorage.$reset();
	}

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
};

function ApplicationsCtrl($scope,$state,$stateParams,$localStorage,ApplicationService) {
	$scope.list = [];
	$scope.loading = false;

	if($localStorage.login_token != null) {
		load_applications($localStorage.login_token);
	} else {
		$state.go('sign_in',{'redirectTo':'index.profile.applications'});
	}

	function load_applications(token) {
		ApplicationService.my_applications(token,$localStorage.my.id).then(
			function(response) {
				console.log(response);
				$scope.list = response.data.data;
			},function(response) {
				console.log(response);
				$localStorage.$reset();
				$state.go('sign_in',{'redirectTo':'index.profile.applications'});
			});
	}
}

angular
    .module('impactbrazil')
    .controller('homeCtrl',homeCtrl)
    .controller('opportunitiesCtrl', opportunitiesCtrl)
    .controller('OpportunityDetailCtrl', OpportunityDetailCtrl)
    .controller('ApplicationsCtrl', ApplicationsCtrl)
    .controller('AuthCtrl', AuthCtrl);