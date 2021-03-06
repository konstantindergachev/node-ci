const Page = require('./helpers/page');

let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});
afterEach(async () => {
  await page.close();
});

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login('http://localhost:3000/blogs');
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitForSelector('.card');

      const title = await page.getContentsOf('.card-title');
      expect(title).toEqual('My Title');
      const content = await page.getContentsOf('p');
      expect(content).toEqual('My Content');
    });
  });

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      expect(titleError).toEqual('You must provide a value');

      const contentError = await page.getContentsOf('.content .red-text');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in', () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'Not auth title',
        content: 'Not auth content',
      },
    },
  ];

  test('blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);

    results.forEach((result) => {
      expect(result).toEqual({ error: 'You must log in!' });
    });
  });

  // test('user cannot create blog posts', async () => {
  //   const result = await page.post('/api/blogs');
  //   expect(result).toEqual({ error: 'You must log in!' });
  // });

  // test('user cannot get a list of posts', async () => {
  //   const data = { title: 'Not auth title', content: 'Not auth content' };
  //   const result = await page.get('/api/blogs', data);
  //   expect(result).toEqual({ error: 'You must log in!' });
  // });
});
