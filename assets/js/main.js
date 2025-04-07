const animateQuestions = () => {
    const questions = document.querySelectorAll("#faq .question-block");

    questions.forEach((block) => {
        block.addEventListener("click", () => {
            let isActive = block.classList.contains("active");

            questions.forEach((question) => {
                question.classList.remove("active");
                question.style.height = "";
            });

            if (!isActive) {
                block.classList.add("active");

                let height =
                    block.querySelector(".answer").offsetHeight +
                    block.querySelector(".question").offsetHeight;

                block.style.height = `${height}px`;
            }
        });
    });
};

const removeLoader = (loaderSelector) => {
    let loader = document.querySelector(loaderSelector);
    if (!loader) return;

    loader.style.opacity = 0;
    setTimeout(() => {
        loader.remove();
    }, 350);
};

async function fetchProducts() {
    const endpoint =
        "https://tsodykteststore.myshopify.com/api/2023-01/graphql.json";
    const accessToken = "7e174585a317d187255660745da44cc7";

    const query = `
      {
        products(first: 8) {
          edges {
            node {
              title
              description
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                    compareAtPrice {
                      amount
                    }
                  }
                }
              }
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": accessToken,
            },
            body: JSON.stringify({ query }),
        });

        const data = await res.json();
        const products = data.data.products.edges;
        const container = document.querySelector(
            "#featured_products_list .product-list"
        );

        products.forEach(({ node }) => {
            const { title, description, variants, images } = node;

            const price = variants.edges[0].node.price.amount;
            const compareAt = variants.edges[0].node.compareAtPrice?.amount;

            const img1 = images.edges[0]?.node;
            const img2 = images.edges[1]?.node;

            const productEl = document.createElement("div");
            productEl.className = "product";
            productEl.innerHTML = `
            <div class="product-img">
                <img src="${img1.url || "default.png"}" alt="${
                img1.altText || "Product Image"
            }" width="300" height="377">
                ${
                    img2
                        ? `<img src="${img2.url}" alt="${
                              img2.altText || "Product Image"
                          }"  width="300" height="377">`
                        : ""
                }
            </div>
            <div class="product-info-container">
                <div>
                    <p class="product-name">${title}</p>
                    <p class="product-description">${description}</p>
                </div>
                <div class="product-price-container">
                    ${
                        compareAt
                            ? `<p class="product-compare">${compareAt}</p>`
                            : ""
                    }
                    <p class="product-price">${price}</p>
                </div>
            </div>
            
            `;

            container.appendChild(productEl);
        });
    } catch (error) {
        const errorMsg = document.querySelector(
            "#featured_products_list .error-massage"
        );

        if (errorMsg) {
            errorMsg.innerText =
                "Failed to load products. Please, try again later (╯°□°)╯︵ ┻┻";
        }
    } finally {
        removeLoader("#featured_products_list .loader-block");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    animateQuestions();

    fetchProducts();
});
