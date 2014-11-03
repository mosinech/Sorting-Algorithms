var app = angular.module("typeaheadApp", [])
    .directive("typeahead", function(){
        return{
            restrict: "EA", // directive can be used as elem and attr
            link: function(scope, element, attr){
                scope.result = {};
                scope.input = {};
                scope.input.hide = true;        
                scope.input.search_results = [];
                scope.input.search = ""
                scope.$watch("input.search", function(){
                    if(scope.input.search.length >= 2){
                        scope.input.search_results = scope.data.filter(function(row){
                            return row.name.toLowerCase().indexOf(scope.input.search.toLowerCase()) >= 0;
                        });
                        scope.input.hide = false;
                    }
                    else{
                        scope.input.hide = true;
                        scope.input.search_results=[];
                    }
                })
            },
            //template: "<input type=\"text\"/ >",
            //templateUrl: "ng-typeahead.html",
            templateUrl: function(element, attrs){
                return attrs['template']; // dynamically assign the template url
            },
            replace: true, // template properties will replace current content
            scope: true, // directive inherits parent scope
        }
})
    .controller("typeaheadCtrl", ['$scope', function($scope){
        $scope._token = angular.element('#_token').val();
        $scope.edit_site = {};

        // $scope.input.hide = true;        
        // $scope.input.search_results = [];
        $scope.data = [
        {name: "Tom", age: "18", sex: "male"},
        {name: "Peter", age: "30", sex: "male"},
        {name: "Peet", age: "11", sex: "male"},
        {name: "Jack", age: "23", sex: "male"},
        {name: "Tomas", age: "20", sex: "male"},
        {name: "Susan", age: "80", sex: "female"}];
        
        // Handle events when search input is changed
        // $scope.change = function(){ 
        //     if($scope.input.search.length >= 2){
        //         $scope.input.search_results = $scope.input.data.filter(function(row){
        //             return row.name.indexOf($scope.input.search) >= 0;
        //         });
        //         $scope.input.hide = false;
        //     }
        //     else{
        //         $scope.input.hide = true;
        //         $scope.input.search_results=[];
        //     }
           
        // }

        
}]);


app.controller("addSiteCtrl", function($scope, $http){
    $scope._token = angular.element('#_token').val();
    $scope.input = {};
    $scope.input.hide = true;        
    $scope.input.search_results = [];
    
    $scope.edit_site = {};
    $scope.batch = {};
    $scope.batch.show = false;
    
    // Get all the site types from the database
    $http({
        method: "GET",
        url:    "/admin/add_sites/site_types"
    }).success(
        function(results){ 
            $scope.site_types= results;
        }
    );
    
    // Get all the languages from the database
    $http({
        method: "GET",
        url:    "/admin/add_sites/languages"
    }).success(
        function(results){ 
            $scope.languages = results;
        }
    );
    
    // Handle events when search input is changed
    $scope.change = function(){ 
        if($scope.input.search.length >= 2){ // Only search for input more than 1 character
            $http({
                method: "GET",
                url:    "/admin/add_sites/search/"+$scope.input.search
            }).success(
                function(results){ 
                    // since the http call is assynchronous
                    // when it is called back we need to check 
                    // if it still needs the data from the previous input
                    if($scope.input.search.length >= 2){
                        $scope.input.search_results=results;
                        $scope.input.hide = false;
                    }
                }
            );
        }
        else{
            $scope.input.hide = true;
            $scope.input.search_results=[];
        }
       
    };
    
    // Handles events when one search result is selected
    $scope.select= function(selected){
        var site_types = $scope.site_types;
        $scope.input.hide = true; // Remove input results
        
        
        // Setting up all the variables for adding a new site
        // Retrieve them
        $scope.edit_site.id = selected.id;
        $scope.edit_site.site = selected.site;
        $scope.edit_site.domain = selected.domain;
        $scope.edit_site.site_type = site_types[site_types.indexOf(selected.site_type)];
        $scope.edit_site.domain_type =  site_types[site_types.indexOf(selected.domain_type)];
        $scope.edit_site.deactivate = selected.deactivate;
        
        $scope.edit_site.language =  selected.language;;
        $("#edit").modal('toggle');
    }
    
    // Handles events when add site button is pressed
    $scope.add_site = function(search){
        
        $scope.input.hide = true; // Remove input results
        $scope.edit_site = {};
        
        $("#edit").modal('toggle');
    }
    
    // Save the site information in the database
    $scope.save = function(){
        $http({
            method: "POST",
            url:    "/admin/add_sites/save",  
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({
                id:         $scope.edit_site.id,
                site:       $scope.edit_site.site,
                domain:     $scope.edit_site.domain,
                site_type:  $scope.edit_site.site_type,
                domain_type:$scope.edit_site.domain_type,
                language:   $scope.edit_site.language,
                activate:   $scope.edit_site.deactivate ? 0:1, // if deactivate is false or null
                _token:     $scope._token
            })
        }).success(
            function(results){ 
                $scope.input.search = "";
                $scope.input.search_results = [];
            }
        );
    }
    
    // Delete the site from the database
    $scope.del = function(){
        $http({
            method: "GET",
            url:    "/admin/add_sites/delete",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({
                _token:     $scope._token                    
            })
        }).success(
            function(results){ 
                
            }
        );
    }
    
    $scope.file_upload = function(){
        batchForm.submit();
        //console.log(token);
        
    }
});