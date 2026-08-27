const express = require("express");
const cors = require("cors");

const app = express();


// ========================================
// BASIC SETUP
// ========================================

app.use(cors());
app.use(express.json());

// index.html aur baaki frontend files serve karega
app.use(express.static(__dirname));


// ========================================
// PRODUCT CONNECTORS
// ========================================

// AMAZON
async function searchAmazon(product) {
    return [
        {
            platform: "Amazon",
            title: product,
            price: 69999,
            image: "",
            url: "#",
            available: true
        }
    ];
}


// FLIPKART
async function searchFlipkart(product) {
    return [
        {
            platform: "Flipkart",
            title: product,
            price: 68499,
            image: "",
            url: "#",
            available: true
        }
    ];
}


// CROMA
async function searchCroma(product) {
    return [
        {
            platform: "Croma",
            title: product,
            price: 70999,
            image: "",
            url: "#",
            available: true
        }
    ];
}


// ========================================
// PRODUCT SEARCH API
// ========================================

app.get("/api/search", async (req, res) => {

    const product = req.query.product;

    // Product name nahi diya
    if (!product || product.trim() === "") {
        return res.status(400).json({
            success: false,
            error: "Product name is required"
        });
    }

    try {

        // Teeno platforms ko ek saath search karo
        const results = await Promise.all([
            searchAmazon(product),
            searchFlipkart(product),
            searchCroma(product)
        ]);

        // Arrays ko ek single array mein convert karo
        const allProducts = results.flat();

        // Sirf available products
        const availableProducts = allProducts.filter(
            item => item.available
        );

        // Cheapest price
        if (availableProducts.length > 0) {

            const cheapestPrice = Math.min(
                ...availableProducts.map(item => item.price)
            );

            availableProducts.forEach(item => {

                item.cheapest =
                    item.price === cheapestPrice;

            });
        }

        // Cheapest product sabse upar
        availableProducts.sort(
            (a, b) => a.price - b.price
        );

        // Response
        res.json({
            success: true,
            search: product,
            count: availableProducts.length,
            results: availableProducts
        });

    } catch (error) {

        console.error("Search error:", error);

        res.status(500).json({
            success: false,
            error: "Unable to search products"
        });
    }
});


// ========================================
// HOME PAGE
// ========================================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


// ========================================
// LOCAL SERVER
// ========================================

// Local laptop par server chalega.
// Vercel par Vercel khud server handle karega.

if (!process.env.VERCEL) {

    app.listen(3000, () => {

        console.log(
            "Cheaper Bhaiya server running on http://localhost:3000"
        );

    });

}


// Vercel ke liye
module.exports = app;