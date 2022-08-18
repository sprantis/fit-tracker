//all variables for input values
var exercise = document.getElementById("exercise");
var reps = document.getElementById("repetition");
var sets = document.getElementById("set");
var weight = document.getElementById("weight-resistance");
var volume = document.getElementById("volume");
var calories = document.getElementById("calories");
var workTime = document.getElementById("workout-time");
var calsBurn = document.getElementById("cals-burned");
var addRow = document.getElementById("add-rows")
var buttonOne = document.getElementById("buttonOne")
var buttonTwo = document.getElementById("buttonTwo")

// variable for array
var arr = new Array();

//eventlistener for button to get all input values
buttonOne.addEventListener('click', function (addData) {
    event.preventDefault();
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
}

//creates new rows on the table with info from local storage
function showData() {
    var workouts = getData();
    var tbl = document.getElementById("myTable");
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

//runs function on refresh of page for createing table
showData();