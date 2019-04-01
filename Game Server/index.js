// Creates a UDP server, using the dgram library from node.
let udp = require('dgram');
let server = udp.createSocket('udp4');
let serverPort = 22222;
const request = require('request');
const Player = require ("./Player");
const gameObject = require("./gameObject") ;

var players = [];
var objects = [];

// Event fires when the socket is ready and listening for datagram messages.
server.on('listening',function(){

    let address = server.address();

    let port = address.port;
    console.log('Server is listening at port: ' + port);

    let family = address.family;
    console.log('Server is IP4/IP6 : ' + family);

    let ipAddress = address.address;
    console.log('Server ip : ' + ipAddress);

});

const getUserId = (username, password) => {
    console.log("Getting User Id");
    return new Promise((resolve, reject) => {
        request.post(url = 'http://84.238.80.9:3000/login/login', {
            json: {
                "username": username,
                "password": password
            }

        }, (error, res, body) => {
            if (error) {
                console.error(error);
                return -1;
            }
            console.log(`statusCode: ${res.statusCode}`);


            if (body != null) {
                console.log(body);
                console.log(body.userID);
                resolve(body.userID);
            } else {
                reject(Error("It broke"));
            }
        });
    })
};


// This event fires when a new message is received from a client.
server.on('message',function(msg,info){
    // msg -> the message in bytes
    // info -> information about the sender.
    let stringReceivedFromClient = msg.toString();
 //   console.log('Data received from client : ' + stringReceivedFromClient); // Converts the message to string and logs the message
 //   console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port); // Logs information about a sender.

    /*
    * ==============================================
    *  This is where the main data handling happens
    * ==============================================
    * */

    let returnData = "Command not found";

    // If the client requests to login on a server.
    if(stringReceivedFromClient.substring(0,5) === "logon"){

        let username = stringReceivedFromClient.split('|')[1];
        let password = stringReceivedFromClient.split('|')[2];

        console.log(username);
        console.log(password);

        // Temporary code, this should login using the api, and get the players ID. This just assigns a random unique ID.
        getUserId(username,password).then((newID) => {
            console.log("new id: " + newID);
            players.push(new Player(newID));
            server.send(newID.toString(),info.port,info.address,function(error){
                if(error){
                    server.close();
                }else{
                }

            });
        });




    }

    if(stringReceivedFromClient.substring(0,6) === "logoff"){
        let id = stringReceivedFromClient.split('|')[1];
        players.forEach(pla =>{
            if(pla.id === id){
                players.splice(id,1);
            }
        });

        //sending ok back to client
        returnData = "ok";
    }

    // If the client requests to creat a new object
    if(stringReceivedFromClient.substring(0,8) === "newObjId"){
        returnData = "";

        // Temporary code, this should login using the api, and get the players ID. This just assigns a random unique ID.
        let newID= 0;
        let con = true;
        let breakout;
        while(con){
            breakout = true;
            objects.forEach(element => {
                if(newID === element.ID){
                    newID++;
                    breakout = false;
                }
            });
            if(breakout === true){
                con = false;
            }
        }

        //sending Id back to client
        returnData = newID.toString();

        //finds the right data for the new object
        let stringSplit = stringReceivedFromClient.split('|');
        let posx = stringSplit[2].split(':')[1];
        let posy = stringSplit[3].split(':')[1];
        let posz = stringSplit[4].split(':')[1];
        
        //Adder new object to objects
        objects.push(new gameObject(newID,stringSplit[1],posx,posy,posz));
    }

    // If the client requests to download new information
    if(stringReceivedFromClient.substring(0,12) === "downloadinfo"){
        returnData = "";

        // Add all people that are on the server to the string.
        returnData += "Per";
        players.forEach(player => {
            returnData += `|${player.ID.toString()},x:${player.X.toString()},y:${player.Y.toString()},name:${player.Name},rot:${player.rot.toString()},headx:${player.HeadX.toString()},heady:${player.HeadY.toString()},headz:${player.HeadZ.toString()},headw:${player.HeadW.toString()}`;
            // Old: data += "|" + element.ID.toString() + ",x:" + element.X.toString() + ",y:" + element.Y.toString() + ",name:" + element.Name + ",rot:" + element.rot.toString() + ",headx:" + element.HeadX.toString() + ",heady:" + element.HeadY.toString() + ",headz:" + element.HeadZ.toString()+ ",headw:" + element.HeadW.toString();
        });

        // Add all objects on the server to the string.
        returnData += "#Obj";

                        //value = value.replace(",", ".");
        objects.forEach(object => {
            returnData += `|${object.ID.toString()},x:${object.X.toString()},y:${object.Y.toString()},z:${object.Z.toString()},name:${object.Name},rot:${object.rot.toString()},f1:${object.f1.toString()},f2:${object.f2.toString()},i1:${object.i1.toString()},i2:${object.i2.toString()},s1:${object.s1},s2:${object.s2}`;
            // Old: data += "|" + element.ID.toString() + ",x:" + element.X.toString() + ",y:" + element.Y.toString() + ",name:" + element.Name + ",rot:" + element.rot.toString() + ",headx:" + element.HeadX.toString() + ",heady:" + element.HeadY.toString() + ",headz:" + element.HeadZ.toString()+ ",headw:" + element.HeadW.toString();
        });



        // Log the data we write back
        //console.log(data);
    }

    // If the client requests to upload new information about themselves.
    if(stringReceivedFromClient.substring(0,10) === "uploadinfo"){
        returnData = "";

        let data = stringReceivedFromClient.substring(11).split('|');

        let id = data[0];
        players.forEach(player => {
            // If this the player in our list is the player who sent the uploadinfo request.
            if(player.ID === parseInt(id)){

                for(let i = 1; i < data.length; i++){
                    let item = data[i].split(':');

                    // Each item is a key value pair
                    let [key, value] = item;

                    value = value.replace(",", ".");
                    switch (key) {

                        case "x":
                            player.X = parseFloat(value);
                            break;
                        case "y":
                            player.Y = parseFloat(value);
                            break;
                        case "rot":
                            player.rot = parseFloat(value);
                            break;
                        case "headx":
                            player.HeadX = parseFloat(value);
                            break;
                        case "heady":
                            player.HeadY = parseFloat(value);
                            break;
                        case "headz":
                            player.HeadZ = parseFloat(value);
                            break;
                        case "headw":
                            player.HeadW = parseFloat(value);
                            break;
                    }
                }
            }

        });
        let ObjectStrings = stringReceivedFromClient.split('#')[1].split('|');
        ObjectStrings.forEach(element => {
            let ObjectSplittet = element.split(',');

            objects.forEach(object => {
                let obj_id = parseInt(ObjectSplittet[0]);
                // If this the object in our list is the object who sent the uploadinfo request.
                if(object.ID === obj_id){

                    for(let i = 1; i < ObjectSplittet.length; i++){
                        let item = ObjectSplittet[i].split(':');

                        // Each item is a key value pair
                        let [key, value] = item;

//                        value = value.replace(",", ".");
                        switch (key) {

                            case "x":
                                objects[obj_id].X = parseFloat(value);
                                break;
                            case "y":
                                objects[obj_id].Y = parseFloat(value);
                                break;
                            case "z":
                                objects[obj_id].Z = parseFloat(value);
                                break;
                            case "rot":
                                objects[obj_id].rot = parseFloat(value);
                                break;
                            case "f1":
                                objects[obj_id].f1 = parseFloat(value);
                                break;
                            case "f2":
                                objects[obj_id].f2 = parseFloat(value);
                                break;
                            case "s1":
                                objects[obj_id].s1 = value;
                                break;
                            case "s2":
                                objects[obj_id].s2 = value;
                                break;
                            case "i1":
                                objects[obj_id].i1 = parseInt(value);
                                break;
                            case "i2":
                                objects[obj_id].i2 = parseInt(value);
                                break;
                        }
                    }
                }
            });
        });


        returnData = "ok";
    }

    if (stringReceivedFromClient.substring(0,5) !== "logon"){
        // Sends the data the client requested.
        server.send(returnData,info.port,info.address,function(error){
            if(error){
                server.close();
            }else{
            }

        });
    }

});

// Emits when any error occurs in the server
server.on('error',function(error){
    console.log('Error: ' + error);
    server.close();
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
   // console.log('Socket is closed !');
});


server.bind(serverPort);

/*setTimeout(function(){
    server.close();
},8000);*/



