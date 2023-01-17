// Import the Configuration and OpenAIApi classes from the 'openai' module
const { Configuration, OpenAIApi } = require('openai');

// Create a new Configuration object with the user's API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// Create a new OpenAIApi object using the Configuration object
const openai = new OpenAIApi(configuration);
// Define object for image sizes, with keys of size names and values of size dimensions
const imageSizes = {
  small: '256x256',
  medium: '512x512',
  large: '1024x1024',
};

// Function to handle errors, logs error message and sends a JSON response with error message to the client
const handleError = (error, res) => {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.log(error.message);
  }

  res.status(400).json({
    success: false,
    error: 'The image could not be generated',
  });
};

const imageCache = {};
const cacheExpiration = 5 * 60 * 1000; // 5 minutes
// Asynchronous function to handle image generation requests
const generateImage = async (req, res) => {
  // Destructure the prompt and size from the request body
  const { prompt, size } = req.body;
  // If a valid size is not provided, default to medium
  const imageSize = imageSizes[size] || imageSizes.medium;

  // Check if the image has been cached for the given prompt and size
  if (imageCache[prompt + imageSize] && imageCache[prompt + imageSize].expiration > Date.now()) {
    res.status(200).json({
      success: true,
      data: imageCache[prompt + imageSize].url,
    });
    return;
  }

  try {
    // Call the createImage method on the OpenAIApi object with the provided prompt, a value of 1 for n (number of images to generate), and the image size
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });
    // Get the URL of the generated image from the response data
    const imageUrl = response.data.data[0].url;

    // Add the image to the cache with the current time plus the cache expiration time
    imageCache[prompt + imageSize] = {
      url: imageUrl,
      expiration: Date.now() + cacheExpiration,
    };
    // Send a JSON response to the client with a success status and the image URL
    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    // Handle any errors that occur during the image generation process
    handleError(error, res);
  }
};
// Export the generateImage function
module.exports = { generateImage };

