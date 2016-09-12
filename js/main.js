/**
 * Created by Administrator on 2016/6/12.
 */
var app = angular.module('kaifalaApp',['ng','ngRoute','ngAnimate']);
app.config(function($routeProvider){
    $routeProvider
        .when('/start',{templateUrl:'tpl/start.html'})
        .when('/main',{templateUrl:'tpl/main.html',controller:'mainCtrl'})
        .when('/detail/:did',{templateUrl:'tpl/detail.html',controller:'detailCtrl'})
        .when('/order/:did',{templateUrl:'tpl/order.html',controller:'orderCtrl'})
        .when('/myOrder',{templateUrl:'tpl/myOrder.html',controller:'myOrderCtrl'})
        .otherwise({redirectTo :'/start'})
});
app.controller('parentCtrl',function($scope,$location){
    $scope.jump=function(url){
        $location.path(url);
    }
});
//主控器器
app.controller('mainCtrl',function($scope,$http){
    $scope.dishList=[];
    $scope.kw="";
    $scope.hasMore=true;

    //获取主页面信息
    $http.get('data/dish_getbypage.php')
        .success(function (data) {
            $scope.dishList = data;
        })
        .error(function (data) {
            console.log('获取主页面列表数据错误' + data);
       })
    //监听用户输入
    $scope.$watch('kw',function() {
        console.log('你现在输入的是：' + $scope.kw);
        if($scope.kw != '' && $scope.kw.length > 0)
        {
            $http.get('data/dish_getbykw.php?kw='+$scope.kw)
                .success(function (data) {
                    console.log(data);
                    $scope.dishList = data;
                })
                .error(function (data) {
                    console.log('获取搜索结果错误' + data);
                })
        }
    });
    //为“加载更多”按钮定义事件，获取下一页数据:合一起
    //0-4  length=5   5-9  length=10  10-14 length=15 15
    $scope.loadMore=function(){
        $http.get('data/dish_getbypage.php?start=' + $scope.dishList.length)
            .success(function(data){
                console.log("aaa");
                console.log(data);
                if(data.length < 5) {
                    console.log("bbb");
                    //按钮不能点
                    $scope.hasMore = false;
                    console.log( $scope.dishList);
                    $scope.dishList = $scope.dishList.concat(data);
                }
            })
            .error(function(data){
                console.log('获取信息失败'+data);
            })
    }
});
//详细页面
app.controller('detailCtrl',function($scope,$http,$routeParams){
    $scope.dish=new Object();
    $scope.dishId=$routeParams.did;

   // console.log($routeParams.did);
    $http.get('data/dish_getbyid.php?did='+ $scope.dishId)
        .success(function(data){
            $scope.dish=data[0];
        })
})
//订单页面
app.controller('orderCtrl',function($scope,$http,$routeParams,$rootScope){
   // console.log($routeParams.did);
    //定义user对象，用于保存user数据
    $scope.user={'did':$routeParams.did};
    $scope.submitOrder=function(){
        var str=jQuery.param($scope.user);
        console.log($scope.user);
        //console.log("用户的手机号码为："+$scope.user.phone);

        //console.log(str);
        $http.get('data/order_add.php?'+str)
            .success(function(data){
               console.log(data);
                //记载用户手机号，用于查询订单                                                                                                                                                                                                                                                                                                                                    
                $rootScope.phone=$scope.user.phone;
                $scope.succMsg="订餐成功！您的订单编号为："+data[0].did+"。您可以在用户中心查看订单状态。";
            })
            .error(function(data){
                $scope.errorMsg= '订餐失败！错误码为：'+data.reason;
            })
    }

})
//订单中心页面
app.controller('myOrderCtrl',function($scope,$http,$routeParams,$rootScope){
     $http.get('data/order_getbyphone.php?phone='+ $rootScope.phone)
         .success(function(data){
             $scope.orderList=data;
             console.log($scope.orderList);
         })
         .error(function(data){
             console.log('获取信息失败：'+data)
         })
})