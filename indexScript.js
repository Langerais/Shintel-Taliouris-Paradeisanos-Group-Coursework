/**
 * @fileOverview Script for main page, mostly for table
 * @author Samuil Shintel
 * @author Nikolaos Taliouris
 * @author Nikolaos Paradeisanos
 */


var maxId = window.localStorage.length;
var addPersonRetryCounter = 0;
const addPersonRetryLimit = 1000;

$(document).ready(function(){

    $("table").tablesorter({
        sortList: [[0,0]],
        headers: {3:{sorter:false}}
    });

    tableRefresh();

    $('#table').on('click', 'input[type="image"]', function(){ //Remove entity button action
        removeElement(this);
    });

    $(".inputLine").on('change', function () {  //Capitalizes fname and lname on change
        let entered = $(this).val();
        let firstLetter = entered.charAt(0).toUpperCase();
        let rest = entered.substring(1);
        $(this).val(firstLetter + rest);
    });

    $("form").on("submit", function (){    //Adding new entity to the table

        let fname = $("#fnameinp").val();   //Get Firstname from input field
        let lname = $("#lnameinp").val();   //Get Lastname from input field

        const letters = /^[A-Za-z\-]+$/;    //Chars accepted for text-fields

        if (fname === "") {
            alert("Name must be filled out");
            return false;
        }
        else if (lname === "") {
            alert("Surname must be filled out");
            return false;
        }
        else if (!(fname+lname).match(letters)){
            alert("Fields should contain only characters and dash");
            return false;
        }
        else {
            clearInputFields();
            addPerson( -1, fname, lname);   //Adds person to the table with automatic ID creation
        }

    });



})

/**
 * Removes person from the storage and refreshes the table
 * @param element - clicked remove row button
 */
function removeElement(element){
    console.log("Removed: id " + $(element).closest('tr').attr("id"));
    localStorage.removeItem($(element).closest('tr').attr("id"));
    tableRefresh();
}

function clearInputFields(){
    $("#fnameinp").val('');
    $("#lnameinp").val('');
}

function addPerson(id, fname, lname){


    if(id < 0){ maxId = window.localStorage.length + 1; }
    else { maxId += 1; }

    let person = [fname, lname];

    try{

        if(window.localStorage.getItem(maxId) == null){

            window.localStorage.setItem(maxId, person.join());  //Add Person to local storage
            addRow(maxId, fname, lname);
            addPersonRetryCounter = 0;

        } else {
            if(addPersonRetryCounter > addPersonRetryLimit){    //Just in case, don't ask why
                addPersonRetryCounter += 1;
                console.log("ERROR: ID - " + maxId + " already exists; Retrying");
                addPerson(maxId + 1, fname, lname);
            } else {
                alert("An error occurred while adding the person. Retry limit reached");
                addPersonRetryCounter = 0;
            }
        }

    } catch (e){
        alert("ERROR: Cant Add person to Local Storage. Please report to your IT department");
    }

    tableRefresh();
}


function addRow(id, fname, lname){

    $('#table > tbody:last-child').append(
        '<tr class="tablerow" id="' + id + '"><td>' + id + '</td><td class="fname">' + fname + '</td> <td class="lname">' + lname + '</td><td><input class="removeBtn" type="image" src="https://icons-for-free.com/iconfiles/png/512/delete+remove+trash+trash+bin+trash+can+icon-1320073117929397588.png" width="20" height="20" alt="Remove Person"></td></tr>'
    );

    console.log("Added: " + id + " " + fname + " " + lname)
    $("table.tablesorter").trigger("update");
}

function dummyData(size){   //For testing purposes / Also allows numeric data here /
    storageClear()
    for(let i = 1; i <= size; i++) {
        let fname = "Name-" + i;
        let lname = "Surname-" + i;
        addPerson(i, fname, lname);
    }
}

function storageClear(){
    window.localStorage.clear();
    maxId = 0;
    tableRefresh();
}

function tableClear(){
    $(".tablerow").remove();
    $("table.tablesorter").trigger("update");
}

function tableRefresh(){

    tableClear();

    $(".dummyRow").remove();

    if(localStorage.key(0) == null){
        $("#hint").show();
    } else
    {
        $("#hint").hide();
        for(let i = 0; i < localStorage.length; i++){
            let person = $(localStorage.getItem(localStorage.key(i)).split(','));
            addRow(localStorage.key(i), person[0], person[1]);
        }
    }

    $("table.tablesorter").trigger("update");
}