import React, { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext);

  return (
    <section className='explore-menu' id='explore-menu'>
      <div className="explore-menu-header">
        <h1>Explore Our Menu</h1>
        <p className='explore-menu-subtitle'>Serving Englewood, New Jersey and neighbors since 2019</p>
      </div>
      
      <div className="explore-menu-list-container">
        <div className="explore-menu-list">
          {menu_list.map((item, index) => (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
              key={index} 
              className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
            >
              <div className="menu-item-image-container">
                <img 
                  src={item.menu_image} 
                  alt={item.menu_name} 
                  loading="lazy"
                />
              </div>
              <p className="menu-item-name">{item.menu_name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="explore-menu-divider"></div>
    </section>
  );
};

export default ExploreMenu;
