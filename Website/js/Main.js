
function registerUser(){
    let username = document.querySelector("#field-4").value;
    let inputEmail = document.querySelector('#field-3').value;
    let password = document.querySelector("#field-1").value;

    let login = {
        username:username,
        password:password,
        email:inputEmail
    };


    let formData = JSON.stringify(login);

    let myRequest = new XMLHttpRequest();

    myRequest.open('POST', 'https://loginservice.lucaswinther.info/login/register',true);
    myRequest.responseType = 'json';
    myRequest.setRequestHeader("Content-Type", "application/json");

    myRequest.onload = () => {
        console.log(myRequest.response);
        if (myRequest.status == 200){
            document.querySelector('#w-form-done-register').style = "display:block" ;
            document.querySelector('#w-form-fail-register').style = "display:none";
        }
        else{
            document.querySelector('#w-form-done-register').style = "display:none";
            document.querySelector('#w-form-fail-register').style = "display:block";
        }
    };

    myRequest.send(formData);

}

function loginUser(){
    let username = document.querySelector('#login-0').value;
    let password = document.querySelector("#login-1").value;

    let login = {
        username:username,
        password:password,
    };


    let formData = JSON.stringify(login);

    let myRequest = new XMLHttpRequest();

    myRequest.open('POST', 'https://loginservice.lucaswinther.info/login/login',true);
    myRequest.responseType = 'json';
    myRequest.setRequestHeader("Content-Type", "application/json");

    myRequest.onload = () => {
        console.log(myRequest.response);
        if (myRequest.status == 200){
            document.querySelector('#w-form-done-login').style = "display:block";
            document.querySelector('#w-form-fail-login').style = "display:none";
        }
        else{
            document.querySelector('#w-form-done-login').style = "display:none";
            document.querySelector('#w-form-fail-login').style = "display:block";
        }
    };

    myRequest.send(formData);

}

function getCourseName(){

    let courseName = document.querySelector('#courseName').value;
    let currentCourse = {
        courseName:courseName
    };


    currentCourse = JSON.stringify(currentCourse);

    createCookie("currentCourse", currentCourse, 7);

    document.querySelector("#type").click();

}
function getCourseType(){

    // Get the type from the selector
    let courseType = document.querySelector('#courseType');
    courseType = courseType.options[courseType.selectedIndex].text;

    // Load the current course information
    let currentCourseObject = JSON.parse(getCookie("currentCourse"));

    // Set the courseType of the course to the gotten value
    currentCourseObject.courseType = courseType;
    currentCourseObject = JSON.stringify(currentCourseObject);

    // Save the new cookie
    createCookie("currentCourse", currentCourseObject, 7);

    document.querySelector("#description").click();

}
function getCourseDescription(){
    // Get the description from the selector
    let courseDescription = document.querySelector('#CourseDescription').value;

    // Load the current course information
    let currentCourseObject = JSON.parse(getCookie("currentCourse"));

    // Set the courseType of the course to the gotten value
    currentCourseObject.courseDescription = courseDescription;
    currentCourseObject = JSON.stringify(currentCourseObject);

    // Save the new cookie
    createCookie("currentCourse", currentCourseObject, 7);

    document.querySelector("#create").click();
    getCourseInfo();
}

function getCourseInfo(){

    // Get the cookie as a javascript object
    let currentCourseObject = getCookie("currentCourse");
    currentCourseObject = JSON.parse(currentCourseObject);


    // set the fields to show the user the correct values

    let courseNameHTML = document.querySelector('#courseNameShow');
    let courseTypeHTML = document.querySelector('#courseTypeShow');
    let courseDescriptionHTML = document.querySelector('#courseDescriptionShow');

    courseNameHTML.innerHTML = currentCourseObject.courseName || "Intet navn sat. Du skal sætte et navn før du må oprette dit kursus.";
    courseTypeHTML.innerHTML = currentCourseObject.courseType || "Du har ikke sat en type til dit kursus. Venligst sæt en type før du går videre";
    courseDescriptionHTML.innerHTML = currentCourseObject.courseDescription|| "Dit kursus skal have en beskrivelse før du må gp videre";

}


var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
