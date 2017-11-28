var amqp = require('amqp');

var connection = amqp.createConnection({
    host: 'localhost'
}, {
    defaultExchangeName: "amq.topic"
});

// add this for better debuging 
connection.on('error', function (e) {
    console.log("Error from AMQP: ", e);
});

// Wait for connection to become established. 
connection.on('ready', function () {
    console.log('connection is ready to use.');
    doSubscribe(connection);
    sendData(connection);
});


function doSubscribe(_connection) {
    _connection.queue('my-queue', function (q) {
        q.bind('#');
        q.subscribe(function (message, headers, deliveryInfo, messageObject) {
            console.log("Receved message from Queue:->:"+deliveryInfo.queue+" and Topic:->:"+deliveryInfo.routingKey);
            console.log(message.data.toString());
        });
    });
}


function sendData(_connection) {
    connection.publish('test', 'hello AMQP');
    setTimeout(function(){
        sendData(_connection);
    }, 10000);
}
