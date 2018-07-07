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
  console.log('convertSvg')
  let svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M30,1h40l29,29v40l-29,29h-40l-29-29v-40z" stroke="#000" fill="none"/> 
  <path d="M31,3h38l28,28v38l-28,28h-38l-28-28v-38z" fill="#a23"/> 
</svg>`
  try {
    const image = new Image()
    image.onload = () => res(getImageDataURL(image))
    image.src = `data:image/svg+xml,${encodeURIComponent(svgString)}`
  } catch (e) {
    rej(e)
  }
});

export default convertSvg
