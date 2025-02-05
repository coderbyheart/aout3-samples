const moment = require('moment');

const daysFrom = (from, to) => moment(from).diff(to, 'days');

const findRebootedPerInterval = (getMachines, onFound,  maxDays, getDate) => {
  setInterval(() => {
    const rebootsFound = findRecentlyRebooted(getMachines(), maxDays, getDate);

    if (rebootsFound.length > 0) {
      onFound(rebootsFound);
    }
  },1000);
};

const findRecentlyRebooted = (machines, maxDays, fromDateCallback ) =>
  machines.filter(machine =>
    daysFrom(fromDateCallback(), machine.lastBootTime) < maxDays);

module.exports = {
  findRecentlyRebooted,
  findRebootedPerInterval
};
