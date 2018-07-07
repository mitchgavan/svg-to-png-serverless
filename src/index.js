require('./polyfill.min.js')
const setup = require('./starter-kit/setup')

exports.handler = async (event, context, callback) => {

  const params = JSON.parse(event.body)

  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false
  const browser = await setup.getBrowser()

  exports.run(browser, params.svgString).then(
    (result) => {
      const response = {
          statusCode: 200,
          headers: {
              "Access-Control-Allow-Credentials": true,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              message: '[INFO] Successfully converted SVG to PNG',
              buffer: result
          })
      }
      return callback(null, response)
    }
  ).catch(
    (err) => {
      const response = {
          statusCode: 400,
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
              message: '[ERROR] ' + err
          })
      }
      return callback(null, response)
    }
  )
}

exports.run = async (browser, svgString) => {

  const getPage = async () => {
    const page = await browser.newPage()
    await page.goto('about:blank')
    await page.addScriptTag({ path: require.resolve('./browser-convert-svg.umd.js') })
    return page
  }

  const page = await getPage()

  const convertSvg = async (svgString) => {
    const dataUrl = await page.evaluate((svgString) => {
      // babel compile error if async function used here, therefore using regular function.
      return window.SvgToPng(svgString).then(val => val)
    }, svgString)

    return Buffer.from(dataUrl.split(',')[1], 'base64')
  }

  let buffer
  try {
    buffer = await convertSvg(svgString)
  } finally {
    await page.close()
  }

  return buffer
}
