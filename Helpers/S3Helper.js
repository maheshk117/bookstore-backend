require("dotenv").config();
const AWS = require("aws-sdk");

const secretAccessKey =  process.env.AWS_SECRET_ACCESS_KEY
const accessKeyId=    process.env.AWS_ACCESS_KEY_ID
const region= process.env.AWS_REGION
                       

const s3 = new AWS.S3({
credentials:{
    secretAccessKey:secretAccessKey,
    accessKeyId:accessKeyId,
   
},
region:region

});





const S3Uploadv2 = async (file)=>{
console.log(secretAccessKey)

    const param = {
      Bucket:process.env.BUCKET_NAME,
      Key:`${Date.now()}-${file.originalname}`,
      Body: file.buffer
     
    }
   const uploadResult = await s3.putObject(param).promise();
   const storedName = param.Key

   return{
    uploadResult,
    storedName
   }
}



const getImageSignedUrl = async  (key) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
 
  const seconds = 6000
  
 const url = await s3.getSignedUrlPromise('getObject', {...params, Expires: 6000})
  return url
}




module.exports={S3Uploadv2, getImageSignedUrl}