import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Microservices independence architecture test', () => {
  it('weather does not depend on other microservices', () => {
    const rule = filesOfProject()
      .inFolder('apps/weather')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/subscription')
      .inFolder('apps/gateway')
      .inFolder('apps/notification')
      .inFolder('apps/email');
    return expect(rule).toPassAsync();
  });

  it('subscription does not depend on other microservices', () => {
    const rule = filesOfProject()
      .inFolder('apps/subscription')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather')
      .inFolder('apps/gateway')
      .inFolder('apps/notification')
      .inFolder('apps/email');
    return expect(rule).toPassAsync();
  });

  it('gateway does not depend on other microservices', () => {
    const rule = filesOfProject()
      .inFolder('apps/gateway')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather')
      .inFolder('apps/subscription')
      .inFolder('apps/notification')
      .inFolder('apps/email');
    return expect(rule).toPassAsync();
  });

  it('notification does not depend on other microservices', () => {
    const rule = filesOfProject()
      .inFolder('apps/notification')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather')
      .inFolder('apps/subscription')
      .inFolder('apps/gateway')
      .inFolder('apps/email');
    return expect(rule).toPassAsync();
  });

  it('email does not depend on other microservices', () => {
    const rule = filesOfProject()
      .inFolder('apps/email')
      .shouldNot()
      .dependOnFiles()
      .inFolder('apps/weather')
      .inFolder('apps/subscription')
      .inFolder('apps/gateway')
      .inFolder('apps/notification');
    return expect(rule).toPassAsync();
  });
});
