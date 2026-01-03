import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary;

export const uploadToCloudinary = async (
  imageData: File,
  folder: string,
  public_id?: string
) => {
  const arrayBuffer = await imageData.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  return await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, public_id }, function (error, result) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result!);
      })
      .end(buffer);
  });
};
