const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

class UploadService {
  async uploadSingle(file) {
    if (!file) throw new Error('No file provided');
    
    const result = await uploadToCloudinary(file.buffer, 'traveloop/uploads');
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format
    };
  }

  async uploadMultiple(files) {
    if (!files || files.length === 0) throw new Error('No files provided');
    
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, 'traveloop/galleries')
    );
    
    const results = await Promise.all(uploadPromises);
    
    return results.map(res => ({
      url: res.secure_url,
      publicId: res.public_id,
      size: res.bytes,
      format: res.format
    }));
  }

  async deleteFile(publicId) {
    return await deleteFromCloudinary(publicId);
  }
}

module.exports = new UploadService();
