'Use Strict';
angular.module('driver_dude').controller('loginController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$firebaseAuth, $firebaseObject,$log, Auth, FURL, Utils) {
  var auth = $firebaseAuth();
  var ref = firebase.database().ref();
  var userkey = "";
  $scope.showPopup = function() {
    $scope.data = {}

    // Custom popup

  };

  $scope.signIn = function (user) {

    $log.log("Enviado");
    if(angular.isDefined(user)){
    Utils.show();
    Auth.login(user)
      .then(function(authData) {

        console.log(authData);
        alert(user.displayName);
        $scope.data = {};

        firebase.auth().onAuthStateChanged(function(user) {
          if (user.displayName == null) {
            //  alert(1);
            var myPopup = $ionicPopup.show({
              template: '<input type = "text" ng-model = "data.displayName">',
              title: 'Display Name',
              subTitle: 'What shall we call you?',
              scope: $scope,

              buttons: [
                {text: 'Cancel'}, {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {

                    if ($scope.data.displayName) {
                      //don't allow the user to close unless he enters model...
                      e.preventDefault();
                    } else {
                      return $scope.data.displayName;
                    }
                  }
                }
              ]
            });
            //
            myPopup.then(function (res) {
              user.updateProfile({
                displayName: res
              }).then(function () {
                // Update successful.
                alert('name updated');
              }, function (error) {
                // An error happened.
              });
              console.log('Tapped!', res);
            });
            //  // User is signed in.
            //  //user.updateProfile({
            //  //  displayName: "Random Name"
            //  //}).then(function() {
            //  //  // Update successful.
            //  //}, function(error) {
            //  //  // An error happened.
            //  //});
            //
            //} else {
            //  // No user is signed in.
            //}
          }
        });

      $log.log("logged in:" + authData);
      Utils.hide();
      $state.go('driver_dude.dashboard');
      $log.log("Starter page","Home");

      }, function(err) {
        Utils.hide();
         Utils.errMessage(err);
      });
    }
  };

  $scope.signInAnon = function () {
    $log.log("Enviado");
    Utils.show();
    auth.$signInAnonymously().then(function(firebaseUser) {
     console.log("Signed in as:", firebaseUser.uid);
     Utils.hide();
     $location.path("/dashboard");
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
    
  };

  $scope.checkUser = function () {
    var firebaseUser = auth.$getAuth();

    if (firebaseUser) {
    $log.log("Signed in as:", firebaseUser.uid);
    $location.path("/dashboard");
    } else {
    $log.log("Signed out");
    $location.path("/login");
    }

  }
  
/* SEEMS NOT WORKING WELL

  $scope.loginWithGoogle =  function(){
  var provider = new firebase.auth.GoogleAuthProvider();

 firebase.auth().signInWithPopup(provider).then(function(result) {

    $log.log("Authenticated successfully with payload:", angular.toJson(result));
    $state.go('home');
  
  })
  .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  $log.error("error:", angular.toJson(error));
});
  ;
  };

*/

/* SEEMS NOT WORKING WELL
  $scope.loginWithFacebook =  function(){
    var provider = new firebase.auth.FacebookAuthProvider();

 firebase.auth().signInWithPopup(provider).then(function(result) {

    $log.log("Authenticated successfully with payload:", angular.toJson(result));
    $state.go('home');
  
  })
  .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  $log.error("error:", angular.toJson(error));
});
  ;
  };
  */
  
/* SEEMS NOT WORKING WELL
  $scope.loginWithTwitter =  function(){
    var provider = new firebase.auth.FacebookAuthProvider();

 firebase.auth().signInWithPopup(provider).then(function(result) {

    $log.log("Authenticated successfully with payload:", angular.toJson(result));
    $state.go('home');
  
  })
  .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  $log.error("error:", angular.toJson(error));
});
  ;
  };
*/

});
