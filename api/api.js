const { createCanvas, loadImage } = require('canvas');
const { ethers } = require('ethers');
const { WebSocketProvider } = require('ethers/providers');
const path = require('path');
const bcimage = path.resolve(__dirname, '../public/bc.png');


const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);

export default async (req, res) => {
  const { name: domainName } = req.query;
  console.log(domainName);

  if (!domainName) {
    return res.status(400).json({ error: 'Missing "name" query parameter' });
  }

  const domainABI = [{"inputs": [{"internalType": "string","name": "baseURI","type": "string"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "approved","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "operator","type": "address"},{"indexed": false,"internalType": "bool","name": "approved","type": "bool"}],"name": "ApprovalForAll","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "previousOwner","type": "address"},{"indexed": true,"internalType": "address","name": "newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "string","name": "","type": "string"}],"name": "addrOf","outputs": [{"internalType": "uint256","name": "id","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "approve","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "getApproved","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "operator","type": "address"}],"name": "isApprovedForAll","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "subDomainOwner","type": "address"},{"internalType": "string","name": "subDomain","type": "string"}],"name": "mintSubdomain","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "nameOf","outputs": [{"internalType": "string","name": "ensname","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "owner","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "renounceOwnership","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "subDomain","type": "string"}],"name": "resolve","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"},{"internalType": "bytes","name": "_data","type": "bytes"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "operator","type": "address"},{"internalType": "bool","name": "approved","type": "bool"}],"name": "setApprovalForAll","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "baseURI","type": "string"}],"name": "setBaseTokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "bytes4","name": "interfaceId","type": "bytes4"}],"name": "supportsInterface","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "string","name": "str","type": "string"}],"name": "testAlphaNumeric","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "transferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"stateMutability": "nonpayable","type": "function"}];
  const contractAddress = '0x39039e8994e1e58Fc4a56C59ef1B497EeBBA7811';  
  const infuraProjectId = '8419c212fd48402fb1c28c9fed25e119'; // Replace with your Infura Project ID
  const provider = new WebSocketProvider(`wss://sepolia.infura.io/ws/v3/${infuraProjectId}`);
  const contract = new ethers.Contract(contractAddress, domainABI, provider);

  const fileName = `${domainName}.png`;
  console.log(fileName);
/*
  try {
    // Check if the image already exists on Cloudinary
    console.log("aaa");
    const existingImage = await cloudinary.api.resource(fileName, { type: 'upload' });
    console.log(existingImage);

    if (existingImage) {
      const imageUrl = existingImage.secure_url;
      console.log(imageUrl);
      return generateResponseJson(domainName, imageUrl, res);
    }
  } catch (error) {
    console.log("bb");
    if (error.http_code !== 404) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  */
  console.log("cc");

  async function generateImageWithText(subdomain, bcimage) {
    console.log("Starting image generation...");
  
    const backgroundImage = await loadImage(bcimage);
    if (backgroundImage) {console.log("Background image loaded");}
  
    const canvas = createCanvas(backgroundImage.width, backgroundImage.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(backgroundImage, 0, 0);
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
  
    const textY = canvas.height * 0.75;
    ctx.fillText(`Token ID: ${subdomain}`, canvas.width / 2, textY);
    const outputBuffer = canvas.toBuffer('image/png');
    if (outputBuffer) {console.log("Image generated and in buffer");}
    
    return outputBuffer;
  }

  try {
    console.log("Generating image...");
    const outputBuffer = await generateImageWithText(domainName, bcimage);
    if (outputBuffer) {console.log("Image generation complete");}
  
    // Upload the image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName, resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.log("Failed to upload image");
            reject(error);
          } else {
            console.log("Image uploaded successfully");
            resolve(result);
          }
        }
      );
      uploadStream.end(outputBuffer);
    });
  
    console.log("Generating response...");
    generateResponseJson(domainName, result.secure_url, res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


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

};