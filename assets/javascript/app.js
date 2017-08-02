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

var database = firebase.database();
var playerOne;
var playerTwo;
var playerOneChoice = "";
var playerTwoChoice = "";
var madeChoiceOne = false;
var madeChoiceTwo = false;
var playerOneWin = 0;
var playerOneLoss = 0;
var playerTwoWin = 0;
var playerTwoLoss = 0;
var keyOne;
var keyTwo;
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

//Constructor function that creates player object. 
function Player (key, wins, losses)
{
	this.key = key;
	this.wins = wins;
	this.losses = losses
}

//Function that holds rock paper scissors logic. 
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

//Need code that looks at what option both players chose and updates database
//with those values. Keep players from making new choice. 
$(document).ready(function() 
{	
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
		var arr = snap.val();
		var arr2 = Object.keys(arr);
		keyOne = arr2[0];
		keyTwo = arr2[1];
		if(arr2.length > 0)
		playerOne = new Player(keyOne, playerOneWin, playerOneLoss);
		if(arr2.length > 1)
		playerTwo = new Player(keyTwo, playerTwoWin, playerTwoLoss);
	});

	$(".gameButtonOne").click(function()
	{
		if(!madeChoiceOne)
		{
			//set so player cannot change choice
			madeChoiceOne = true;

			playerOneChoice = $(this).attr("value");
			database.ref().set(
			{
				playerOneChoice: $(this).attr("value"),
				playerTwoChoice: playerTwoChoice,
				madeChoiceTwo: madeChoiceTwo,
				madeChoiceOne: madeChoiceOne
			});
		}
	});
	
	$(".gameButtonTwo").click(function()
	{
		if(!madeChoiceTwo)
		{
			madeChoiceTwo = true;

			playerTwoChoice = $(this).attr("value");
			database.ref().set(
			{
				playerOneChoice: playerOneChoice,
				playerTwoChoice: $(this).attr("value"),
				madeChoiceTwo: madeChoiceTwo,
				madeChoiceOne: madeChoiceOne
			});
		}
	});

//should have code that checks when database has been updated if both players have made a choice.
//execute rock paper scissor logic then...
	database.ref().on("value", function(snap)
	{
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
			madeChoiceOne = false;
			madeChoiceTwo = false;
			playerOneChoice = "";
			playerTwoChoice = "";
		}
	});
});
