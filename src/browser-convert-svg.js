import './polyfill.min.js'
window.Buffer = Buffer; // make sure rollup-plugin-node-globals to populate Buffer

const getImageDataURL = (image) => {
  const { width, height } = image
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL(`image/png`)
};


const convertSvg = (svgString) => new Promise(async (res, rej) => {
  try {
    const image = new Image()
    image.onload = () => res(getImageDataURL(image))
    image.src = `data:image/svg+xml,${encodeURIComponent(svgString)}`
  } catch (e) {
    rej(e)
  }
});

export default convertSvg
