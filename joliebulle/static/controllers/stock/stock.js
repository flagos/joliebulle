toolsApp.controller('StockCtrl', ['$scope', '$http', '$filter', '$compile', function ($scope, $http, $filter, $compile) {


    $scope.init = function () {
        $scope.recipes = $scope.importRecipes();
        $scope.recipes = _.chain($scope.recipes)
            .sortBy(function (o) {return o.name.toLowerCase(); })
            .sortBy(function (o) {return o.brewer.toLowerCase(); })
            .value();
        $scope.importIngredients();
        $scope.stock = $scope.importStock();
        if ($scope.stock["fermentables"].length != 0) {
            for (var i = 0; i < $scope.stock["fermentables"].length; i++) {
                var fermentable = $scope.stock["fermentables"][i];
                $scope.addInput("inventory-malt", 'kg', fermentable["name"], fermentable["amount"]/1000);
            }
        } else {
            $scope.addInput("inventory-malt", 'kg');
        }

        if ($scope.stock["hops"].length != 0) {
            for (var i = 0; i < $scope.stock["hops"].length; i++) {
                var hop = $scope.stock["hops"][i];
                $scope.addInput("inventory-hop", 'g', hop["name"], hop["amount"]);
            }
        } else {
             $scope.addInput("inventory-hop", 'g');
        }

        if ($scope.stock["yeasts"].length != 0) {
            for (var i = 0; i < $scope.stock["yeasts"].length; i++) {
                var yeast = $scope.stock["yeasts"][i];
                $scope.addInput("inventory-yeast", '', yeast["name"]);
            }
        } else {
            $scope.addInput("inventory-yeast", '');
        }

        if ($scope.stock["miscs"].length != 0) {
            for (var i = 0; i < $scope.stock["miscs"].length; i++) {
                var misc = $scope.stock["miscs"][i];
                $scope.addInput("inventory-misc", 'g', misc["name"], misc['amount']);
            }
        } else {
            $scope.addInput("inventory-misc", 'g');
        }

    };

    $scope.add_autocompletion_stock = function () {
        // Autocomplete
        $scope.importIngredients();

        var fermentables_names = [];
        var fs = $scope.ingredients['fermentables'];
        for (var i = 0; i < fs.length; i++) {
            fermentables_names.push(fs[i]['name']);
        }
        $( "#inventory-malt .inventory-name-input" ).autocomplete({
            source: fermentables_names
        });

        var hops_names = [];
        var hs = $scope.ingredients['hops'];
        for (var i = 0; i < hs.length; i++) {
            hops_names.push(hs[i]['name']);
        }
        $( "#inventory-hop .inventory-name-input" ).autocomplete({
            source: hops_names
        });

        var yeasts_names = [];
        var ys = $scope.ingredients['yeasts'];
        for (var i = 0; i < ys.length; i++) {
            var name = ys[i]['name'];
            if (ys[i]['labo'] != null){
                name += ' ' + ys[i]['labo'];
            }
            if (ys[i]['product_id'] != null){
                name += ' ' + ys[i]['product_id'];
            }
            yeasts_names.push(name);
        }
        $( "#inventory-yeast .inventory-name-input" ).autocomplete({
            source: yeasts_names
        });

        console.log($scope.ingredients);

        var miscs_names = [];
        var ms = $scope.ingredients['miscs'];
        for (var i = 0; i < ms.length; i++) {
            miscs_names.push(ms[i]['name']);
        }
        $( "#inventory-misc .inventory-name-input" ).autocomplete({
            source: miscs_names
        });

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
        console.log('Saving inventory');
        stock_recipe =  jbrecipe.newRecipe();
        stock_recipe.path = "/tmp/stock.xml";

        var malts = document.querySelectorAll('#inventory-malt input');
        for (var i = 0; i <malts.length; i+=2){
            var malt = {};
            if (malts[i].value != "") {
                malt["name"] = malts[i].value;
                malt["amount"] = malts[i+1].value * 1000; // display unit in kg
                stock_recipe.fermentables.push(malt);
            }
        }

        var hops = document.querySelectorAll('#inventory-hop input');
        for (var i = 0; i <hops.length; i+=2){
            var hop = {};
            if (hops[i].value != "") {
                hop["name"] = hops[i].value;
                hop["amount"] = hops[i+1].value;
                stock_recipe.hops.push(hop);
            }
        }


        var yeasts = document.querySelectorAll('#inventory-yeast input');
        for (var i = 0; i <yeasts.length; i+=1){
            var yeast = {};
            if (yeasts[i].value != "") {
                yeast["name"] = yeasts[i].value;
                stock_recipe.yeasts.push(yeast);
            }
        }

        var miscs = document.querySelectorAll('#inventory-misc input');
        for (var i = 0; i <miscs.length; i+=2){
            var misc = {};
            if (miscs[i].value != "") {
                misc["name"] = miscs[i].value;
                misc["amount"] = miscs[i+1].value;
                stock_recipe.miscs.push(misc);
            }
        }

        main.saveRecipe(jb2xml.exportString(stock_recipe), "/tmp/stock.xml");
        // console.log(recipe);
    };

    $scope.importStock = function () {
        return JSON.parse(main.importStockInJSON("/tmp/stock.xml"));
    };

    $scope.addInput = function (divName, unit, name, amount) {
        var name = (typeof name !== 'undefined') ? name : '';
        var amount = (typeof amount !== 'undefined') ? amount : '';

        angular.element(document.getElementById(divName)).append('<br>');
        classNames = ['inventory-name-input', 'inventory-qty-input'];
        if(divName=="inventory-yeast"){
            classNames = ['inventory-name-input'];
        }
        for (var i = 0, c = classNames.length; i < c; i++) {
            // new_input = document.createElement('input');
            // new_input.innerHTML = '<input type="text" class="'+classNames[i]+' form-control">';
            var h = '<input type="text" class="'+classNames[i]+' form-control" value="';
            if(classNames[i]=="inventory-name-input"){
                h += name + '" >';
            } else {
                 h += amount + '" >';
            }
            var temp = $compile(h)($scope);
            angular.element(document.getElementById(divName)).append(temp);
        }
        var h = "<div class='inventory-unit'>"+unit+"</div>";
        var temp = $compile(h)($scope);
        angular.element(document.getElementById(divName)).append(temp);

        $scope.add_autocompletion_stock();
    };


}]);
