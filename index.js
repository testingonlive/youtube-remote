var app = require( 'express' )();
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );

app.get( '/', function( req, res ){
    res.sendFile( __dirname + '/video/index.html' ); 
});

app.get( '/remote', function( req, res ){
    res.sendFile( __dirname + '/remote/index.html' );
})

io.on( 'connection', function( socket ){
    
    socket.on( 'start', function(){
        socket.broadcast.emit( 'start' );
    })
    
    console.log( 'a user connected' );
    
    
});


http.listen( 3000, function(){
    console.log( 'listening on *:3000' );
})