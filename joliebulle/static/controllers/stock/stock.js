toolsApp.controller('StockCtrl', ['$scope', '$http', '$filter', '$compile', function ($scope, $http, $filter, $compile) {

    console.log('OKKKKKKK');

    $scope.init = function () {
        $scope.recipes = $scope.importRecipes();
        $scope.recipes = _.chain($scope.recipes)
            .sortBy(function (o) {return o.name.toLowerCase(); })
            .sortBy(function (o) {return o.brewer.toLowerCase(); })
            .value();
        $scope.importIngredients();
    };

    $scope.importRecipes = function () {
        return JSON.parse(main.dataRecipes().replace(/\bNaN\b/g, "null"));
//        On remplace les Nan éventuellement produits en amont non compatibles json
    };

    $scope.importIngredients = function () {
        $scope.ingredients = JSON.parse(main.dataIngredients());
        $scope.ingredients = translate.translate_fr($scope.ingredients);
    };

    $scope.saveInventory = function () {
        console.log('IAMHEREEEEEEEE');
    };


    $scope.addInput = function (divName, unit){

        angular.element(document.getElementById(divName)).append('<br>');
        classNames = ['inventory-name-input', 'inventory-qty-input'];
        for (var i = 0, c = classNames.length; i < c; i++) {
            // new_input = document.createElement('input');
            // new_input.innerHTML = '<input type="text" class="'+classNames[i]+' form-control">';
            var h = '<input type="text" ng-click="saveInventory()" class="'+classNames[i]+' form-control">';
            var temp = $compile(h)($scope);
            angular.element(document.getElementById(divName)).append(temp);
        }
        var h = "<div class='inventory-unit'>"+unit+"</div>";
        var temp = $compile(h)($scope);
        angular.element(document.getElementById(divName)).append(temp);
    };


}]);
