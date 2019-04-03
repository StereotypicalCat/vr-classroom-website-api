
function registerUser(){
    let username = document.querySelector("#field-4").value;
    let password = document.querySelector("#field-1").value;

    console.log("username: " + username);
    console.log("password: " + password);

    let login = {
        username:username,
        password:password
    };


    let formData = JSON.stringify(login);


    let myRequest = new XMLHttpRequest();

    myRequest.open('POST', 'https://loginservice.lucaswinther.info/login/login',true);
    myRequest.responseType = 'json';
    myRequest.setRequestHeader("Content-Type", "application/json");

    myRequest.onload = () => {
        console.log(myRequest.response);
        if (myRequest.status == 200){
            let myStuff = JSON.parse(myRequest.response);
            console.log(myStuff);
        }
    };

    myRequest.send(formData);

}



/*
$.ajax({
    type: "POST",
    url: "84.238.80.9:3000/login/login",
    data: formData,
    success: function(){},
    dataType: "json",
    contentType : "application/json"
});*/
