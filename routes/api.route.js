const axios = require('axios');
const { load } = require('cheerio');
const { encodePriceRange } = require('../utils');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.get('/search', async (req, res, next) => {
  const BASE_URL = 'https://www.amazon.com';
  let { q = '', page = 1, min_price = null, max_price = null } = req.query;
  page = parseInt(page);

  const url = `${BASE_URL}/s?k=${q}${
    page > 1 ? '&page=' + page : ''
  }&${encodePriceRange(min_price, max_price)}`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.79',
      Referer: url,
    },
  });

  if (response.status !== 200) {
    return res
      .status(400)
      .json({ message: 'There was an error during scraping operation' });
  }

  const $ = load(response?.data);

  const products = $(
    '.s-result-list.s-search-results div.s-result-item[data-asin][data-component-type="s-search-result"]'
  )
    .toArray()
    .map((product) => {
      const title = $(product).find('h2 a').text();
      const price = {
        whole: $(product)
          .find('.a-price .a-price-whole')
          .text()
          .replace('.', ''),
        fraction: $(product).find('.a-price .a-price-fraction').text(),
        currency: $(product).find('.a-price .a-price-symbol').text(),
      };

      return {
        title,
        price: {
          text: price.currency + price.whole + '.' + price.fraction,
          parced: parseFloat(price.whole + '.' + price.fraction),
          currency: price.currency,
        },
      };
    });

  res.json({ message: 'Search for products', url, page, q, products });
});

module.exports = router;
