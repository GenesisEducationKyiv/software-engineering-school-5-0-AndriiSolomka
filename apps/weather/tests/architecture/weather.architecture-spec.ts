import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Weather Module Layered Architecture Compliance', () => {
  it('core does not depend on infrastructure, interfaces', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/weather/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/weather/infrastructure')
      .inFolder('apps/weather_api/src/infrastructure/weather/interfaces');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interfaces', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/weather/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/weather/interfaces');

    return expect(rule).toPassAsync();
  });

  it('interfaces depend only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/weather/interfaces')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/weather/types');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/weather/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/weather/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfacesCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/weather/interfaces')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfacesCycleFree).toPassAsync();
  });
});
