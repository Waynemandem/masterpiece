import '../App.css'
import menuData  from '../data/menuData';



// Menu page
// Shows available shawarma items

function Menu( { addToCart }) {
  return (
    <div className="page menu-page">

      <h1>Our Menu</h1>

<br />
<br />
      <div className="menu-grid">

       {menuData.map((item) => (
        <div className="menu-item" key={item.id}>
            {/* Food image */}
            <img src={item.image} alt={item.name} />

            {/* Food name */}
            <h3>{item.name}</h3>

            {/* description */}
            <p>{item.description}</p>

            {/* Price */}
            <span>#{item.price}</span>

            {/* Add to cart button */}
            <button 
              onClick={() => addToCart(item)}
              >Add To Cart</button>
        </div>
       ))}
        

        </div>

      </div>
  );
}

export default Menu;
