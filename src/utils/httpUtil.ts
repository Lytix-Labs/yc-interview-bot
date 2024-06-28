const BASE_URL = "http://localhost:8001";
// "https://api-yc-bot.lytix.co";

/**
 * @param file File to upload
 */
const uploadFile = async (file: File | null = null) => {
  if (file === null) {
    const formData = new FormData();
    formData.append("file", "");
    const response = await fetch(`${BASE_URL}/api/v1/uploadFile`, {
      method: "POST",
      body: formData,
    });
    if (response.status !== 200) {
      throw new Error("Failed to upload file");
    }
    return response.json();
  } else {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${BASE_URL}/api/v1/uploadFile`, {
      method: "POST",
      body: formData,
    });
    if (response.status !== 200) {
      throw new Error("Failed to upload file");
    }
    return response.json();
  }
};

const HttpUtil = {
  uploadFile,
};

export default HttpUtil;
