/**
 * Created by Nikko on 2016-01-10.
 */


function doesUserExist(users, username){
    return users.some(function(curr){
        return curr.name == username;
    })
}

function createUserObj(username, password, id){
    return {
        name: username,
        password: password.hashCode(),
        id:id
    };
}

function showAlert(alertId){
    $(alertId).show(500);
}

//Insecure hash used on password
//Marginally better than plaintext
String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};


$(document).ready(function(){

    $(".alert").hide();
    $("#loginBlock").hide();
    $("#createUserBlock").hide();

    $(".hide-alert").click(function(e){
        console.log(e);
        $(e.target.parentElement).hide(500);
    });

    $("#loginBtn").click(function(){
        $("#loginBlock").toggle(500);
        $("#createUserBlock").hide(500);
    });

    $("#createUserBtn").click(function(){
        $("#loginBlock").hide(500);
        $("#createUserBlock").toggle(500);
    });

    $("#loginForm").submit(function(e){
        e.preventDefault();

        var username = $("#loginName").val();
        var password = $("#loginPassword").val();

        if(username != "" && password != "") {
            var users = JSON.parse(localStorage.getItem("users"));
            if(!users){
                showAlert("#userAlert");
            }else{
                var result = $.grep(users, function(e){
                    return e.name == username;
                });
                if(result.length == 0){
                    showAlert("#userAlert");
                }else if(result.length == 1){
                    if(result[0].password == password.hashCode()){
                        console.log("login successful");
                        localStorage.setItem("currentUserId", result[0].id);
                        window.location.href = "main.html";
                        //return false;
                    }else{
                        showAlert("#passwordAlert");
                    }
                }
            }
        }else{
            showAlert("#invalidAlert");
        }
    });

    $("#createUserForm").submit(function(e){
        e.preventDefault();

        var username = $("#createUserName").val();
        var password = $("#createUserPassword").val();

        if(username != "" && password != ""){
            var users = JSON.parse(localStorage.getItem("users"));
            if(!users){
                users = [createUserObj(username, password, 0)];
            }else{
                if(doesUserExist(users, username)){
                    showAlert("#usernameAlert");
                }else{
                    users.push(createUserObj(username, password, users.length));
                }
            }
            console.log(users);
            localStorage.setItem("users", JSON.stringify(users));
        }else{
            showAlert("#invalidAlert");
        }
    })
});