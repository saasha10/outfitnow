const { v4: uuidv4 } = require('uuid');
const path = require('path');
const supabase = require('../config/supabaseClient');

const BUCKET = 'clothing-images';

/**
 * Upload an image to Supabase Storage.
 * @param {Object} file - multer file object (buffer, originalname, mimetype)
 * @param {string} userId - owner of the image
 * @returns {{ image_url: string, image_path: string }}
 */
async function uploadImage(file, userId) {
  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `${uuidv4()}${ext}`;
  const storagePath = `${userId}/${filename}`;

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  return {
    image_url: data.publicUrl,
    image_path: `${BUCKET}/${storagePath}`,
  };
}

module.exports = { uploadImage };
