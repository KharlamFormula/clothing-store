import ProductCard from "./ProductCard";

function ProductList({ products, addToCart }) {
  return (
    <div className="Container">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;

