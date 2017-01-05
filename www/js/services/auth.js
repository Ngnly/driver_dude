angular.module('driver_dude').factory('Auth', function(FURL, $log, $firebaseAuth, $firebaseArray, $firebaseObject, $translate, Utils) {

	//var ref = new Firebase(FURL);

  firebase.initializeApp(FURL);
	//var auth = $firebaseAuth(ref);
  var ref = firebase.database().ref();
  //var auth = $firebaseObject(ref);
  var auth = $firebaseAuth();

	var Auth = {
		user: {},

    login: function(user) {
      return auth.$signInWithEmailAndPassword(
        user.email, user.password
      );
    },

    createProfile: function(uid, user) {
      var profile = {
        id: uid,
        email: user.email,
        registered_in: Date(),
        displayName: user.name
      };

      // If you want insert more data should modify register.html and modify your object.

      /*
      var profile = {
				id: uid,
        name: user.name,
        lastname: user.lastname,
        address: user.address,
        email: user.email,
				registered_in: Date()
      };
      */

      var messagesRef = $firebaseArray(firebase.database().ref().child("users"));
      messagesRef.$add(profile);
      $log.log("User Saved");
    },

    register: function(user) {
      return auth.$createUserWithEmailAndPassword(user.email, user.password)
        .then(function(firebaseUser) {
          console.log("User created with uid: " + firebaseUser.uid);
          Auth.createProfile(firebaseUser.uid,user);
          Utils.alertshow("Successfully.","The User was Successfully Created.");
        })
        .catch(function(error) {
           Utils.alertshow("Error.","The email has been taken.");
          $log.log("Error: " + error);
        });
    },

    logout: function() {
      auth.$signOut();
			$log.log("Usuario Sale.");
    },

		resetpassword: function(email) {
			return auth.$sendPasswordResetEmail(
				  email
				).then(function() {
					Utils.alertshow($translate.instant('MESSAGES.title_1'),$translate.instant('MESSAGES.success_message'));
				  //console.log("Password reset email sent successfully!");
				}).catch(function(error) {
					Utils.errMessage(error);
				  //console.error("Error: ", error.message);
				});
    },

		changePassword: function(user) {
			return auth.$changePassword({email: user.email, oldPassword: user.oldPass, newPassword: user.newPass});
		},

    signInWithProvider: function(provider) {
      return Auth.signInWithPopup('google');
    }
	};
	return Auth;

});
