//all variables for input values
var exercise = document.getElementById("exercise");
var reps = document.getElementById("repetition");
var sets = document.getElementById("set");
var weight = document.getElementById("weight-resistance");
var volume = document.getElementById("volume");
var calories = document.getElementById("calories");
var workTime = document.getElementById("workout-time");
var calsBurn = document.getElementById("cals-burned");
var addRow = document.getElementById("add-rows");
var buttonOne = document.getElementById("buttonOne");
var buttonTwo = document.getElementById("buttonTwo");


// variable for array
var arr = new Array();

//eventlistener for button to get all input values
buttonOne.addEventListener('click', function (addData) {
    e.preventDefault();
    getData();
    arr.push({
        exercise: document.getElementById("exercise").value,
        reps: document.getElementById("repetition").value,
        sets: document.getElementById("set").value,
        weight: document.getElementById("weight-resistance").value,
        volume: document.getElementById("volume").value
    })
    localStorage.setItem("localData", JSON.stringify(arr));
    //runs function to create new row on table
    showData();
});

//gets data from local storage
function getData() {
    var str = localStorage.getItem('localData');
    if (str != null) {
        return JSON.parse(str);
    }
    return []
};

//creates new rows on the table with info from local storage
function showData() {
    var workouts = getData();
    var tbl = document.getElementById("myTable");
    //deleteing the extra table rows that come on submit click
    var x = tbl.rows.length;
    while(--x){
        tbl.deleteRow(x);
    }
    //for loop for adding table rows with localstorage info
    for (i = 0; i < workouts.length; i++) {
        var insertRow = tbl.insertRow();
        var cell1 = insertRow.insertCell();
        var cell2 = insertRow.insertCell();
        var cell3 = insertRow.insertCell();
        var cell4 = insertRow.insertCell();
        var cell5 = insertRow.insertCell();

        cell1.innerHTML = workouts[i].exercise;
        cell2.innerHTML = workouts[i].reps;
        cell3.innerHTML = workouts[i].sets;
        cell4.innerHTML = workouts[i].weight;
        cell5.innerHTML = workouts[i].volume;
    }
};

//function to pull workout api
function getWorkouts() {
    return $.ajax({
        accepts: 'application/json',
        url: 'https://wger.de/api/v2/workout/',
        headers: {
            Accept: 'application/json',
            Authorization: 'Token fcb349c50df8f75a54860393aac33f92cb66e40d'
        }
    })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(err) {
            console.error(err);
            // do something to notify the user
        })
};


//function testRun() {
   // return $.ajax({
     //   accepts: 'application/json',
       // url: 'https://wger.de/api/v2/exerciseinfo/?limit=20&offset=20',
        //headers: {
          //  Accept: 'application/json',
            //Authorization: 'Token fcb349c50df8f75a54860393aac33f92cb66e40d',
       // }
    //})
      //  .then(function(res) {
        //    console.log(res)
       // })
//};

//function for searching workouts
function workoutSearch(e) {
    e.preventDefault();


    var workInputValue = document.querySelector('#workSearch').value;

    return $.ajax({
        accepts: 'application/json',
        url: 'https://wger.de/api/v2/exerciseinfo/?limit=419',
        headers: {
            Accept: 'application/json',
            Authorization: 'Token fcb349c50df8f75a54860393aac33f92cb66e40d',
        }
    })
        .then(function(res) {
            console.log(res)
        })
        


};

//function for creating info card for workout searches
function workoutResults(workObj) {
    //info card being created
    var workCard = document.createElement('div');
    workCard.classList.add();

    //info body being created and attached to the card
    var workBody = document.createElement('div');
    workBody.classList.add();
    workCard.append(workBody);

    //title being created for the card/body
    var workTitle = document.createElement('h3');
    workTitle.textContent = workObj.title;

    //info of the workout being created in a paragraph
    var bodyContent = document.createElement('p');
    bodyContent.innerHTML =
        '<strong>Description:</strong>' + workObj.description[0];

};




//var for the submit button for workout search
var buttonThree = document.getElementById("buttonThree");

//function for starting workout search through click
buttonThree.addEventListener('click', workoutSearch);

//runs function on refresh of page for createing table
showData();