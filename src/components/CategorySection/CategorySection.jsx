import "./CategorySection.css";

const CategorySection = ({ categories = [] }) => {
  const transformCategory = (category) => ({
    id: category.id,
    name: category.name || category.title,
    description: category.description || "Explore our collection",
    image:
      category.image ||
      category.imageUrl ||
      "/placeholder.svg?height=300&width=300",
    itemCount: category.itemCount || category.productCount || 0,
  });

  return (
    <section className="category-section">
      <div className="category-container">
        <div className="category-header">
          <h2 className="category-title">Shop by Category</h2>
          <p className="category-description">
            Find your perfect style in our curated collections
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => {
            const transformedCategory = transformCategory(category);
            return (
              <div key={transformedCategory.id} className="category-card">
                <div className="category-image-container">
                  <img
                    src={transformedCategory.image}
                    alt={transformedCategory.name}
                    className="category-image"
                  />
                  <div className="category-overlay">
                    <button
                      className="category-shop-btn"
                      onClick={() => {
                        // Add navigation logic here
                        console.log(
                          `Navigate to category: ${transformedCategory.name}`
                        );
                      }}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{transformedCategory.name}</h3>
                  <p className="category-desc">
                    {transformedCategory.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
