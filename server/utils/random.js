const AWS = require('aws-sdk');
const XLSX = require('xlsx');
const _ = require('lodash');
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1'
});

async function processExcelFile(inputFileKey, size) {
  console.log("inputFileKey", inputFileKey);
  console.log("size", size);
  // Get the Excel file from S3
  const inputObject = await s3.getObject({ Bucket: 'random-excel', Key: inputFileKey }).promise();
  console.log("inputObject", inputObject);
  const workbook = XLSX.read(inputObject.Body, { type: 'buffer' });

  // Get the first sheet name
  const sheetName = workbook.SheetNames[0];

  // Convert the sheet to JSON
  let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Randomly select rows based on size
  let sampleData = _.sampleSize(data, size);

  // Create a new workbook
  let newWorkbook = XLSX.utils.book_new();

  // Convert the sample data to a worksheet
  let newWorksheet = XLSX.utils.json_to_sheet(sampleData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

  // Write the workbook to a buffer
  const outputBuffer = XLSX.write(newWorkbook, { type: 'buffer' });

  // Upload the buffer to S3
  const outputFileKey = `output-${Date.now()}-${inputFileKey}`;
  await s3.putObject({ Bucket: 'random-excel', Key: outputFileKey, Body: outputBuffer }).promise();

  // Create a signed URL for the output file
  const url = s3.getSignedUrl('getObject', {
    Bucket: 'random-excel',
    Key: outputFileKey,
    Expires: 60 * 60, // 1 hour
  });

  return url;
}

module.exports = processExcelFile;
// // Usage
// processExcelFile('input-file.xlsx', 400)
//   .then(url => console.log('Download link:', url))
//   .catch(err => console.error(err));