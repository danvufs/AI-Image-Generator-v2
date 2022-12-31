/**
 * It prevents the default form submission, clears the message and image, gets the prompt and size
 * values, and if the prompt is empty, it alerts the user and returns. Otherwise, it calls the
 * `generateImageRequest` function
 * @param e - the event object
 * @returns the value of the variable prompt.
 */
function onSubmit(e) {
  e.preventDefault();

  document.querySelector('.msg').textContent = '';
  document.querySelector('#image').src = '';

  const prompt = document.querySelector('#prompt').value;
  const size = document.querySelector('#size').value;

  if (prompt === '') {
    alert('Please add some text');
    return;
  }

  generateImageRequest(prompt, size);
}

/**
 * It takes a prompt and a size, sends a POST request to the server, and then displays the image
 * returned by the server
 * @param prompt - The prompt is the text that the model will use to generate the image.
 * @param size - The size of the image to generate.
 */
async function generateImageRequest(prompt, size) {
  /* Sending a POST request to the server. */
  try {
    showSpinner();
    const response = await fetch('/openai/generateimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        size,
      }),
    });
    // Check error response
    /* It checks if the response is not ok, it removes the spinner and throws an error. */
    if (!response.ok) {
      removeSpinner();
      throw new Error('That image could not be generated.');
    }

    const data = await response.json();
    // console.log(data);

    const imageUrl = data.data;
    document.querySelector('#image').src = imageUrl;

    removeSpinner();
  } catch (error) {
    document.querySelector('.msg').textContent = error;
  }
}

/**
 * When the user clicks the button, show the spinner.
 */
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

/**
 * It removes the class show from the element with the class spinner
 */
function removeSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

/* Listening for the submit event on the form and calling the onSubmit function when the event is
triggered. */
document.querySelector('#image-form').addEventListener('submit', onSubmit);
