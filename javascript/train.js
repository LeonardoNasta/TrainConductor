

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD4Br_THnTLn1sSsfNxTMM9FgIFNmD-AxU",
  authDomain: "train-scheduler-13a8a.firebaseapp.com",
  databaseURL: "https://train-scheduler-13a8a.firebaseio.com",
  storageBucket: "train-scheduler-13a8a.appspot.com",
  messagingSenderId: "210144903613"
};
firebase.initializeApp(config);

var database = firebase.database();

//establish clock
function currentTime(){
var localTime = moment().format("LT");
console.log(localTime);
setTimeout(localTime, 1000);
}

//submit button pushes data to firebase.
$("#submit-button").on("click", function(event) {
    event.preventDefault();

    //collects input data
    var nameInput = $("#train-name").val().trim();
    var destinationInput = $("#destination").val().trim();
    var timeInput = $("#train-time").val().trim();
    var frequencyInput = $("#frequency").val().trim();


    //pushes train info to firebase
    database.ref().push({
        train: nameInput,
        destination: destinationInput,
        arrivalTime: timeInput,
        trainFrequency: frequencyInput

        });

        //clears forms for reuse.
    $(".form-field").val("");

});

  //gets dynamic info from firebase

  database.ref().on("child_added", function(childSnapshot) {

    var trainName = childSnapshot.val().train;
    var trainDestination = childSnapshot.val().destination;
    var correctTime = childSnapshot.val().arrivalTime;
		var frequency = childSnapshot.val().frequency;

		var frequency = parseInt(frequency);
    
    currentTime();
    
    var trainTime = moment(convertDate).format("HHmm");

    //Time math and momentJS formatting. 
    var convertDate = moment(childSnapshot.val().arrivalTime, "HHmm").subtract(1, "years");
		var convertTime = moment(trainTime, "HHmm").subtract(1, "years");
		var timeDiff = moment().diff(moment(convertTime), "minutes");
    var timeLeft = timeDiff % frequency;

		//minutes until next train arrival
		var minutesToArrival = frequency - timeLeft;

    //next train arrival
		var nextArrival = moment().add(minutesToArrival, "minutes");
		var $nextArrival = moment(nextArrival).format("HHmm");


//dynamically update html table data
    var addTR = $("<tr>");
    addTR.append($("<td>'" + trainName + "</td>"));

    addTR.append($("<td>" + trainDestination + "</td>"));

    addTR.append($("<td>" + frequency + "</td>"));

    addTR.append($("<td>" + correctTime + "</td>"));

    addTR.append($("<td>" + moment($nextArrival).format("HHmm") + " minutes away</td>"));

    $('#table-row-data').append(addTR);

  });