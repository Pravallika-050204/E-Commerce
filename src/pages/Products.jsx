import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  // Ref to scroll back to products top on page change
  const productsTopRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://e-commerce-zjcq.onrender.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      });
    if (user) {
      fetch(`https://e-commerce-zjcq.onrender.com/wishlists?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setWishlists(data));
    }
  }, [user]);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setCurrentPage(1);
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
    if (searchTerm) setSearchParams({ search: searchTerm });
    else setSearchParams({});
  };

  const handleToggleWishlist = async (product) => {
    if (!user) return;
    const existing = wishlists.find(w => w.productId === product.id);
    if (existing) {
      await fetch(`https://e-commerce-zjcq.onrender.com/wishlists/${existing.id}`, { method: 'DELETE' });
      setWishlists(wishlists.filter(w => w.id !== existing.id));
    } else {
      const res = await fetch('https://e-commerce-zjcq.onrender.com/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, product }),
      });
      const data = await res.json();
      setWishlists([...wishlists, data]);
      toast.success(`${product.title} added to Wishlist!`);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) return;
    const res = await fetch(`https://e-commerce-zjcq.onrender.com/carts?userId=${user.id}&productId=${product.id}`);
    const existing = await res.json();
    if (existing.length > 0) {
      toast.error('Product is already in your cart!');
    } else {
      await fetch('https://e-commerce-zjcq.onrender.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1, product }),
      });
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.title} added to Cart!`);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = categoryId ? p.category === categoryId : true;
        let matchesSearch = false;
        if (!searchTerm) {
          matchesSearch = true;
        } else {
          const term = searchTerm.toLowerCase().trim();
          if (p.title.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)) matchesSearch = true;
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

  // Scroll to top of product grid when page changes
  const goToPage = (newPage) => {
    setCurrentPage(newPage);
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ padding: '1.5rem var(--page-px)' }}>

      {/* Search bar */}
      <div
        className="mb-3 pb-3 border-bottom"
        style={{ borderColor: 'var(--border-color) !important' }}
      >
        <form onSubmit={handleApplySearch}>
          <div className="d-flex position-relative shadow-sm rounded-pill overflow-hidden">
            <button
              type="submit"
              className="btn position-absolute start-0 top-0 h-100 border-0"
              style={{ color: 'var(--text-secondary)', zIndex: 10, padding: '0 0.75rem' }}
            >
              <SearchIcon size={18} />
            </button>
            <input
              type="text"
              className="form-control border-0 py-2"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.8rem', fontSize: 'clamp(0.82rem, 1vw, 0.95rem)' }}
            />
          </div>
        </form>
      </div>

      {/* Page title */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="section-heading m-0">{categoryId || 'All Products'}</h2>
        <span className="section-subtext">{filteredProducts.length} Results</span>
      </div>

      <div className="row g-3 g-lg-4">

        {/* Filters sidebar — sticky so it stays visible while scrolling */}
        <div className="col-12 col-lg-3 col-xl-2">
          <div
            className="card shadow-sm border-0 rounded-4 p-3"
            style={{
              position: 'sticky',
              top: 'clamp(70px, 10vh, 90px)',
              maxHeight: 'calc(100vh - clamp(80px, 12vh, 110px))',
              overflowY: 'auto',
            }}
          >
            <h3 className="fw-bold mb-3" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }}>Filters</h3>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary mb-1" style={{ fontSize: 'clamp(0.72rem, 0.9vw, 0.85rem)' }}>
                Sort By
              </label>
              <select
                className="form-select border-0"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ fontSize: 'clamp(0.75rem, 0.9vw, 0.88rem)' }}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            {[
              { label: 'Min Price', index: 0 },
              { label: 'Max Price', index: 1 },
            ].map(({ label, index }) => (
              <div className="mb-3" key={label}>
                <label
                  className="form-label fw-semibold text-secondary mb-1 w-100 d-flex justify-content-between"
                  style={{ fontSize: 'clamp(0.72rem, 0.9vw, 0.85rem)' }}
                >
                  <span>{label}</span>
                  <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>${priceRange[index]}</span>
                </label>
                <input
                  type="range"
                  className="form-range w-100"
                  min="0" max="300" step="5"
                  value={priceRange[index]}
                  onChange={e => handlePriceChange(index, e.target.value)}
                />
              </div>
            ))}

            {categoryId && (
              <div className="mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                <Link to="/products" className="btn btn-outline-primary w-100 fw-medium" style={{ fontSize: 'clamp(0.72rem, 0.9vw, 0.85rem)' }}>
                  Clear Category
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className="col-12 col-lg-9 col-xl-10">
          {isLoading ? (
            <div className="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-xl-3 mb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="col" key={i}>
                  <div className="card shadow-sm border-0 rounded-4 p-3 skeleton" style={{ height: '350px' }}></div>
                </div>
              ))}
            </div>
          ) : currentProducts.length > 0 ? (
            <>
              {/* Anchor element: scroll target for pagination */}
              <div ref={productsTopRef} style={{ scrollMarginTop: 'clamp(70px, 10vh, 90px)' }} />
              <div className="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-xl-3 mb-4">
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
                <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className="btn btn-primary d-flex align-items-center gap-1"
                    style={{ borderRadius: '25px', fontSize: 'clamp(0.75rem, 0.9vw, 0.88rem)', padding: '0.4rem 1rem' }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span className="fw-bold text-secondary" style={{ fontSize: 'clamp(0.8rem, 0.9vw, 0.9rem)' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className="btn btn-primary d-flex align-items-center gap-1"
                    style={{ borderRadius: '25px', fontSize: 'clamp(0.75rem, 0.9vw, 0.88rem)', padding: '0.4rem 1rem' }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <h3 className="fw-bold mb-2" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>No Products Found</h3>
              <p className="text-secondary mb-4" style={{ fontSize: 'clamp(0.82rem, 1vw, 0.95rem)' }}>
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setPriceRange([0, 300]); setSort('default'); }}
                className="btn btn-primary px-4 fw-medium"
              >
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
