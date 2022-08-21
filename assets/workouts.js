// global variables
let exercise = document.getElementById("exercise");
let reps = document.getElementById("repetitions");
let sets = document.getElementById("sets");
let weight = document.getElementById("weight-resistance");

let shouldersBtn = document.getElementById("shoulders-btn");
let armsBtn = document.getElementById("arms-btn");
let chestBtn = document.getElementById("chest-btn");
let backBtn = document.getElementById("back-btn");
let absBtn = document.getElementById("abs-btn");
let legsBtn = document.getElementById("legs-btn");
let calvesBtn = document.getElementById("calves-btn");

let muscleGroupBtns = document.querySelectorAll(".muscle-group-btn");
let muscleGroupListContainer =
    document.getElementById("muscle-group-list-container");
let submitFitnessBtn = document.getElementById("submit-fitness-btn");
let clearFitnessStatsBtn = document.getElementById('clear-fitness-stats-btn');

// gets data from localstorage
function getFitnessProgress() {
    let str = localStorage.getItem('fitnessProgress');
    if (str != null) {
        return JSON.parse(str);
    }
    return [];
};

// creates new rows on the table with info from localstorage
function showFitnessProgress() {
    let workouts = getFitnessProgress();
    let tbl = document.getElementById("fitness-stats-table");

    // deleting the extra table rows that come on submit click
    let x = tbl.rows.length;
    while (--x) {
        tbl.deleteRow(x);
    }

    // for loop for adding table rows with localstorage info
    for (i = 0; i < workouts.length; i++) {
        let insertRow = tbl.insertRow();
        let cell1 = insertRow.insertCell();
        let cell2 = insertRow.insertCell();
        let cell3 = insertRow.insertCell();
        let cell4 = insertRow.insertCell();
        let cell5 = insertRow.insertCell();

        cell1.innerHTML = workouts[i].exercise;
        cell2.innerHTML = workouts[i].reps;
        cell3.innerHTML = workouts[i].sets;
        cell4.innerHTML = `${workouts[i].weight} lbs`;
        cell5.innerHTML = workouts[i].time;
    }
};

// generate list of workouts based on a specific muscle group
function populateWorkoutsList(specificMuscleGroupArray) {
    let workoutList = document.getElementById('workout-list');
    workoutList.innerHTML = '';

    // poplaute each exercise as a div
    for (i = 0; i < specificMuscleGroupArray.length; i++) {
        let workoutItem = document.createElement('div');
        workoutItem.innerHTML = specificMuscleGroupArray[i];
        workoutItem.setAttribute('class', 'exercise-choice');
        workoutList.append(workoutItem);
    }
    // store node list as a variable
    let exerciseChoiceList = document.querySelectorAll('.exercise-choice');

    // give all elements in the node list an event listener
    for (i = 0; i < exerciseChoiceList.length; i++) {
        exerciseChoiceList[i].addEventListener("click", populateWorkoutStatForm);
    }
};

// fill in input fields with data
function populateWorkoutStatForm() {
    exercise.value = this.innerHTML;
}

// call the workouts API
function workoutSearch(e) {
    e.preventDefault();

// local variable to dynamically grab inner HTML of muscle group
// button when function is called
    let workInputValue = this.innerHTML;

// ajax call to return entire list of exercises with no specific search criteria
// Note: " url: 'https://wger.de/api/v2/exerciseinfo/?limit=419' "
// will provide all 419 available exercises
// limit call to 100 for proof of concept and return less exercises to display
    return $.ajax({
        accepts: 'application/json',
        url: 'https://wger.de/api/v2/exerciseinfo/?limit=100',
        headers: {
            Accept: 'application/json',
            Authorization: 'Token fcb349c50df8f75a54860393aac33f92cb66e40d',
        }
    })
        .then(function (response) {
            // "response" variable is the response object that is returned
            // "results" variable is the array of workout objects
            let results = response.results;
            let specificMuscleGroupArray = [];

// for every workout that matches in name and the language is English,
// push it to the specificMuscleGroupArray
            for (i = 0; i < results.length; i++) {
                if (
                    workInputValue == results[i].category.name &&
                    results[i].language.full_name == 'English'
                ) {
                    specificMuscleGroupArray.push(results[i].name);
                }
            }

            populateWorkoutsList(specificMuscleGroupArray);
        })
        .catch(function (err) {
            alert(`Error: ${err}`);
        })
};

// clear out localstorage where the key is fitnessProgress and
// re - display the fitness progress table
function clearFitnessStatHistory() {
    // using const to make sure that this variable does not get altered elsewhere
    const getFitnessStorage = localStorage.getItem('fitnessProgress') || [];
    let fitnessStorageArray = JSON.parse(getFitnessStorage);
    fitnessStorageArray = [];
    localStorage.setItem("fitnessProgress", JSON.stringify(fitnessStorageArray));
    showFitnessProgress();
}

// needed to use FOR loop, because muscleGroupBtns returns a node list
// instead of a single node.Can only use.addEventListerner to a single
// node, not a node list.
    // Reference link for adding event to buttons via for loop: https://stackoverflow.com/questions/21700364/adding-click-event-listener-to-elements-with-the-same-class
for (i = 0; i < muscleGroupBtns.length; i++) {
    muscleGroupBtns[i].addEventListener("click", workoutSearch);
}

// event listener for button to get all input values
submitFitnessBtn.addEventListener('click', function (e) {
    e.preventDefault();

// get localstorage array
// needed to define array locally within function. Global variable would not work
    const fitnessProgressArray = getFitnessProgress();

// if statement confirms that reps, sets, and weight inputs from user are valid numbers
    if (
        parseInt(reps.value) &&
        parseInt(sets.value) &&
        parseInt(weight.value)
    ) {
// push a new object to localstorage array that has current user inputs when this function is called
        fitnessProgressArray.push({
            exercise: document.getElementById("exercise").value,
            reps: document.getElementById("repetitions").value,
            sets: document.getElementById("sets").value,
            weight: document.getElementById("weight-resistance").value,
            time: moment().format('L, h:mm a')
        })

        localStorage.setItem("fitnessProgress", JSON.stringify(fitnessProgressArray));
        // runs function to update table view
        showFitnessProgress();
    } else {
        alert('Please enter in valid number values for Repetitions, Sets, and Weight / Resistance');
}
});

// load fitness progress history on page load
showFitnessProgress();

// link function to clear localstorage to button
clearFitnessStatsBtn.addEventListener('click', clearFitnessStatHistory);