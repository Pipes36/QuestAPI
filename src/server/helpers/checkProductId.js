module.exports = (product_id) => {
  if (isNaN(Number(product_id))) {
    throw new Error(`Invalid product_id: ${product_id} provided.`);
  }
  return product_id;
};
