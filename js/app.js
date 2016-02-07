/**
 * Created by Nikko on 2016-01-10.
 */

function isValidActivity(name, date, start, end){
    if(name.val() == "" || date.val() == "" || start.val() == ""  || end.val() == ""){
        return false;
    }
    return !(start[0].valueAsNumber + 900000 > end[0].valueAsNumber);
}

function createActivity(name, date, start, end, notes){
    var actName = name.val();

    var startDate = date[0].valueAsDate;
    startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset()*60000);

    var endDate = new Date();
    endDate.setTime(startDate.getTime() + end[0].valueAsNumber);
    startDate.setTime(startDate.getTime() + start[0].valueAsNumber);

    var actNotes = notes.val();

    return {
        name: actName,
        start: startDate,
        end: endDate,
        notes: actNotes
    };
}

function buildActivityCard(activity){
    var cardTitle = $("<h3></h3>")
        .addClass("card-title")
        .append(activity.name);


    var start = new Date(activity.start);
    var end = new Date(activity.end);

    var startString = start.getHours()%12;
    console.log(startString);
    if(startString == "0"){
        startString = "12";
    }

    if(start.getMinutes() < 10){
        startString += ":0";
    }else{
        startString += ":";
    }

    startString += start.getMinutes();
    if(start.getHours() >= 12){
        startString += " PM";
    }else{
        startString += "AM";
    }

    var endString = end.getHours()%12;
    if(endString == "0"){
        endString = "12";
    }

    if(end.getMinutes() < 10){
        endString += ":0";
    }else{
        endString += ":";
    }

    endString += end.getMinutes();
    if(end.getHours() >= 12){
        endString += " PM";
    }else{
        endString += "AM";
    }

    var cardTime = $("<p></p>")
        .addClass("card-text")
        .append(startString + " - " + endString);

    var cardDesc = $("<p></p>")
        .addClass("card-text")
        .append(activity.notes);

    var cardBlock = $("<div></div>")
        .addClass("card-block")
        .append(cardTitle)
        .append(cardTime)
        .append(cardDesc);

    return $("<div></div>")
        .addClass("card")
        .append(cardBlock);
}

$(document).ready(function() {

    var userId = localStorage.getItem("currentUserId");
    var index = "activities[" + userId + "]";

    if(!userId){
        window.location.replace("index.html");
        return false;
    }

    $("#newActivityContainer").hide();

    $("#addActivityBtn").click(function(){
        $("#newActivityContainer").toggle(500);
    });

    $("#dateSelectForm").submit(function(e){
        e.preventDefault();

        var date = $("#dateSelect");
        if(date.val() == ""){
            return;
        }

        $("#resultCards").empty();

        var userActivities = JSON.parse(localStorage.getItem(index));
        if(!userActivities){
            return;
        }

        var dateToSearch = date[0].valueAsDate;
        dateToSearch.setTime(dateToSearch.getTime() + dateToSearch.getTimezoneOffset()*60000);

        var found = $.grep(userActivities, function(curr){
            var date = new Date(curr.start);
            var diff = date.getTime() - dateToSearch.getTime();
            if(diff >= 0 && diff < 86400000){
                return true;
            }
        });

        console.log(found);

        found.forEach(function(activity){
            $("#resultCards").append(buildActivityCard(activity));
        })

    });

    $("#newActivityForm").submit(function(e){
        e.preventDefault();

        var name = $("#activityType");
        var date = $("#activityDate");
        var start = $("#startTime");
        var end = $("#endTime");
        var notes = $("#activityNotes");

        if(isValidActivity(name, date, start, end)){
            var activity = createActivity(name, date, start, end, notes);

            var userActivities = JSON.parse(localStorage.getItem(index));

            if(!userActivities){
                userActivities = [activity];
            }else{
                userActivities.push(activity);
            }
            localStorage.setItem(index, JSON.stringify(userActivities));
        }else{
            console.log("not valid")
        }
    })
});