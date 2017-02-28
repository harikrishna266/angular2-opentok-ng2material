import { OpentokPage } from './app.po';

describe('opentok App', () => {
  let page: OpentokPage;

  beforeEach(() => {
    page = new OpentokPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
