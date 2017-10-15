
  // Initialize Firebase
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC5QYfj77eVWzQ88eRJpd_lx6izZrED3-Y",
    authDomain: "fir-demo-7bfa0.firebaseapp.com",
    databaseURL: "https://fir-demo-7bfa0.firebaseio.com",
    projectId: "fir-demo-7bfa0",
    storageBucket: "fir-demo-7bfa0.appspot.com",
    messagingSenderId: "626858286708"
  };
  firebase.initializeApp(config);

  	var updateNotesRef;
  	const auth = firebase.auth();
  	var currentUser = auth.currentUser;
  	const database = firebase.database();
  	const usersRef = database.ref().child("users");

	const signInUser = function(){
		var inputEmail = document.getElementById("inputEmail");
		var inputPassword = document.getElementById("inputPassword");
		var errorLabel = document.getElementById("error");
		var email = inputEmail.value;
		var password = inputPassword.value;
  		firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error){
			var errorCode = error.code;
		  	var errorMessage = error.message;
		  	console.log(error);
		  	errorLabel.style.display = "inline";
		  	if("auth/user-not-found" === errorCode){
				errorLabel.innerText = "No user has found.";
		  	}else if("auth/wrong-password" == errorCode){
				errorLabel.innerText = "Password incorrect.";
		  	}else if("auth/network-request-failed" === errorCode){
		  		errorLabel.innerText = "Please check your network connection";
		  	}else{
		  		errorLabel.innerText = errorMessage;
		  	}
  		});
	};

  	const signUpUser = function(){
		var inputEmail = document.getElementById("inputEmail");
		var inputPassword = document.getElementById("inputPassword");
		var errorLabel = document.getElementById("error");
		var email = inputEmail.value;
		var password = inputPassword.value;
  		firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error){
			var errorCode = error.code;
		  	var errorMessage = error.message;
		  	errorLabel.style.display = "inline";
		  	console.log(error);
		  	if("auth/email-already-in-use" === errorCode){
		  		errorLabel.innerText = "User account already exists";
		  	}else if("auth/network-request-failed" === errorCode){
		  		errorLabel.innerText = "Please check your network connection";
		  	}else{
		  		errorLabel.innerText = errorMessage;
		  	}
  		});
  	};

const checkUserStatus = function(){
	var hUserStatus = document.querySelector("#userStatus");
	var divSignin = document.getElementById("signinContainer");
	var divProfileContainer = document.getElementById("profileContainer");
	var error = document.getElementById("error");
	error.style.display = "none";
	if(currentUser){
		hUserStatus.innerText = "User logged in";
		divSignin.style.display = "none";
		divProfileContainer.style.display = "inline";
		var email = document.getElementById("email");
		var btnSignOut = document.getElementById("btnSignout");
		email.innerText = "Email : "+currentUser.email;
		btnSignOut.addEventListener('click', onSignOutClick);
		updateNoteContainer(true);
  	}else{
  		var btnSignin = document.getElementById("btnSignIn");
  		var btnSignUp = document.getElementById("btnSignUp");
		btnSignin.addEventListener('click', signInUser);
		btnSignUp.addEventListener('click', signUpUser);
  		divSignin.style.display = "inline";
  		divProfileContainer.style.display = "none";
		hUserStatus.innerText = "User not logged in";
		updateNoteContainer(false);
  	}
  };

  const onSignOutClick = function(){
  	auth.signOut().then(function(){
  		console.log("User logged out");
  		var ulList = document.getElementById("ulList");
  		ulList.innerHtml = "";
  	}, function(error){
  		console.log("Cannot able to logout ERROR "+error);
  	});
  };

	const getNotesRef = function(){
		if(currentUser){
			return usersRef.child(currentUser.uid).child("notes");
		}
		return null;
	}

  var addNote = function(){
		var inputTitle = document.getElementById("inputTitle");
  		var inputDescription = document.getElementById("inputDescription");
  		var notesRef = getNotesRef();
  		var pushKey;
  		if(updateNotesRef){
			pushKey = updateNotesRef;
  		}else{
  			pushKey = notesRef.push().key;
  		}
  		notesRef.child(pushKey).set({
  			title : inputTitle.value,
  			description : inputDescription.value
  		}).then(function(){
  			inputTitle.value = "";
			inputDescription.value = "";
  			if(updateNotesRef){
  				updateNotesRef = null;
  				console.log("Updated the data");
  				var btnAdd = document.getElementById("btnAdd");
  				btnAdd.innerText = "Add";
  				var buttonCancel = document.getElementById("btnCancel");
  				buttonCancel.style.display = "none";
  			}else{
  				console.log("Created the data");
  			}
  		}).catch(function(error){
  			console.log("Error While creating"+error);
  		});
  };

  const updateNoteContainer = function(show){
  	var noteContainer = document.getElementById("noteContainer");
  	if(show){
  		noteContainer.style.display = "inline";
  		var btnAdd = document.getElementById("btnAdd");
  		btnAdd.addEventListener('click', addNote);
  		var ulList = document.getElementById("ulList");
  		var notesRef = getNotesRef();
  		notesRef.on("child_added", function(snapshot){
  			var data = snapshot.val();
  			console.log("Newly Added Title : "+data.title);
  			var li = document.createElement("li");
  			var div = document.createElement("div");
  			div.setAttribute("style","display:inline-block;");
  			var title = document.createElement("h4");
  			title.setAttribute("style","float:left;");
  			var description = document.createElement("p");
  			description.setAttribute("style","float:left;margin-left:10px;");
  			var buttonDelete = document.createElement("button");
  			buttonDelete.setAttribute("type","button");
  			buttonDelete.setAttribute("class","btn btn-default");
  			var span = document.createElement("span");
  			span.setAttribute("class", "glyphicon glyphicon-trash");
  			span.setAttribute("style","color:red;");
  			buttonDelete.appendChild(span);
  			buttonDelete.setAttribute("style","margin-left:10px");
  			var buttonEdit = document.createElement("button");
  			buttonEdit.setAttribute("type","button");
  			buttonEdit.setAttribute("class","btn btn-default");
  			var span = document.createElement("span");
  			span.setAttribute("class", "glyphicon glyphicon-pencil");
  			buttonEdit.appendChild(span);
  			buttonEdit.setAttribute("style","margin-left:10px");

  			title.appendChild(document.createTextNode(data.title));
  			description.appendChild(document.createTextNode(data.description));
  			title.setAttribute("class","title");
  			description.setAttribute("class","description");
  			div.appendChild(title);
  			div.appendChild(description);
  			div.appendChild(buttonDelete);
  			div.appendChild(buttonEdit);
  			buttonDelete.addEventListener('click', function(){
  				snapshot.ref.remove().then(function(){
  					console.log("Deleted the note");
  				}).catch(function(error){
  					console.log("Cannot remove");
  				});
  			});
  			buttonEdit.addEventListener('click', function(){
  				var inputTitle = document.getElementById("inputTitle");
  				var inputDescription = document.getElementById("inputDescription");
  				var li = document.getElementById("id"+snapshot.key);
	  			var title = li.getElementsByClassName("title")[0];
	  			var description = li.getElementsByClassName("description")[0];
  				inputTitle.value = title.innerText;
  				inputDescription.value = description.innerText;
  				var btnAdd = document.getElementById("btnAdd");
  				btnAdd.innerText = "Update";
  				updateNotesRef = snapshot.key;
  				var buttonCancel = document.getElementById("btnCancel");
  				buttonCancel.style.display = "inline";
  				buttonCancel.addEventListener('click', function(){
  					updateNotesRef = null;
  					btnAdd.innerText = "Add";
  					buttonCancel.style.display = "none";
  					buttonCancel = null;
  					inputTitle.value = "";
  					inputDescription.value = "";
  				});
  			});
  			li.setAttribute("id","id"+snapshot.key);
  			li.appendChild(div);
  			ulList.appendChild(li);
  		});
  		notesRef.on("child_changed", function(snapshot){
  			var data = snapshot.val();
  			console.log("Updated Title : "+data.title);
  			var li = document.getElementById("id"+snapshot.key);
  			var title = li.getElementsByClassName("title")[0];
  			var description = li.getElementsByClassName("description")[0];
  			title.innerText = data.title;
  			description.innerText = data.description;
  		});
  		notesRef.on("child_removed", function(snapshot){
  			var data = snapshot.val();
  			var div = document.getElementById("id"+snapshot.key);
  			div.parentNode.removeChild(div);
  			console.log("Removed Title : "+data.title);
  		});
  	}else{
		noteContainer.style.display = "none";
  	}
  };

window.onload = function(){

	checkUserStatus();
	auth.onAuthStateChanged(function(user){
		currentUser = user;
		checkUserStatus();
		if(currentUser){

		}else{

		}
	});
}