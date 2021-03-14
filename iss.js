const request = require('request');


const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let data = JSON.parse(body);
    callback(error, data.ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request('https://freegeoip.app/json/' + ip, (error, response, body) => {
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    let { latitude, longitude } = JSON.parse(body);
    callback(error, { latitude, longitude });
  }
  );
};

const fetchISSFlyOverTimes = function(obj, callback) {
  // console.log(obj.latitude)
  request(`http://api.open-notify.org/iss-pass.json?lat=${obj.latitude}&lon=${obj.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let data = JSON.parse(body);
    callback(error, data.response);

  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });


};



module.exports = { fetchMyIP ,fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };