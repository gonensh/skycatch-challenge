const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

var ExifImage = require('exif').ExifImage;

function getCsvMetadataFromImage(image) {
  return new Promise((resolve, reject) => {
    new ExifImage({ image: image }, function(error, exifData) {
      if (error) throw new Error('Error: ' + error.message);
      const csvData = jsonToCsv(exifData);
      resolve(csvData);
    });
  });
}

function jsonToCsv(json) {
  //ToDo: Implement logic to convert EXIF/XMP data into a predetermined CSV structure
  // This example only converts the 'image' property contents
  let jsonImagePropertyContents = [];
  for (let prop in json.image) {
    jsonImagePropertyContents.push(`"${json.image[prop]}"`);
  }
  return jsonImagePropertyContents.join(',');
}

exports.handler = async (event, context) => {
  // Get the image object from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );
  const params = {
    Bucket: bucket,
    Key: key
  };

  // Retrieve the ContentType and Body of the file
  try {
    var { ContentType, Body } = await s3.getObject(params).promise();
  } catch (err) {
    // Display an error message if the retrieval from S3 was unsuccessful
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.error(message);
    throw err;
  }

  // Throw an error if the file is not a JPEG
  if (ContentType !== 'image/jpeg') {
    throw new Error(`The object (${params.Key}) is not a valid JPEG.`);
  }

  // Return the parsed metadata as CSV
  const metadataInCsv = await getCsvMetadataFromImage(Body);
  return metadataInCsv;
};
