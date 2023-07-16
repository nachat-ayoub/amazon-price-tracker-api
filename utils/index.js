module.exports.encodePriceRange = (minPrice, maxPrice) => {
  if (!minPrice || !maxPrice) return '';

  const formattedMinPrice = Math.round(minPrice * 100);
  const formattedMaxPrice = Math.round(maxPrice * 100);

  const priceRange = `${formattedMinPrice}-${formattedMaxPrice}`;
  const encodedParam = `p_36:${encodeURIComponent(priceRange)}`;

  const params = new URLSearchParams();
  params.append('rh', encodedParam);

  return params.toString();
};
