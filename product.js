function changeImage(imageUrl) {
    const productImage = document.getElementById('product-image');
    productImage.src = imageUrl;
}

// JavaScript to handle size option selection
function selectSize(element) {
    if(element.getAttribute("disabled")) return;
    const sizeOptions = document.querySelectorAll('.size-option');

    // Deselect all size options
    sizeOptions.forEach((option) => {
        option.classList.remove('selected');
    });

    // Select the clicked size option
    element.classList.add('selected');
}

// JavaScript to handle size option selection and display the selling fast message
function selectSize(element) {
    const sizeOptions = document.querySelectorAll('.size-option');
    const sellingFastMessage = document.getElementById('selling-fast-message');

    // Deselect all size options
    sizeOptions.forEach((option) => {
        option.classList.remove('selected');
    });

    // Select the clicked size option
    element.classList.add('selected');

    // Determine if the clicked size is selling fast
    const isSellingFast = element.getAttribute('data-selling-fast') === 'true';

    // Display the selling fast message if applicable
    if (isSellingFast) {
        sellingFastMessage.style.display = 'block';
    } else {
        sellingFastMessage.style.display = 'none';
    }
}

// Sample data for sold-out sizes (replace with your actual data)
const soldOutSizes = [3.5, 5, 7];

// Function to disable sold-out sizes
function disableSoldOutSizes() {
    const sizeOptions = document.querySelectorAll('.size-option');

    sizeOptions.forEach((option) => {
        const size = parseFloat(option.getAttribute('data-size'));

        // if (soldOutSizes.includes(size)) {
        //     option.classList.add('sold-out'); // Apply the "sold-out" class
        //     option.setAttribute('disabled', true); // Disable the option
        // }
    });
}

// Call the function to disable sold-out sizes
disableSoldOutSizes();

// Initialize the number of reviews
let numberOfReviews = 0;

// JavaScript to toggle reviews and rotate the arrow image for the reviews
function toggleReviews() {
    const reviews = document.getElementById('reviews');
    const arrow = document.getElementById('arrow-image');

    if (reviews.style.display === 'block') {
        reviews.style.display = 'none';
        arrow.style.transform = 'rotate(90deg)'; // Rotate back to facing down
    } else {
        reviews.style.display = 'block';
        arrow.style.transform = 'rotate(270deg)'; // Rotate to facing upwards
    }
}



let productId = new URLSearchParams(location.search).get("productId")

loadProductData(productId)

// Function to update the number of reviews
function updateNumberOfReviews(newCount) {
    numberOfReviews = newCount;
    const reviewsButtonText = document.querySelector('.reviews-button-text');
    reviewsButtonText.innerHTML = `Reviews (${numberOfReviews})`;
}

// Example usage: To update the number of reviews to 3
// updateNumberOfReviews(2);

function getImageURL(baseDir, imageNumber) {
    return "Images/ProductImages/" + baseDir + "Image" + imageNumber + ".jpg"
}

function createReviewElement(review) {
    let username = review.username
    let rating = review.rating
    let reviewText = review.comment
    let pfp = review.pfp
    let date = review.date

    let reviewElement = document.createElement("div")
    reviewElement.classList.add("review")

    let ratingContainer = document.createElement("div")
    ratingContainer.classList.add("rating")

    let stars = document.createElement("div")
    stars.classList.add("stars")

    //Font awsome stars, also support half stars
    for (let i = 0; i < 5; i++) {
        let star = document.createElement("span")
        star.classList.add("fa")
        if (i < rating) {
            star.classList.add("fa-star")
            star.classList.add("checked")
        } else {
            star.classList.add("fa-star")
        }
        stars.appendChild(star)
    }

    let plainRating = document.createElement("div")
    plainRating.classList.add("plain-rating")
    plainRating.textContent = rating + " Stars"

    ratingContainer.appendChild(stars)

    ratingContainer.appendChild(plainRating)

    reviewElement.appendChild(ratingContainer)

    let reviewTextElement = document.createElement("p")
    reviewElement.classList.add("review-text")
    reviewTextElement.textContent = reviewText
    reviewElement.appendChild(reviewTextElement)

    let userInfo = document.createElement("div")
    userInfo.classList.add("user-info")

    let pfpElement = document.createElement("img")
    pfpElement.alt = "Profile picture of " + username
    pfpElement.src = pfp

    userInfo.appendChild(pfpElement)

    let usernameElement = document.createElement("p")
    usernameElement.classList.add("username")
    usernameElement.textContent = username

    let dateElement = document.createElement("p")
    dateElement.classList.add("date")
    dateElement.textContent = new Date(date).toLocaleDateString()

    let div = document.createElement("div")
    div.classList.add("username-date")

    div.appendChild(usernameElement)
    div.appendChild(dateElement)

    userInfo.appendChild(div)

    reviewElement.appendChild(userInfo)

    return reviewElement
}

// Function to fetch and display product data
function loadProductData(productId) {
    console.log('Loading')
    // Fetch product data from the JSON file
    fetch("products.json")
        .then((response) => response.json())
        .then((data) => {
            // Find the product with the matching ID
            const product = data.find((item) => item.id === productId);

            if (product) {
                // Populate the product page template with the data
                const productName = document.getElementById("product-title");
                const productDescription = document.getElementById("product-description");
                const productPrice = document.getElementById("product-price");
                const productImages = document.querySelector(".image-selection-list>ul");
                const mainImage = document.getElementById("product-image")
                const sizeOptions = document.querySelectorAll('.size-option');
                const reviews = document.getElementById('reviews');
                let reviewsButtonText = document.querySelector('.reviews-button-text');

                let sizesNotAvailable = product.sizesNotAvailable
                sizeOptions.forEach((option) => {
                    if (sizesNotAvailable.includes(parseFloat(option.getAttribute('data-size'), 10))) {
                        option.remove()
                    }
                })

                // Update the number of reviews
                updateNumberOfReviews(product.reviews.length);

                // Display the reviews
                product.reviews.forEach((review) => {
                    const reviewElement = createReviewElement(review);
                    reviews.appendChild(reviewElement);
                });



                productName.textContent = product.name;
                productDescription.textContent = product.description;
                productPrice.textContent = product.price;
                mainImage.src = getImageURL(product.baseDir, 1)
                new Array(product.imageCount).fill(0).forEach((_, i) => {
                    let li = document.createElement("li")
                    let img = document.createElement("img")
                    img.src = getImageURL(product.baseDir, i + 1)
                    img.alt = "An image icon"
                    img.addEventListener('click', function () {
                        changeImage(img.src)
                    });
                    li.appendChild(img)
                    productImages.appendChild(li)
                })

            } else {
                // Handle the case where the product is not found
                console.log('Product not found');
            }
        })
        .catch((error) => {
            // Handle any errors that occur during the fetch
            console.error('Error fetching product data:', error);
        });
}
