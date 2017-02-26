var app2 = angular.module('myApp2', []);

app2.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
});

app2.constant('URL', 'data/');

app2.factory('DataService', function ($http, URL) {
    var getData = function () {
        return $http.get(URL + 'content2.json');
    };

    return {
        getData: getData
    };
});

app2.factory('TemplateService', function ($http, URL) {
    var getTemplates = function () {
        return $http.get(URL + 'templates.json');
    };

    return {
        getTemplates: getTemplates
    };
});

app2.controller('ContentCtrl', function (DataService, $scope, $filter) {
    var ctrl = this;

    ctrl.content = [];

    ctrl.fetchContent = function () {
        DataService.getData().then(function (result) {
            ctrl.content = result.data;
        });
    };

    ctrl.fetchContent();
    
    $scope.emptyData = {name:'new222', type:'', empty:true}
    $scope.$on('addData', function(event, args){
        console.debug('addData', args)
        
        var parentRow = ctrl.content.indexOf(args.parent);
        var array = ctrl.content[parentRow].list;
        
        var found = $filter('filter')(array, {empty : true});
        console.debug('found', found)
        
        if(found.length > 0 || (args.content && args.content.empty)){
            alert('데이터를 먼저 입력하시요');
            return;
        }
        
        var index = array.indexOf(args.content);
        console.debug(index)
 
        array.splice(index+1, 0, angular.copy($scope.emptyData));
    });
    $scope.$on('delData', function(event, args){
        console.debug('delData', args)
                var parentRow = ctrl.content.indexOf(args.parent);
        var array = ctrl.content[parentRow].list;
        
        var index = array.indexOf(args.content);
        console.debug(index)
        array.splice(index, 1);
//        $scope.items.push(angular.copy(itemToAdd))
        
        //array.push(angular.copy($scope.emptyData))    
    })
});

app2.directive('tdDirective', function ($compile, TemplateService) {
    var getTemplate = function (contentType) {
        var template = '';
        
        var cmTemp = '<button ng-click="addRow()">추가</button><button ng-click="delRow()">삭제</button>';

        switch (contentType) {
            case 'U':
                template = '<div ng-controller="ElementController as elementCtrl"> {{content.name}} <a ng-click="elementCtrl.add(content.name)">UUUU</a>'+cmTemp+'</div>';
                break;
            case 'F':
                template = '<div ng-controller="ElementController as elementCtrl">{{content.name}} <a ng-click="elementCtrl.add(content.name)">FFFF</a>'+cmTemp+'</div>';
                break;
            default :
                template = '<div ng-controller="ElementController as elementCtrl">{{content.name}}<a ng-click="elementCtrl.add(content.name)">None</a>'+cmTemp+'</div>';
                break;
        }

        return template;
    };

    var linker = function (scope, element, attrs) {
        scope.rootDirectory = 'images/';

        scope.addRow = function(){
            scope.$emit('addData', {parent:scope.parent, content: scope.content})
        }
        scope.delRow = function() {
           scope.$emit('delData', {parent:scope.parent, content: scope.content})
        }
        if(scope.content) {
            element.append(getTemplate(scope.content.type));
        } else {
//            element.append(getTemplate());
            scope.$emit('addData', {parent:scope.parent, content: scope.content})
        }
        $compile(element.contents())(scope);
      
    };

    return {
        restrict: 'A',
        link: linker,
//        replace: true,
        scope: {
            parent: '=',
            content: '='
        }
    };
});

app2.controller('ElementController', function($scope){
   this.add = function(name){
       alert(name)
   } 

});


