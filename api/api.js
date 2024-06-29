const { createCanvas } = require('canvas');
const axios = require('axios');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async (req, res) => {
  const { name: domainName } = req.query;

  if (!domainName) {
    return res.status(400).json({ error: 'Missing "name" query parameter' });
  }

  const fileName = `${domainName.replace(/[^a-zA-Z0-9]/g, '')}.png`;

  try {
    // Check if the image already exists on Cloudinary
    const existingImage = await cloudinary.api.resource(fileName, { type: 'upload' });

    if (existingImage) {
      const imageUrl = existingImage.secure_url;
      return generateResponseJson(domainName, imageUrl, res);
    }
  } catch (error) {
    if (error.http_code !== 404) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Generate new image
  const canvas = createCanvas(800, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.font = '48px Arial';
  ctx.fillText(domainName, 50, 100);

  const buffer = canvas.toBuffer('image/png');

  // Upload the image to Cloudinary
  const result = await cloudinary.uploader.upload_stream(
    { public_id: fileName, resource_type: 'image' },
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to upload image' });
      }
      generateResponseJson(domainName, result.secure_url, res);
    }
  );

  buffer.pipe(result);
};

const generateResponseJson = (domainName, imageUrl, res) => {
  const response = {
    is_normalized: true,
    name: domainName,
    image: imageUrl,
    description: "3ID :: Web3 Identity for everyone! Find more info about this domain on its ENS page.",
    attributes: [
      {
        trait_type: "Length",
        display_type: "number",
        value: domainName.length,
      },
      {
        trait_type: "Data Type",
        value: "Alphabets",
      },
    ],
    name_length: domainName.length,
    url: `https://app.ens.domains/name/${domainName}`,
    version: 0,
  };

  res.json(response);
};