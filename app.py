import os
from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

app = Flask(__name__)

def scrape_prices(product_name):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    stores = {
        "Amazon": f"https://www.amazon.in/s?k={product_name.replace(' ', '+')}",
        "Flipkart": f"https://www.flipkart.com/search?q={product_name.replace(' ', '+')}"
    }

    results = []

    for store, url in stores.items():
        driver.get(url)
        time.sleep(3)

        try:
            if store == "Amazon":
                price_element = driver.find_element(By.CLASS_NAME, "a-price-whole")
            elif store == "Flipkart":
                price_element = driver.find_element(By.CLASS_NAME, "_30jeq3")

            price = int(price_element.text.replace(',', ''))
            results.append({"store": store, "price": price})
        except:
            results.append({"store": store, "price": "Not found"})

    driver.quit()
    return sorted(results, key=lambda x: x["price"] if isinstance(x["price"], int) else float('inf'), reverse=True)

@app.route("/search", methods=["GET"])
def search():
    product_name = request.args.get("product")
    if not product_name:
        return jsonify({"error": "Please provide a product name"}), 400

    prices = scrape_prices(product_name)
    return jsonify(prices)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
