const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// CHEAPER BHAIYA - PRODUCT CONNECTORS
// ========================================

// Amazon connector
async function searchAmazon(product) {

    // Real Amazon API baad mein yahan connect hogi

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


// Flipkart connector
async function searchFlipkart(product) {

    // Real Flipkart API/approved feed baad mein yahan connect hoga

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


// Croma connector
async function searchCroma(product) {

    // Croma ka approved data source baad mein connect hoga

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
// SEARCH ENGINE
// ========================================

app.get("/api/search", async (req, res) => {

    const product = req.query.product;

    if (!product) {
        return res.status(400).json({
            error: "Product name is required"
        });
    }

    try {

        const results = await Promise.all([
            searchAmazon(product),
            searchFlipkart(product),
            searchCroma(product)
        ]);

        const allProducts = results.flat();

        // Available products only
        const availableProducts = allProducts.filter(
            product => product.available
        );

        // Cheapest price find karo
        if (availableProducts.length > 0) {

            const cheapestPrice = Math.min(
                ...availableProducts.map(product => product.price)
            );

            availableProducts.forEach(product => {

                product.cheapest =
                    product.price === cheapestPrice;

            });
        }

        // Cheapest first
        availableProducts.sort(
            (a, b) => a.price - b.price
        );

        res.json({
            success: true,
            search: product,
            count: availableProducts.length,
            results: availableProducts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Unable to search products"
        });
    }
});


// ========================================
// SERVER
// ========================================

app.listen(3000, () => {

    console.log(
        "Cheaper Bhaiya server running on http://localhost:3000"
    );

});
