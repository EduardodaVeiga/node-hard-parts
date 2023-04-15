const http = require('http');
const fs = require('fs');


function doOnRequest(request, response){
  // Send back a message saying "Welcome to Twitter"
  // code here...
  console.log('trigger')
  if(request.method === 'GET' && request.url === '/style.css'){
    fs.createReadStream('./style.css').pipe(response)
  }
  else if (request.method === 'GET' && request.url === '/') {
    fs.createReadStream('./index.html').pipe(response)
  }
  else if (request.method === 'POST' && request.url === '/sayHi') {
    fs.appendFile('./hi-log.txt','Manu clicou \n', function(err){
      if (err) throw err;
      response.end('Added to logFile');
    }) 
  }
  else if (request.method === 'POST' && request.url === '/greeting') {
    // accumulate the request body in a series of chunks
    let body = ''
    request.on('data', chunk => {
      body += chunk.toString();
    })
    request.on('end',()=>{
      if(body=='hello'){
        response.end('hey there!')
      }else{
        response.end('I`m fine, what about you?')
      }
    })
    
  }
  else if (request.method === 'PUT' && request.url === '/updateBack') {
    let body = ''
    request.on('data', chunk => {
      body += chunk.toString();
    })
    request.on('end',()=>{
      fs.writeFile('./hi-log.txt','updated message',(err)=>{
        if(err) console.log(`File not saved ---> error: ${err}`)
      })
      response.end('Updated!')
    })
  }
  else if (request.method === 'DELETE' && request.url === '/deleteBack') {
    fs.unlink('./body.txt', (err)=>{
      if(err) console.log(`File not deleted ---> error: ${err}`);
    })
    response.end('Deleted!')
  }
  else {
    // Handle 404 error: page not found
    // code here...
    response.statusCode = 404;
    response.end('404 Not Found');
    
  }
  console.log(request.url)
}

const server = http.createServer(doOnRequest)

server.listen(3000);
