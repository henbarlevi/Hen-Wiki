import { RxjsSbsPage } from './app.po';

describe('rxjs-sbs App', () => {
  let page: RxjsSbsPage;

  beforeEach(() => {
    page = new RxjsSbsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
