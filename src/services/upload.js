import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "brnpro"); // your custom preset

  // 🔥 IMPORTANT: Replaced with actual Cloudinary cloud name
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dzysufcjg/image/upload",
    formData
  );

  return res.data.secure_url; // 🔥 final image URL
};

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "loopchatdata");

  // Determine resource type:
  let resourceType = "raw"; // default for doc/pdf/zip
  if (file.type.startsWith("image/")) {
    resourceType = "image";
  } else if (file.type.startsWith("video/")) {
    resourceType = "video";
  }

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/dzysufcjg/${resourceType}/upload`,
    formData
  );

  return {
    url: res.data.secure_url,
    type: resourceType.toUpperCase() === 'RAW' ? 'FILE' : resourceType.toUpperCase() // IMAGE, VIDEO, FILE
  };
};
