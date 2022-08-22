// global variables
let foodBtnList = document.querySelectorAll('.food-btn');
let foodNameData = document.getElementById('food-name-data');
let proteinData = document.getElementById('protein-data');
let carbsData = document.getElementById('carbs-data');
let fatData = document.getElementById('fat-data');
let caloriesData = document.getElementById('calories-data');

let foodName = document.getElementById('food-name');
let protein = document.getElementById('protein');
let carbs = document.getElementById('carbs');
let fat = document.getElementById('fat');
let calories = document.getElementById('calories');
let servingSize = document.getElementById('serving-size');
let servings = document.getElementById('servings');

let nutritionTable = document.getElementById('nutrition-table');
let submitNutritionBtn = document.getElementById("submit-nutrition-btn");
let clearNutritionStatsBtn =
document.getElementById('clear-nutrition-stats-btn');

// gets data from localstorage
function getNutritionProgress() {
let str = localStorage.getItem('nutritionProgress');
if (str != null) {
return JSON.parse(str);
}
return []
};

// creates new rows on the table with info from localstorage
function showNutritionProgress() {
let foods = getNutritionProgress();
let tbl = document.getElementById("nutrition-stats-table");

// deleting the extra table rows that come on submit click
let x = tbl.rows.length;
while(--x){
tbl.deleteRow(x);
}

// for loop for adding table rows with localstorage info
for (i = 0; i < foods.length; i++) {
let insertRow = tbl.insertRow();
let cell1 = insertRow.insertCell();
let cell2 = insertRow.insertCell();
let cell3 = insertRow.insertCell();
let cell4 = insertRow.insertCell();
let cell5 = insertRow.insertCell();
let cell6 = insertRow.insertCell();
let cell7 = insertRow.insertCell();
let cell8 = insertRow.insertCell();

cell1.innerHTML = foods[i].foodName;
cell2.innerHTML = `${foods[i].protein} g`;
cell3.innerHTML = `${foods[i].carbs} g`;
cell4.innerHTML = `${foods[i].fat} g`;
cell5.innerHTML = foods[i].calories;
cell6.innerHTML = `${foods[i].servingSize} g`;
cell7.innerHTML = foods[i].servings;
cell8.innerHTML = foods[i].time;
}
};

// fill in input fields with data
function populateNutritionStatForm (resultObj){
foodName.value = resultObj.description;
protein.value = resultObj.foodNutrients[0].value;
fat.value = resultObj.foodNutrients[1].value;
carbs.value = resultObj.foodNutrients[2].value;
calories.value = resultObj.foodNutrients[3].value;
servingSize.value = resultObj.servingSize;
servings.value = '1';
}

// call the nutrition API
function nutritionSearch(e) {
e.preventDefault();

// local variable to dynamically grab inner HTML of food button when
//function is called
let foodKeyWord = this.innerHTML;

// ajax call to return entire list of exercises with no specific search criteria
return $.ajax({
accepts: 'application/json',
url: `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodKeyWord.toLowerCase()}&api_key=LcemQEts2S0XWbacBnUnnd4NFzwPTrlbn5MJjrz2`,
headers: {
Accept: 'application/json',
}
})
.then(function(response) {
// "response" variable is the response object that is returned

// note that not all foods at foods[0] have the same order of
//nutrients. Need to add in checks later.
let firstResult = response.foods[0];

populateNutritionStatForm(firstResult)
})
.catch(function(err) {
alert(`Error: ${err}`);
})
};

// clear out localstorage where the key is nutritionProgress and
//re-display the nutrition progress table
function clearNutritionStatHistory (){
// using const to make sure that this variable does not get altered elsewhere
const getNutritionStorage = localStorage.getItem('nutritionProgress') || [];;
let nutritionStorageArray = JSON.parse(getNutritionStorage);
nutritionStorageArray = [];
localStorage.setItem("nutritionProgress",
JSON.stringify(nutritionStorageArray));
showNutritionProgress();
}

// needed to use FOR loop, because muscleGroupBtns returns a node list
//instead of a single node. Can only use .addEventListerner to a single
//node, not a node list.
// Reference link for adding event to buttons via for loop:
https://stackoverflow.com/questions/21700364/adding-click-event-listener-to-elements-with-the-same-class
for(i = 0; i < foodBtnList.length; i++){
foodBtnList[i].addEventListener("click", nutritionSearch);
}

// event listener for button to get all input values
submitNutritionBtn.addEventListener('click', function (e) {
e.preventDefault();

// get localstorage array
// needed to define array locally within function. Global variable
//would not work
const nutritionProgressArray = getNutritionProgress();

// Note: First attempts to check for valid integer to float value for
//protein, carbs, fat, calories, servingSize, and servings failed. Need
//to investigate.
// push a new object to localstorage array that has current user
//inputs when this function is called
nutritionProgressArray.push({
foodName: document.getElementById("food-name").value,
protein: document.getElementById("protein").value,
carbs: document.getElementById("carbs").value,
fat: document.getElementById("fat").value,
calories: document.getElementById("calories").value,
servingSize: document.getElementById("serving-size").value,
servings: document.getElementById("servings").value,
time: moment().format('L, h:mm a')
})

localStorage.setItem("nutritionProgress",
JSON.stringify(nutritionProgressArray));

// runs function to update table view
showNutritionProgress();
});

// load nutrition progress history on page load
showNutritionProgress();

// link function to clear localstorage to button
clearNutritionStatsBtn.addEventListener('click', clearNutritionStatHistory);