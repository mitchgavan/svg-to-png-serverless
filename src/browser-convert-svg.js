window.Buffer = Buffer; // make sure rollup-plugin-node-globals to populate Buffer

const getImageDataURL = (image) => {
  const { width, height } = image
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  context.drawImage(image, 0, 0, width, height)
  return scale(canvas.toDataURL(`image/png`), 0.5)
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
