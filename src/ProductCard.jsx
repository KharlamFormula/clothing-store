import { RiShoppingBasketLine } from "react-icons/ri";

function ProductCard({ product, addToCart }) {
  return (
    <div className="Card">
      <img src={product.picture} width="300" height="420" />
      <p className="Par">{product.par}</p>

      <div className="Btn">
        <p>{product.price} грн</p>
        <button
          className="btn_icon"
          onClick={() => addToCart(product)}
        >
          <RiShoppingBasketLine className="Icon" />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
