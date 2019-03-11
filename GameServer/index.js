// Creates a UDP server, using the dgram library from node.
let udp = require('dgram');
let server = udp.createSocket('udp4');
let serverPort = 22222;

import Player from "./Player";

var players = [];

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

// This event fires when a new message is received from a client.
server.on('message',function(msg,info){
    // msg -> the message in bytes
    // info -> information about the sender.
    let stringReceivedFromClient = msg.toString();
    console.log('Data received from client : ' + stringReceivedFromClient); // Converts the message to string and logs the message
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port); // Logs information about a sender.

    /*
    * ==============================================
    *  This is where the main data handling happens
    * ==============================================
    * */

    let returnData = "Command not found";

    // If the client requests to login on a server.
    if(stringReceivedFromClient === "logon"){

        // Temporary code, this should login using the api, and get the players ID. This just assigns a random unique ID.
        let newID= 0;
        let con = true;
        let breakout;
        while(con){
            breakout = true;
            console.log("round");
            players.forEach(element => {
                if(newID === element.ID){
                    newID++;
                    breakout = false;
                    console.log("false:" + newID.toString() + " | " + element.ID);
                }
            });
            if(breakout === true){
                con = false;
            }
        }
        //////////////////////


        returnData = newID.toString();
        players.push(new Player(newID));
    }

    // If the client requests to download new information
    if(stringReceivedFromClient.substring(0,12) === "downloadinfo"){

        // Add all people that are on the server to the string.
        returnData += "Per";
        players.forEach(player => {
            returnData += `|${player.ID.toString()},x:${player.X.toString()},y:${player.Y.toString()},name:${player.Name},rot:${player.rot.toString()},headx:${player.HeadX.toString()},heady:${player.HeadY.toString()},headz:${player.HeadZ.toString()},headw:${player.HeadW.toString()}`;
            // Old: data += "|" + element.ID.toString() + ",x:" + element.X.toString() + ",y:" + element.Y.toString() + ",name:" + element.Name + ",rot:" + element.rot.toString() + ",headx:" + element.HeadX.toString() + ",heady:" + element.HeadY.toString() + ",headz:" + element.HeadZ.toString()+ ",headw:" + element.HeadW.toString();
        });

        // Add all objects on the server to the string.
        returnData += "#Obj";

        // Log the data we write back
        console.log(data);
    }


    // If the client requests to upload new information about themselves.
    if(stringReceivedFromClient.substring(0,10) === "uploadinfo"){
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
                            players[id].X = parseFloat(value);
                            console.log("x:pos" + players[id].X);
                            break;
                        case "y":
                            players[id].Y = parseFloat(value);
                            console.log("x:pos" + players[id].Y);
                            break;
                        case "rot":
                            players[id].rot = parseFloat(value);
                            console.log("rot:" + players[id].Y);
                            break;
                        case "headx":
                            players[id].HeadX = parseFloat(value);
                            console.log("headx:" + players[id].HeadX);
                            break;
                        case "heady":
                            players[id].HeadY = parseFloat(value);
                            console.log("heady:" + players[id].HeadY);
                            break;
                        case "headz":
                            players[id].HeadZ = parseFloat(value);
                            console.log("headz:" + players[id].HeadZ);
                            break;
                        case "headw":
                            players[id].HeadW = parseFloat(value);
                            console.log("headw:" + players[id].HeadW);
                            break;
                    }
                }
            }

        });
        returnData = "ok";
    }

    // Sends the data the client requested.
    server.send(returnData,info.port,info.address,function(error){
        if(error){
            server.close();
        }else{
            console.log('Data sent !!!');
        }

    });

});

// Emits when any error occurs in the server
server.on('error',function(error){
    console.log('Error: ' + error);
    server.close();
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
    console.log('Socket is closed !');
});


server.bind(serverPort);

/*setTimeout(function(){
    server.close();
},8000);*/



