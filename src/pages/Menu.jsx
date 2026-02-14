import '../App.css'



// Menu page
// Shows available shawarma items

function Menu() {
  return (
    <div className="page menu-page">

      <h1>Our Menu</h1>

<br />
<br />
      <div className="menu-grid">

        <div className="menu-item">
          <h3>Chicken Shawarma</h3>
          <p>Juicy grilled chicken with creamy sauce</p>
          <span>₦2500</span>
        </div>

        <div className="menu-item">
          <h3>Beef Shawarma</h3>
          <p>Rich beef filling with fresh veggies</p>
          <span>₦3000</span>
        </div>

        <div className="menu-item">
          <h3>Special Mix Shawarma</h3>
          <p>Chicken + Beef combo for serious eaters</p>
          <span>₦3500</span>
        </div>

      </div>

    </div>
  );
}

export default Menu;
