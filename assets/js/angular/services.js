function OpportunitiesService($filter,$http) {
	var url = 'https://gis-api.aiesec.org/v2/opportunities/'

	this.list = function(token,page,filters) {
		var param = {
			'filters[earliest_start_date]':$filter('date')(new Date(), 'yyyy-MM-dd'),
			'filters[programmes][]':filters['programmes'],
			'filters[committee]':filters['committee'],
			'filters[home_mcs][]':filters['home_mcs'],
			'filters[is_ge]':filters['is_ge'],
			'filters[work_fields][]':filters['work_fields'],
			'filters[sdg_goals][]':filters['sdg_goals'],
			'access_token':token,
			'per_page':20,
			'page':page,
			'sort':'applications_closing',
		};
		return $http.get(url,{params:param});
	};

	this.find = function(token,id) {
		console.log(id);
		console.log(url+id);
		return $http.get(url+id,{params:{'access_token':token}});
	}

	this.apply = function(token,person_id,opportunity_id,gt_answer) {
		param = {
			'access_token':token,
			'application[opportunity_id]':opportunity_id,
			'application[person_id]':person_id,
			'application[gt_answer]':gt_answer,
		}
		apply_url = 'https://gis-api.aiesec.org/v2/applications.json?access_token=' + token 
					+'&application[opportunity_id]='+opportunity_id
		return $http.post(apply_url,param);
	}
}

function AuthService($http) {
	this.simple_token = function () {
		return $http.get('https://opportunities.aiesec.org/js/1.0.0.op.js', {}).then(
			function(response) {
				return response.data.match(/access_token:"(.*)",expires_in/g)[0].replace('access_token:"','').replace('",expires_in','');
			},
			function(response) {
				console.log('Não rolou Auth '+response.data);
				return null;
		});
	}

	this.sign_up = function () {

	}

	this.sign_in = function (email,password) {
		return $http.post('http://bazicon.aiesec.org.br/login_opportunities',{'email':email,'password':password},{})
	}

	this.my = function(token) {	
		return $http.get('https://gis-api.aiesec.org/v2/current_person.json',{params:{'access_token':token,'with':'missing_profile_fields'}},{})
	}
}

function ApplicationService($http) {
	this.my_applications = function(token,person_id) {
		param = {
			'access_token':token,
			'per_page':100,
		}
		return $http.get('https://gis-api.aiesec.org/v2/people/'+person_id+'/applications',{params:param},{})
	}
}

angular.module('impactbrazil')
	.service('OpportunitiesService',OpportunitiesService)
	.service('ApplicationService',ApplicationService)
	.service('AuthService',AuthService);