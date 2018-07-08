import 'babel-polyfill'

// make sure rollup-plugin-node-globals to populate Buffer
window.Buffer = Buffer

const getImageDataURL = (image, width, height) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/png')
}

const convertSvg = (params) => new Promise(async (res, rej) => {
  try {
    const image = new Image()
    image.onload = () => res(getImageDataURL(image, params.width, params.height))
    image.src = `data:image/svg+xml,${encodeURIComponent(params.svgString)}`
  } catch (e) {
    rej(e)
  }
})

export default convertSvg
