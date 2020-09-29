const fs = require('fs');
// specify the path to the file, and create a buffer with characters we want to write

function saveAsFile(this) {
    let path = 'log.txt';
    let buffer = this.text();
    
    // open the file in writing mode, adding a callback function where we do the actual writing
    fs.open(path, 'w', function(err, fd) {
        if (err) {
            throw 'could not open file: ' + err;
        }
    
        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
        fs.write(fd, buffer, 0, buffer.length, null, function(err) {
            if (err) throw 'error writing file: ' + err;
            fs.close(fd, function() {
                console.log('wrote the file successfully');
            });
        });
    });

}