require('babel-polyfill')
const setup = require('./starter-kit/setup')

exports.handler = async (event, context, callback) => {

  const params = JSON.parse(event.body)

  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false
  const browser = await setup.getBrowser()

  exports.run(browser, params).then(
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

exports.run = async (browser, params) => {
  // fallback data for testing localally
  params = params || {
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M30,1h40l29,29v40l-29,29h-40l-29-29v-40z" stroke="#000" fill="none"/> 
    <path d="M31,3h38l28,28v38l-28,28h-38l-28-28v-38z" fill="#a23"/> 
    <text x="50" y="68" font-size="48" fill="#FFF" text-anchor="middle"><![CDATA[410]]></text>
  </svg>`,
    width: 1200,
    height: 1200
  }

  const getPage = async () => {
    const page = await browser.newPage()
    await page.goto('about:blank')
    await page.addScriptTag({ path: require.resolve('./browser-convert-svg.umd.js') })
    return page
  }

  const page = await getPage()

  const convertSvg = async (params) => {
    const dataUrl = await page.evaluate((params) => {
      // getting a babel compile error if this cb is an async function, therefore using regular function with promise
      return window.SvgToPng(params).then(val => val)
    }, params)

    // return Buffer.from(dataUrl.split(',')[1], 'base64')
    return dataUrl
  }

  let buffer
  try {
    buffer = await convertSvg(params)
  } finally {
    await page.close()
  }

  return buffer
}
