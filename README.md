# Serverless SVG to PNG
A microservice to convert SVG to PNG image.

Built upon Starter Kit for running Headless-Chrome by [Puppeteer](https://github.com/GoogleChrome/puppeteer) on AWS Lambda.


## Install
Clone this repo then:
```
npm install
```

## Run on local

By executing `SLOWMO_MS=250 npm run local`, you can check the operation while actually viewing the chrome (non-headless, slowmo).

## Packaging & Deploy

Lambda's memory needs to be set to at least 384 MB, but the more memory, the better the performance of any operations.

```
512MB -> goto(youtube): 6.481s
1536MB -> goto(youtube): 2.154s
```

### chrome in package (recommended)

If you use alone, run `npm run package`, and deploy the package.zip. 

If you use with Serverless, run `serverless deploy` (this runs `npm run package` when packaging).

### chrome NOT in package

Due to the large size of Chrome, it may exceed the [Lambda package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html) (50MB) depending on the other module to include. 
In that case, put Chrome in S3 and download it at container startup so startup time will be longer.

Run `npm run package-nochrome`, deploy the package.zip, and set following env valiables on Lambda.

- `CHROME_BUCKET`(required): S3 bucket where Chrome is put
- `CHROME_KEY`(optional): S3 key. default: `headless_shell.tar.gz`

## Usage
#### Convert an SVG to PNG
```
curl -X POST https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/convert-to-png --data '{
	"svgString": "<svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" viewBox=\"0 0 100 100\">\r\n  <path d=\"M30,1h40l29,29v40l-29,29h-40l-29-29v-40z\" stroke=\"#000\" fill=\"none\"\/> \r\n  <path d=\"M31,3h38l28,28v38l-28,28h-38l-28-28v-38z\" fill=\"#a23\"\/> \r\n<\/svg>",
	"width": "600",
	"height": "600"
}'
```
Example Result:
```
{
    "message": "[INFO] Successfully converted SVG to PNG",
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC..."
}
```