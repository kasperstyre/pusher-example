var serverAddress = "10.10.1.1:3000";

$(document).ready(function() {
    $("#name").focus();
});

function addPerson(person) {
    var container = $("<div></div>").addClass("container")
        .append($("<div></div>").addClass("id").text("ID: " + person.id))
        .append($("<div></div>").addClass("name").text("Name: " + person.name))
        .append($("<div></div>").addClass("age").text("Age: " + person.age))
        .append($("<div></div>").addClass("eye-color").text("Eye color: " + person.eye_color))
        .append($("<button></button>").text("Delete").addClass("delete-btn").click(function() { deletePerson(person); }))
        .append($("<button></button>").text("Update").addClass("update-btn").click(function() { enableEditMode(person); }));

    $("#wrapper").append(container);
}

function removePerson(person) {
    var personContainer = $(".id:contains(" + person.id + ")").parent();

    personContainer.remove();
}

function getPersonUpdate(person) {
    var personContainer = $(".id:contains(" + person.id + ")").parent();

    personContainer.children(".name").text("Name: " + person.name);
    personContainer.children(".age").text("Age: " + person.age);
    personContainer.children(".eye-color").text("Eye color: " + person.eye_color);

    personContainer.children(".update-btn").off("click").click(function() { enableEditMode(person) });
}

function getAllPersons() {
    $.ajax({
        type: "GET",
        url: "http://" + serverAddress + "/person",
        success: function(data) {
            var result = JSON.parse(data);

            for (var i = 0; i < result.length; i++) {
                addPerson(result[i]);
            }
        }
    });
}

function createPerson() {
    var name = $("#name").val();
    var age = $("#age").val();
    var eyeColor = $("#eye-color").val();

    $.ajax({
        type: "POST",
        url: "http://" + serverAddress + "/person",
        data: {
            "name": name,
            "age": age,
            "eye_color": eyeColor,
            "socket_id": (socketId) ? socketId : null
        },
        success: function(data) {
            alert("Person was created!");
            addPerson(JSON.parse(data));
            $("#name, #age, #eye-color").val("");
            $("#name").focus();
        }
    });
}

function updatePerson() {
    var personId = $("#person-form").data("personId");
    var name = $("#name").val();
    var age = $("#age").val();
    var eyeColor = $("#eye-color").val();

    $.ajax({
        type: "PUT",
        url: "http://" + serverAddress + "/person/" + personId,
        data: {
            "name": name,
            "age": age,
            "eye_color": eyeColor,
            "socket_id": (socketId) ? socketId : null
        },
        success: function(data) {
            var person = JSON.parse(data);

            alert("Person with ID = " + person.id + " was updated!");
            getPersonUpdate(person);
            disableEditMode();
        }
    });
}

function deletePerson(person) {
    $.ajax({
        type: "DELETE",
        url: "http://" + serverAddress + "/person/" + person.id,
        data: {
            "socket_id": (socketId) ? socketId : null
        },
        success: function() {
            alert("Person with ID = " + person.id + " was deleted!");
            removePerson(person);
        }
    });
}

function enableEditMode(person) {
    $("#submit-btn").val("Update");
    $("#cancel-btn").show();

    $("#person-form").data("personId", person.id);
    $("#person-form").attr("action", "JavaScript:updatePerson()");
    
    $("#name").val(person.name);
    $("#age").val(person.age);
    $("#eye-color").val(person.eye_color);

    $("#name").focus();
}

function disableEditMode() {

    $("#submit-btn").val("Create");
    $("#cancel-btn").hide();

    $("#person-form").data("personId", null);
    $("#person-form").attr("action", "JavaScript:createPerson()");
    
    $("#name, #age, #eye-color").val("");

    $("#name").focus();
}