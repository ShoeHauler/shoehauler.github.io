// let productId = new URLSearchParams(location.search).get("productId")

// document.getElementById("code").innerText = productId   

document.addEventListener("DOMContentLoaded", function() {
    // Function to get the value of a URL parameter by name
    function getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get the product ID from the URL
    const productId = getUrlParam("productId");
    console.log(productId)

    // Update the HTML content with the product ID
    if (productId !== null) {
        document.getElementById("code").textContent = productId;
    } else {
        document.getElementById("code").textContent = "N/A";
    }
});