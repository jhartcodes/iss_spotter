
const request = require('request-promise-native');
const { parse } = require('request/lib/cookies');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json')
}

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip
  return request('https://freegeoip.app/json/' + ip)
};

const fetchISSFlyOverTimes = function(body) {
  const latitude = JSON.parse(body).latitude
  const longitude = JSON.parse(body).longitude
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`)
}

const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(data => {
    const response = JSON.parse(data);
    return response;
  })
}

module.exports = { nextISSTimesForMyLocation };