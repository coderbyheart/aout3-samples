// requiring the data injection helper from fake module
const { fakeDataFromModule } = require('../../my-data-module');

jest.mock('../../my-data-module', () => ({
  // injecting a stub helper function:
  fakeDataFromModule: data => {
    this.data = data;
  },

  getAllMachines: () => {
    return this.data;
  }
}));

describe('findRecentlyRebooted', () => {
  beforeEach(jest.resetModules);

  test('given no machines, returns empty results', () => {
    const someDate = new Date('01 01 2000');
    fakeDataFromModule([]);

    const { findRecentlyRebooted } = require('../../machine-scanner4');
    const result = findRecentlyRebooted(0, someDate);

    expect(result.length).toBe(0);
  });

  test('given one machine over the threshold, it is ignored', () => {
    const fromDate = new Date('01 03 2000');
    const rebootTwoDaysEarly = new Date('01 01 2000');
    const machines = [
      { lastBootTime: rebootTwoDaysEarly, name: 'machine1' }
      ];
    fakeDataFromModule(machines);

    const { findRecentlyRebooted } = require('../../machine-scanner4');
    const result = findRecentlyRebooted(1, fromDate);

    expect(result.length).toBe(0);
  });

  test('given one of two machines under the threshold, it is found', () => {
    const fromDate = new Date('01 03 2000');
    const rebootTwoDaysEarly = new Date('01 01 2000');
    fakeDataFromModule([
      { lastBootTime: rebootTwoDaysEarly, name: 'ignored' },
      { lastBootTime: fromDate, name: 'found' }
    ]);
    const { findRecentlyRebooted } = require('../../machine-scanner4');
    const result = findRecentlyRebooted(1, fromDate);

    expect(result.length).toBe(1);
    expect(result[0].name).toContain('found');
  });

  test('given 1 machine less than threshold, returns its name and boot time', () => {
    const fromDate = new Date('01 01 2000');
    const machines = [{ lastBootTime: fromDate, name: 'any-name' }];
    fakeDataFromModule(machines);

    const { findRecentlyRebooted } = require('../../machine-scanner4');
    const result = findRecentlyRebooted(1, fromDate);

    expect(result.length).toBe(1);
  });
});
