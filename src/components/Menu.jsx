import { useState, useEffect } from "react";

const Menu = ({ handleCategoryUrl, handleCategoryTagsUrl, setCategoryTagsUrl, setResetStorageApiUrl }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSubCategory, setCurrentSubCategory] = useState('');

  const categories = [
    {
      name: "Aluminijumski sistemi za ograde",
      category_code: "aluminum",
      subcategories: [
        { name: "Aluminijumski okrugli sistem", category_code: "aluminum1" },
        { name: "Aluminijumski kvadratni sistem", category_code: "aluminum2" },
        { name: "Aluminijumski ovalni sistem", category_code: "aluminum3" },
        { name: "Aluminijumski sistem za staklene ograde", category_code: "aluminum4" },
        { name: "Aluminijumski sistem za dvorišne ograde", category_code: "aluminum5" }
      ]
    },
    {
      name: "Okov za proizvode od stakla",
      category_code: "glass",
      subcategories: [
        { name: "Okov za staklo i tuš kabine", category_code: "glass1" },
        { name: "Aluminijumski sistem za staklene ograde", category_code: "glass2" },
        { name: "Držači stakla i spajderi", category_code: "glass3" }
      ]
    },
    {
      name: "Rukohvati, kvake i kontrola pristupa za ulazna vrata",
      category_code: "access",
      subcategories: [
        { name: "Rukohvati", category_code: "access1" },
        { name: "Kvake", category_code: "access2" },
        { name: "Kontrola pristupa", category_code: "access3" }
      ]
    }
  ];

  // Handle hover for categories
  const handleMouseEnter = (menu) => setActiveMenu(menu);

  const handleMouseLeave = () => setActiveMenu(null);

  // Handle hover for subcategories
  const handleItemMouseEnter = (item) => setHoveredItem(item);
  const handleItemMouseLeave = () => setHoveredItem(null);

  // Handle menu click and set category URL
  const handleCategory = (e, categoryId, category) => {
    e.preventDefault();
    console.log(`Selected category: ${categoryId}`);
    handleCategoryUrl(categoryId);
    setActiveMenu(null); // Close submenu after selection
    setCategoryTagsUrl('');
    setCurrentCategory(category.name);
    setCurrentSubCategory('');
    // Store selected category in localStorage
    localStorage.setItem('currentCategory', category.name);
    localStorage.setItem('currentSubCategory', '');
  };

  // Handle submenu click and set category + subcategory URL
  const handleCategoryAndTags = (category, subcategory, sub) => {
    console.log(`Selected category: ${category}, Selected subcategory: ${subcategory}`);
    handleCategoryTagsUrl(category, subcategory); 
    setCurrentSubCategory(sub.name);
    // Store selected category and subcategory in localStorage
    localStorage.setItem('currentCategory', category);
    localStorage.setItem('currentSubCategory', sub.name);
  };

  // Remove category and subcategory from state and localStorage
  const removeCategoryAndSubcategory = () => {
    setCurrentCategory('');
    setCurrentSubCategory('');
    setCategoryTagsUrl('');
    handleCategoryTagsUrl('', '');
    setResetStorageApiUrl(true);
    localStorage.removeItem('currentCategory');
    localStorage.removeItem('currentSubCategory');
    localStorage.removeItem('api url');
  };

  // Load category and subcategory from localStorage on page load
  useEffect(() => {
    const savedCategory = localStorage.getItem('currentCategory');
    const savedSubCategory = localStorage.getItem('currentSubCategory');
    if (savedCategory) {
      setCurrentCategory(savedCategory);
    }
    if (savedSubCategory) {
      setCurrentSubCategory(savedSubCategory);
    }
  }, []);

  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.menu}>
          {categories.map((category, id) => (
            <div
              key={id}
              style={styles.menuItem}
              onMouseEnter={() => handleMouseEnter(category.category_code)}
              onMouseLeave={handleMouseLeave}
            >
              <div style={styles.menuDiv} onClick={(e) => handleCategory(e, category.category_code, category)}>
                {category.name}
              </div>
              {activeMenu === category.category_code && (
                <div style={styles.subMenu}>
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.category_code}
                      style={hoveredItem === subcategory.category_code ? styles.subMenuItemHovered : styles.subMenuItem}
                      onMouseEnter={() => handleItemMouseEnter(subcategory.category_code)}
                      onMouseLeave={handleItemMouseLeave}
                    >
                      <div style={styles.menuDiv} onClick={() => handleCategoryAndTags(category.category_code, subcategory.category_code, subcategory)}>
                        {subcategory.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      <div style={{ marginTop: '10px', marginRight: '20px', textAlign: 'right' }}>
        {(currentSubCategory || currentCategory) && (
          <p>
            Kategorija: {currentSubCategory ? currentSubCategory : currentCategory}
            <span>
              <button
                style={{ marginLeft: '20px', border: 'none', backgroundColor: 'red' }}
                onClick={removeCategoryAndSubcategory}
              >
                x
              </button>
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  nav: {
    backgroundColor: "#333",
    padding: "10px 0",
  },
  menu: {
    display: "flex",
    justifyContent: "center",
    listStyleType: "none",
    margin: 0,
    padding: 0,
  },
  menuItem: {
    color: "#fff",
    margin: "0 15px",
    cursor: "pointer",
    position: "relative",
    padding: "10px",
  },
  subMenu: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "#444",
    padding: "10px 0",
    display: "block",
  },
  subMenuItem: {
    padding: "10px 20px",
    color: "#fff",
    cursor: "pointer",
  },
  subMenuItemHovered: {
    padding: "10px 20px",
    color: "#fff",
    cursor: "pointer",
    backgroundColor: "#555",
  },
  menuDiv: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
};

export default Menu;
