import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
      
    if (user) {
      fetch(`http://localhost:5000/wishlists?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setWishlists(data));
    }
  }, [user]);

  // Synchronize category or search param changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setCurrentPage(1); // Reset to page 1 on search or category change
  }, [searchParams, categoryId]);

  const handlePriceChange = (index, value) => {
    const next = [...priceRange];
    next[index] = Number(value);
    if (index === 0 && next[0] > next[1]) next[0] = next[1];
    if (index === 1 && next[1] < next[0]) next[1] = next[0];
    setPriceRange(next);
    setCurrentPage(1);
  };

  const handleApplySearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  const handleToggleWishlist = async (product) => {
    if (!user) return;
    const existing = wishlists.find(w => w.productId === product.id);
    if (existing) {
      await fetch(`http://localhost:5000/wishlists/${existing.id}`, { method: 'DELETE' });
      setWishlists(wishlists.filter(w => w.id !== existing.id));
    } else {
      const res = await fetch('http://localhost:5000/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, product })
      });
      const data = await res.json();
      setWishlists([...wishlists, data]);
      toast.success(`${product.title} added to Wishlist!`);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) return;
    const res = await fetch(`http://localhost:5000/carts?userId=${user.id}&productId=${product.id}`);
    const existing = await res.json();
    
    if (existing.length > 0) {
      toast.error('Product is already in your cart!');
    } else {
      await fetch('http://localhost:5000/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1, product })
      });
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.title} added to Cart!`);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = categoryId ? p.category === categoryId : true;
        
        let matchesSearch = false;
        if (!searchTerm) {
          matchesSearch = true;
        } else {
          const term = searchTerm.toLowerCase().trim();
          
          // Direct text match against title or exact category
          if (p.title.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)) {
            matchesSearch = true;
          }
          
          // Synonym matching logic based on common vernacular mapping
          const isShoe = ['shoe', 'shoes', 'sneaker', 'heel', 'heels'].some(t => term.includes(t));
          const isToy = ['toy', 'toys', 'plush', 'plushy', 'plushies'].some(t => term.includes(t));
          const isMakeup = ['makeup', 'cosmetic', 'lipstick', 'lipstic', 'kajal', 'face', 'foundation', 'concealer'].some(t => term.includes(t));
          const isBag = ['bag', 'bags', 'backpack', 'tote', 'suitcase'].some(t => term.includes(t));
          
          if (isShoe && (p.category === 'Sneakers' || p.category === 'Footwear')) matchesSearch = true;
          if (isToy && p.category === 'Plush Toys') matchesSearch = true;
          if (isMakeup && p.category === 'Makeup') matchesSearch = true;
          if (isBag && p.category === 'Bags') matchesSearch = true;
        }

        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        return a.id - b.id;
      });
  }, [products, categoryId, searchTerm, priceRange, sort]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="container-fluid px-5 py-5">
      
      {/* Top Search Bar */}
      <div className="mb-5 pb-4 pt-4 border-bottom sticky-top" style={{ top: '110px', zIndex: 100, backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color) !important' }}>
        <form onSubmit={handleApplySearch} className="w-100">
          <div className="d-flex position-relative shadow-sm rounded-pill overflow-hidden">
            <button type="submit" className="btn position-absolute start-0 top-0 h-100 border-0 px-4" style={{ color: 'var(--text-secondary)', zIndex: 10 }}>
              <SearchIcon size={26} />
            </button>
            <input 
              type="text" 
              className="form-control form-control-lg border-0 py-3 pe-4" 
              placeholder="Search products by keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '1.2rem', paddingLeft: '70px' }}
            />
          </div>
        </form>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="display-4 fw-bold m-0">{categoryId || 'All Products'}</h2>
        <span className="text-secondary fw-medium fs-4">{filteredProducts.length} Results</span>
      </div>

      <div className="row g-5">
        <div className="col-lg-3 col-xl-2">
          <div className="card shadow-sm border-0 p-4 mb-4 rounded-4 sticky-top" style={{ top: '230px', zIndex: 10 }}>
            <h3 className="fw-bold mb-4">Filters</h3>

            <div className="mb-4">
              <label className="form-label fw-bold text-secondary fs-5 mb-2">Sort By</label>
              <select className="form-select form-select-lg border-0" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <div className="mb-4 pt-3">
              <label className="form-label fw-bold text-secondary fs-5 mb-3 w-100 d-flex justify-content-between align-items-center">
                <span>Min Price</span>
                <span className="fw-bold fs-4" style={{color: 'var(--text-primary) !important'}}>${priceRange[0]}</span>
              </label>
              <input 
                type="range" className="form-range w-100" min="0" max="300" step="5"
                value={priceRange[0]} onChange={(e) => handlePriceChange(0, e.target.value)} 
              />
            </div>

            <div className="mb-4 pt-3">
              <label className="form-label fw-bold text-secondary fs-5 mb-3 w-100 d-flex justify-content-between align-items-center">
                <span>Max Price</span>
                <span className="fw-bold fs-4" style={{color: 'var(--text-primary) !important'}}>${priceRange[1]}</span>
              </label>
              <input 
                type="range" className="form-range w-100" min="0" max="300" step="5"
                value={priceRange[1]} onChange={(e) => handlePriceChange(1, e.target.value)} 
              />
            </div>
            
            {categoryId && (
              <div className="mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                <Link to="/products" className="btn btn-outline-primary w-100 fw-medium">Clear Category Filter</Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-9 col-xl-10">
          {currentProducts.length > 0 ? (
            <>
              <div className="row g-5 row-cols-1 row-cols-md-2 row-cols-xxl-3 mb-5">
                {currentProducts.map(product => (
                  <div className="col" key={product.id}>
                    <ProductCard 
                      product={product} 
                      isWishlisted={wishlists.some(w => w.productId === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-4 mt-5">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="btn btn-primary border-0 d-flex align-items-center justify-content-center shadow-sm fw-bold px-4 py-2"
                    style={{ borderRadius: '25px' }}
                  >
                    <ChevronLeft size={20} className="me-2" /> Prev
                  </button>
                  
                  <span className="fw-bold text-secondary fs-5">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="btn btn-primary border-0 d-flex align-items-center justify-content-center shadow-sm fw-bold px-4 py-2"
                    style={{ borderRadius: '25px' }}
                  >
                    Next <ChevronRight size={20} className="ms-2" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5 mt-5">
              <h3 className="fw-bold mb-3">No Products Found</h3>
              <p className="text-secondary mb-4">Try adjusting your filters or search terms.</p>
              <button onClick={() => { setSearchTerm(''); setPriceRange([0,300]); setSort('default'); }} className="btn btn-primary px-4 fw-medium">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
