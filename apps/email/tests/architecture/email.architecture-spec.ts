import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Email Module Layered Architecture Compliance', () => {
  it('core does not depend on infrastructure, interface, or config', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/email/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/email/infrastructure')
      .inFolder('apps/weather_api/src/infrastructure/email/interface')
      .inFolder('apps/weather_api/src/infrastructure/email/config');

    return expect(rule).toPassAsync();
  });

  it('infrastructure does not depend on interface', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/email/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/email/interface');

    return expect(rule).toPassAsync();
  });

  it('interface depends only on core and infrastructure', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/email/interface')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather_api/src/infrastructure/email/config');

    return expect(rule).toPassAsync();
  });

  it('all layers are free of cycles', () => {
    const coreCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/email/core')
      .should()
      .beFreeOfCycles();
    const infrastructureCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/email/infrastructure')
      .should()
      .beFreeOfCycles();
    const interfaceCycleFree = filesOfProject()
      .inFolder('apps/weather_api/src/infrastructure/email/interface')
      .should()
      .beFreeOfCycles();

    expect(coreCycleFree).toPassAsync();
    expect(infrastructureCycleFree).toPassAsync();
    expect(interfaceCycleFree).toPassAsync();
  });
});
