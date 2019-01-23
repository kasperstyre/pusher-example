var personUpdateMode = false;

function addPerson(person) {
    var container = $("<div></div>").addClass("container")
        .append($("<div></div>").addClass("id").text("ID: " + person.id))
        .append($("<div></div>").addClass("name").text("Name: " + person.name))
        .append($("<div></div>").addClass("age").text("Age: " + person.age))
        .append($("<div></div>").addClass("eye-color").text("Eye color: " + person.eye_color))
        .append($("<button></button>").text("Delete").addClass("delete-btn").click(function() { deletePerson(person); }));

    $("#wrapper").append(container);
}

function removePerson(person) {
    var personContainer = $(".id:contains(" + person.id + ")").parent();

    personContainer.remove();
}

function getPersonUpdate(person) {
    var personContainer = $(".id:contains(" + person.id + ")").parent();

    personContainer.children(".name").text(person.name);
    personContainer.children(".age").text(person.age);
    personContainer.children(".eye-color").text(person.eye_color);
}

function getAllPersons() {
    $.ajax({
        type: "GET",
        url: "http://10.10.1.1:3000/person",
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
        url: "http://10.10.1.1:3000/person",
        data: {
            "name": name,
            "age": age,
            "eye_color": eyeColor
        },
        success: function(data) {
            alert("Person was created!");
            addPerson(JSON.parse(data));
            $("#name, #age, #eye-color").val("");
        }
    });
}

function deletePerson(person) {
    $.ajax({
        type: "DELETE",
        url: "http://10.10.1.1:3000/person/" + person.id,
        success: function() {
            alert("Person with ID = " + person.id + " was deleted!");
            removePerson(person);
        }
    });
}

function updatePerson(person) {
    $.ajax({
        type: "PUT",
        url: "http://10.10.1.1:3000/person/" + person.id,
        data: person,
        success: function() {
            alert("Person with ID = " + person.id + " was updated!");
        }
    });
}

function toggleEditMode() {
    
}