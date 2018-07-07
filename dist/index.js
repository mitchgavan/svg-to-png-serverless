const setup = require('./starter-kit/setup');

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  exports.run(browser).then(result => callback(null, result)).catch(err => callback(err));
};

exports.run = async (browser, svgString) => {

  const getPage = async () => {
    const page = await browser.newPage();
    await page.goto('about:blank');
    await page.addScriptTag({ path: require.resolve('./browser-convert-svg.umd.js') });
    return page;
  };

  const page = await getPage();

  const convertSvg = async svgString => {
    const dataUrl = await page.evaluate(async svgString => {
      return await window.SvgToPng(svgString);
    }, svgString);

    return Buffer.from(dataUrl.split(',')[1], 'base64');
  };

  let buffer;
  try {
    buffer = await convertSvg(svgString);
  } finally {
    await page.close();
  }
  return buffer;
};