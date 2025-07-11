import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Notification Module Architecture Compliance', () => {
  it('core does not depend on infrastructure, interface, or tests', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/notification/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder(
        'apps/weather_api/src/infrastructure/notification/infrastructure',
      )
      .inFolder('apps/weather_api/src/infrastructure/notification/interface')
      .inFolder('apps/weather_api/src/infrastructure/notification/tests');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interface or tests', () => {
    const rule = filesOfProject()
      .inFolder(
        'apps/weather_api/src/infrastructure/notification/infrastructure',
      )
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/notification/interface')
      .inFolder('apps/weather_api/src/infrastructure/notification/tests');

    return expect(rule).toPassAsync();
  });

  it('interface depends only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/notification/interface')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/notification/tests');

    return expect(rule).toPassAsync();
  });

  it('tests do not depend on other layers', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/notification/tests')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/notification/core')
      .inFolder(
        'apps/weather_api/src/infrastructure/notification/infrastructure',
      )
      .inFolder('apps/weather_api/src/infrastructure/notification/interface');

    return expect(rule).toPassAsync();
  });
  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/notification/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder(
        'apps/weather_api/src/infrastructure/notification/infrastructure',
      )
      .should()
      .beFreeOfCycles();
    const interfaceCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/notification/interface')
      .should()
      .beFreeOfCycles();
    const testsCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/notification/tests')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfaceCycleFree).toPassAsync();
    expect(testsCycleFree).toPassAsync();
  });
});
