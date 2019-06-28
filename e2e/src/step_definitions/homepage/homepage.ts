import * as chai from 'chai';
import * as cap from 'chai-as-promised';
import { defineSupportCode } from 'cucumber';
import { browser, by, element, ExpectedConditions } from 'protractor';
chai.use(cap);
const expect = chai.expect;

defineSupportCode(async ({ Before, Given, Then }) => {
  Before({ timeout: 30000 }, async () => {
    browser.ignoreSynchronization = true;
    await browser.waitForAngular();

    await browser.get(browser.baseUrl);
  });

  Given(
    /^he is on "([^"]*)"$/,
    async (url: string): Promise<void> => {
      await browser.wait(ExpectedConditions.urlIs(`${browser.baseUrl}${url}`), 5000);

      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).to.equal(`${browser.baseUrl}${url}`);
    }
  );

  Then(
    /^he get title "([^"]*)"$/,
    async (title: string): Promise<void> => {
      const currentTitle = await browser.getTitle();
      expect(currentTitle).to.equal(title);
    }
  );
});
