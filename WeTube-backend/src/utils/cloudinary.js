import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        });
        // file has been uploaded successfully
        // console.log("file has been uploaded on cloudinary ", response);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (err) {
        console.error("Error uploading to Cloudinary:", err); // Debug statement
        fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return null;
        
        const publicId = cloudinaryUrl.split('/').pop().split('.')[0];
        const resourceType = cloudinaryUrl.includes('/video/') ? 'video' : 'image';
        const result = await cloudinary.uploader.destroy(publicId, {resource_type: resourceType});
        return result;
    } catch (err) {
        console.error("Couldn't delete from Cloudinary:", err);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };