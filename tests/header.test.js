const Page = require('./helpers/page');

let page;
beforeEach(async () => {
  page = await Page.build(); //create new browser window for us
  await page.goto('http://localhost:3000');
});
afterEach(async () => {
  await page.close();
});

test('the header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, shows logout button', async () => {
  await page.login('http://localhost:3000');
  const text = await page.getContentsOf('a[href="/auth/logout"');
  expect(text).toEqual('Logout');
});

//TeraBox 1024GB бесплатного хранилища
