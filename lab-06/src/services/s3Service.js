const { s3Client } = require("../config/awsConfig");
const { Upload } = require("@aws-sdk/lib-storage");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const { randomUUID } = require("crypto");

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

const uploadFile = async(file) => {
    if (!BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME chưa được cấu hình trong .env");
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        throw new Error(
            "File ảnh không hợp lệ. Chỉ chấp nhận: " + ALLOWED_EXTENSIONS.join(", ")
        );
    }

    const fileName = `${randomUUID()}${fileExtension}`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        },
    });

    await upload.done();

    const region = process.env.AWS_REGION || "us-east-1";
    return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;
};

const deleteFile = async(fileUrl) => {
    if (!fileUrl || !BUCKET_NAME) return;

    const fileName = fileUrl.split("/").pop();

    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
    });

    try {
        await s3Client.send(command);
    } catch (error) {
        console.error("Lỗi xóa file trên S3:", error);
    }
};

module.exports = { uploadFile, deleteFile };