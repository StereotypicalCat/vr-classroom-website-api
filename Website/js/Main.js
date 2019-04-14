function registerUser() {
    let username = document.querySelector("#field-4").value;
    let inputEmail = document.querySelector('#field-3').value;
    let password = document.querySelector("#field-1").value;

    let login = {
        username: username,
        password: password,
        email: inputEmail
    };


    let formData = JSON.stringify(login);

    let myRequest = new XMLHttpRequest();

    myRequest.open('POST', 'https://loginservice.lucaswinther.info/login/register', true);
    myRequest.responseType = 'json';
    myRequest.setRequestHeader("Content-Type", "application/json");

    myRequest.onload = () => {
        console.log(myRequest.response);
        if (myRequest.status == 200) {
            document.querySelector('#w-form-done-register').style = "display:block";
            document.querySelector('#w-form-fail-register').style = "display:none";
        } else {
            document.querySelector('#w-form-done-register').style = "display:none";
            document.querySelector('#w-form-fail-register').style = "display:block";
        }
    };

    myRequest.send(formData);

}

function loginUser() {
    let username = document.querySelector('#login-0').value;
    let password = document.querySelector("#login-1").value;

    let login = {
        username: username,
        password: password,
    };


    let formData = JSON.stringify(login);

    let myRequest = new XMLHttpRequest();

    //myRequest.open('POST', 'https://loginservice.lucaswinther.info/login/login', true);
    myRequest.responseType = 'json';
    myRequest.setRequestHeader("Content-Type", "application/json");

    myRequest.onload = () => {
        console.log(myRequest.response);
        if (myRequest.status == 200) {
            document.querySelector('#w-form-done-login').style = "display:block";
            document.querySelector('#w-form-fail-login').style = "display:none";
        } else {
            document.querySelector('#w-form-done-login').style = "display:none";
            document.querySelector('#w-form-fail-login').style = "display:block";
        }
    };

    myRequest.send(formData);

}

function getLocalNewCourseName() {

    let courseName = document.querySelector('#courseName').value;
    let currentCourse = {
        courseName: courseName
    };


    currentCourse = JSON.stringify(currentCourse);

    createCookie("currentCourse", currentCourse, 7);

    document.querySelector("#type").click();

}

function getLocalNewCourseType() {

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

function getLocalNewCourseDescription() {
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
    getLocalNewCourseInfo();
}

function getLocalNewCourseInfo() {

    // Get the cookie as a javascript object
    let currentCourseObject = getCookie("currentCourse");
    currentCourseObject = JSON.parse(currentCourseObject);


    // set the fields to show the user the correct values

    let courseNameHTML = document.querySelector('#courseNameShow');
    let courseTypeHTML = document.querySelector('#courseTypeShow');
    let courseDescriptionHTML = document.querySelector('#courseDescriptionShow');

    courseNameHTML.innerHTML = currentCourseObject.courseName || "Intet navn sat. Du skal sætte et navn før du må oprette dit kursus.";
    courseTypeHTML.innerHTML = currentCourseObject.courseType || "Du har ikke sat en type til dit kursus. Venligst sæt en type før du går videre";
    courseDescriptionHTML.innerHTML = currentCourseObject.courseDescription || "Dit kursus skal have en beskrivelse før du må gp videre";

}

function newCourse(){
    let currentCourseObject = JSON.parse(getCookie("currentCourse"));

    currentCourseObject.courseTeachers = "Lucas Winther";

    console.log("testing to create a new course");
    console.log(currentCourseObject);

    if ((currentCourseObject.courseName != null) && (currentCourseObject.courseType != null) && (currentCourseObject.courseDescription != null) && (currentCourseObject.courseTeachers != null)){
        console.log("All the correct values are here");
        let newCourseInfo = {
            courseName: currentCourseObject.courseName,
            courseType: currentCourseObject.courseType,
            courseDescription: currentCourseObject.courseDescription,
            courseTeachers: currentCourseObject.courseTeachers
        };


        let formData = JSON.stringify(newCourseInfo);

        let myRequest = new XMLHttpRequest();

        myRequest.open('POST', 'https://courseservice.lucaswinther.info/Courses/new', true);
        myRequest.responseType = 'json';
        myRequest.setRequestHeader("Content-Type", "application/json");

        myRequest.onload = () => {
            console.log(myRequest.response);
            if (myRequest.status == 201) {
                document.querySelector('#w-form-done').style = "display:block";
                document.querySelector('#w-form-fail').style = "display:none";
            } else {
                document.querySelector('#w-form-done').style = "display:none";
                document.querySelector('#w-form-fail').style = "display:block";
            }
        };

        console.log("Sending the request");
        myRequest.send(formData);


    }

}



function getCourseByNameOrId() {
    let courseNameToGetHTML = document.querySelector('#name').value;

    let getCourseName = {
        courseNameToGet: courseNameToGetHTML,
    };

    getCourseName = JSON.stringify(getCourseName);
    if (true) {

        let myRequest = new XMLHttpRequest();

        myRequest.open('GET', 'https://courseservice.lucaswinther.info/courses/view' + '?' + `courseNameToGet=${courseNameToGetHTML}`, true);
        //myRequest.open('GET', 'http://127.0.0.1:3001/courses/view' + '?' + `courseNameToGet=${courseNameToGetHTML}`, true);
        myRequest.responseType = 'json';
        myRequest.setRequestHeader("Content-Type", "application/json");

        myRequest.onload = () => {
            console.log(myRequest.response);
            if (myRequest.status == 200) {
                document.querySelector('#w-form-done').style = "display:block";
                document.querySelector('#w-form-fail').style = "display:none";

                let child = document.querySelector('#courseDisplayDiv');
                child.parentNode.removeChild(child);

                // if there is only 1 object returned
                if(!(myRequest.response instanceof Array)){
                    let HTMLcourseTitle = document.createElement("H1");
                    HTMLcourseTitle.innerHTML = myRequest.response.courseName;

                    let HTMLcourseType = document.createElement('H2');
                    HTMLcourseType.innerHTML = `Kursus type: ${myRequest.response.courseType}`;

                    let HTMLcourseDescription = document.createElement('P');
                    HTMLcourseDescription.innerHTML = myRequest.response.courseDescription;

                    let HTMLcourseTeacher = document.createElement('P');
                    HTMLcourseTeacher.innerHTML = `Kurset bliver hold af ${myRequest.response.courseTeachers}`;

                    document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseTitle);
                    document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseType);
                    document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseDescription);
                    document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseTeacher);
                }
                // If there are more
                else {
                    myRequest.response.forEach((item) => {
                        let HTMLcourseTitle = document.createElement("H1");
                        HTMLcourseTitle.innerHTML = item.courseName;

                        let HTMLcourseType = document.createElement('H2');
                        HTMLcourseType.innerHTML = `Kursus type: ${item.courseType}`;

                        let HTMLcourseDescription = document.createElement('P');
                        HTMLcourseDescription.innerHTML = item.courseDescription;

                        let HTMLcourseTeacher = document.createElement('P');
                        HTMLcourseTeacher.innerHTML = `Kurset bliver hold af ${item.courseTeachers}`;

                        document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseTitle);
                        document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseType);
                        document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseDescription);
                        document.querySelector('#courseDisplayDiv').appendChild(HTMLcourseTeacher);


                    })




                }


            } else {
                document.querySelector('#w-form-done').style = "display:none";
                document.querySelector('#w-form-fail').style = "display:block";
            }
        };

        myRequest.send(getCourseName);

    }
}




var createCookie = function (name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};

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
