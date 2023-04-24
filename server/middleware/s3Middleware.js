import aws from 'aws-sdk';
import fs from "fs";
console.log(process.env.AWS_SECRET_ACCESS_KEY)
console.log(process.env.AWS_ACCESS_KEY)
console.log(process.env.AWS_REGION)
console.log(process.env.AWS_BUCKET)
aws.config.update({
    secretAccessKey: "lpf5Rf39JYMVLT7eBmn8Kqk2WGIN7y8DtM5UquXf",
    accessKeyId: "AKIAQHKK5I56SFRBKMOD",
    region: "us-east-1"
});

const s3 = new aws.S3();
// @Service: uploadfile
const uploadFile = (file) => {

    // @ts-ignore
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET + `/groupImage`,
        Body: fileStream,
        Key: file.filename,
        ACL: 'public-read'
    };
    return s3.upload(uploadParams).promise();
};

// @Service : GetSignedURL
const getSignedUrl = async (fileKey, folder) => {
    // console.log(fileKey)
    const signedUrlExpireSeconds = 18000;
    try {
        const url = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_BUCKET,
            Key: `${fileKey}`,
            Expires: signedUrlExpireSeconds,
        });
        return url;
    } catch (headErr) {
        console.log(headErr);
        if (headErr.code === "NotFound") {
            return false;
        }
    }
};


export { uploadFile, s3, getSignedUrl };