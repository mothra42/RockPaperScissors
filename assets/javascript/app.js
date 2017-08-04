// Initialize Firebase
var config = 
{
	apiKey: "AIzaSyA3dXDVs5iF4XbOYrkPHLR4Nhu5MulIfKY",
	authDomain: "rockpaperscissors-bab21.firebaseapp.com",
	databaseURL: "https://rockpaperscissors-bab21.firebaseio.com",
	projectId: "rockpaperscissors-bab21",
	storageBucket: "rockpaperscissors-bab21.appspot.com",
	messagingSenderId: "139235153403"
};
firebase.initializeApp(config);
//references to database
var database = firebase.database();
var playersRef = database.ref("players");
var playerOneRef = playersRef.child('one');
var playerTwoRef = playersRef.child('two');
var playerOneChoice = "";
var playerTwoChoice = "";
var madeChoiceOne = false;
var madeChoiceTwo = false;
var playerOneWins = 0;
var playerOneLosses = 0;
var playerOneTies = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;
var playerTwoTies = 0;
var user;
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var keyOne;
var keyTwo; 

//These variables check if player one or player two exist.
var playerOneExists;
var playerTwoExists;

//Functions
function whoWins(playerOne, playerTwo)
{	
	if (playerOne === "rock" && playerTwo === "scissor") 
	{
	  alert("player One Wins!");
	} 
	else if (playerOne === "rock" && playerTwo === "paper")
	{
	  alert("player two Wins!");
	} 
	else if (playerOne === "scissor" && playerTwo === "rock")
	{
	  alert("player two Wins!");
	} 
	else if (playerOne === "scissor" && playerTwo === "paper")
	{
	  alert("player One Wins!");
	} 
	else if (playerOne === "paper" && playerTwo === "scissor")
	{
	  alert("player two Wins!");
	} 
	else if (playerOne === "paper" && playerTwo === "rock")
	{
		alert("player One Wins!");
	}
	else if (playerOne === playerTwo) 
	{
	  alert("its a tie");
	}
}

//LOOKS AT CONNECTIONS
// When the client's connection state changes...
connectedRef.on("value", function(snap) 
{
  // If they are connected..
  if (snap.val()) 
  {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
	// Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});	
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) 
{
	//do something here to mess with child added....

	var arr = snap.val();
	var arr2 = Object.keys(arr);
	keyOne = arr2[0];
	keyTwo = arr2[1];
});

//sets playerOneExists and playerTwoExists depending on their existence in the database.

//How players make choices
$(".gameButtonOne").click(function()
	{
		if(!madeChoiceOne && user === 1)
		{
			//set so player cannot change choice
			madeChoiceOne = true;

			playerOneChoice = $(this).attr("value");
			database.ref("/choiceData").set(
			{
				playerOneChoice: $(this).attr("value"),
				playerTwoChoice: playerTwoChoice,
				madeChoiceTwo: madeChoiceTwo,
				madeChoiceOne: madeChoiceOne
			});
		}
		console.log(playerOneChoice);
		console.log("woop");
	});
	
	$(".gameButtonTwo").click(function()
	{
		if(!madeChoiceTwo && user === 2)
		{
			madeChoiceTwo = true;

			playerTwoChoice = $(this).attr("value");
			database.ref("/choiceData").set(
			{
				playerOneChoice: playerOneChoice,
				playerTwoChoice: $(this).attr("value"),
				madeChoiceTwo: madeChoiceTwo,
				madeChoiceOne: madeChoiceOne
			});
		}
	});

$(document).ready(function() 
{	
	$(".nameButton").click(function(event)
	{
		//prevent submit feature
		event.preventDefault();
		//when player 1 connects
		//add info to database
		if(!playerOneExists)
		{
			user = 1;
			localStorage.setItem("key", keyOne);
			playerOneRef.push(
			{
				name: $("#nameInput").val(),
				wins: playerOneWins,
				losses: playerOneLosses,
				ties: playerOneTies
			});
		}
		//when player 2 connects
		//add info to database
		else if(playerOneExists && !playerTwoExists)
		{
			user = 2;
			localStorage.setItem("key", keyTwo);
			playerTwoRef.push({
				name: $("#nameInput").val(),
				wins: playerTwoWins,
				losses: playerTwoLosses,
				ties: playerTwoTies
			});
		}
		//if player 1 disconnects and player 2 remains
		//add info to database
		else if(!playerOneExists && playerTwoExists)
		{
			user = 1;
			playerOneRef.push(
			{
				name: $("#nameInput").val(),
				wins: playerOneWins,
				losses: playerOneLosses,
				ties: playerOneTies
			});
			//add to disconnect checker thingy. 
			//playerOneRef.onDisconnect().remove();
			//playerTwoRef.onDisconnect().remove();
		}
	});

	//sets playerOneExists and playerTwoExists depending on their existence in the database.
	database.ref().on("value", function(snap)
	{
		playerOneExists = snap.child("players").child("one").exists();
		playerTwoExists = snap.child("players").child("two").exists();
		//console.log(user);

		var data = snap.val();

		if(snap.child("playerOneChoice").exists())
			playerOneChoice = data.playerOneChoice;
	
		if(snap.child("playerTwoChoice").exists())
			playerTwoChoice = data.playerTwoChoice;

		if(snap.child("madeChoiceOne").exists())
			madeChoiceOne = data.madeChoiceOne;

		if(snap.child("madeChoiceTwo").exists())
			madeChoiceTwo = data.madeChoiceTwo;
	
		if(madeChoiceOne && madeChoiceTwo)
		{
			whoWins(playerOneChoice,playerTwoChoice);
			database.ref("/choiceData").set(
			{
				madeChoiceOne: false,
				madeChoiceTwo: false,
				playerOneChoice: "different",
				playerTwoChoice: "somethingElse"
			});
		}
	});
});