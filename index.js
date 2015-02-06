var app = require( 'express' )();
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );
var randWord = require( 'random-word-by-length' );

app.get( '/', function( req, res ){
    res.sendFile( __dirname + '/video/index.html' ); 
});

app.get( '/remote', function( req, res ){
    res.sendFile( __dirname + '/remote/index.html' );
})


var assignRoom = (function(){
     var _rooms = [];
    
    return function _assignRoom(){
        var room = randWord( 4 );
        
        if( !~_rooms.indexOf( room ) ) {
            _rooms.push( room );
            return room;
        } else {
            return _assignRoom();
        }        
    }
    
    
}())


// @TODO make ASYNC
var rooms = (function(){
    var _rooms = [];
    
    return {
        
        assignRoom: function _assignRoom(){
            var room = randWord( 4 );
        
            if( !~_rooms.indexOf( room ) ) {
                _rooms.push( room );
                return room;
            } else {
                return _assignRoom();
                       
            }              
            
        },
        
        unassignRoom: function( room ){
            var _index = _rooms.indexOf( room );
            
            if ( ~_index ) return _rooms.splice( _index, 1 );
            
        }
        
        
    }
    
    
    
}());




io.on( 'connection', function( socket ){
    
    var _room;
    
    socket.on( 'joinRoom', function( room ){
       socket.join( room );
        
        _room = room;
    });
    
    socket.on( 'requestRoom', function( callback ){
        _room = assignRoom();
               
        socket.join( _room )
        
        callback( _room );
    });
    
    
    socket.on( 'disconnect', function(){
        // remove room
    });
    
    
    socket.on( 'start', function(){
        socket.to( _room ).broadcast.emit( 'start' );
    });
    
    
    console.log( 'a user connected' );
    
    
});


http.listen( 3000, function(){
    console.log( 'listening on *:3000' );
})