 import axios from "axios";
 export const uploadImageToCloudinary = async (imageFile) => {
    const cloud_name = process.env.REACT_APP_CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    try {
        const formDataWithImage = new FormData();
        formDataWithImage.append("file", imageFile);
        formDataWithImage.append("upload_preset", "mzydeesi");

        const response = await axios.post(url, formDataWithImage, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const imageUrl = response.data.secure_url;
        return imageUrl;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
}