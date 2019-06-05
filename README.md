# skycatch-challenge

This project is designed to run as a Lambda function, taking an image file (JPEG) from S3 and returning its metadata as a CSV.

#### CLI variant

In order to test the functionality locally, a CLI variant is included as `cli.js`.
`cli.js` is a _slightly_ modified version of the Lambda function that is designed to run in the CLI while keeping the function as close to the original as possible.

### Run the CLI variant

1. Run `npm install`
2. Run `node cli.js image.jpg` or `npm start image.jpg`

### Run in AWS

1. Run `npm install`
2. Zip the contents of folder, including `node_modules`
3. Upload the zip file as a Lambda function
