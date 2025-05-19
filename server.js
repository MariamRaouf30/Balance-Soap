const soap = require('soap');
const http = require('http');
const fs = require('fs');

const service = {
  BankingService: {
    BankingPort: {
      GetBalance: function(args) {
        console.log('GetBalance called with args:', args);
        // Return fixed mock balance response
        return {
          Balance: 1234.56,
          Currency: 'USD'
        };
      }
    }
  }
};

// Load your WSDL file (make sure you have this in your folder)
const wsdl = fs.readFileSync('BankingService.wsdl', 'utf8');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 404;
  res.end('Not Found: ' + req.url);
});

// Listen on port 8080
server.listen(8080,'0.0.0.0', () => {
  console.log('SOAP mock server listening on port 8080');
});

// Create SOAP server on /BankingService path
const soapServer = soap.listen(server, '/BankingService', service, wsdl);

// OVERRIDE findOperation to ALWAYS return GetBalance, ignoring SOAPAction header
soapServer.findOperation = function(soapAction, body) {
  return soapServer.wsdl.definitions.services.BankingService.ports.BankingPort.binding.operations.GetBalance;
};
