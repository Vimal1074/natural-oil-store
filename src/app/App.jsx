import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Check, GitCompareArrows, Heart, Leaf, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
import BrandLogo from '../components/BrandLogo.jsx'
import SmartFeatures from '../features/smart/SmartFeatures.jsx'
import './details.css'
import './godmode.css'
import './cart.css'
import './pricing.css'

const referenceProducts = [
  { id: 1, name: 'Virgin Coconut Oil', officialName: 'Virgin Cold-Pressed Coconut Oil', detail: 'Sample pack sizes: 200 ml, 500 ml, 1 L, and 5 L', description: 'Concept listing for virgin, unrefined coconut oil. Replace this draft with verified ingredients, uses, and care instructions for your product before publishing.', size: 'Sample sizes', price: null, category: 'Coconut', color: 'cream', tag: 'Sample product', variants: '200 ml · 500 ml · 1 litre · 5 litres' },
  { id: 2, name: 'Cold Pressed Castor Oil', officialName: 'Cold-Pressed Castor Oil', detail: 'Sample pack sizes: 200 ml and 500 ml', description: 'Concept personal-care listing. Add verified product details, usage instructions, and approved claims before publishing.', size: 'Sample sizes', price: null, category: 'Castor', color: 'rose', tag: 'Sample product', variants: '200 ml · 500 ml' },
  { id: 3, name: 'Cold Pressed Groundnut Oil', officialName: 'Cold-Pressed Groundnut Oil', detail: 'Sample pack sizes: 500 ml, 1 L, 5 L, and 15 L', description: 'Wood-pressed groundnut oil concept listing for cooking. Add verified production, ingredient, and care details before publishing.', size: 'Sample sizes', price: null, category: 'Groundnut', color: 'peach', tag: 'Sample product', variants: '500 ml · 1 litre · 5 litres · 15 litres' },
  { id: 4, name: 'Cold Pressed Sesame Oil', officialName: 'Cold-Pressed Sesame Oil', detail: 'Sample pack sizes: 500 ml, 1 L, and 5 L', description: 'Sesame, gingelly, or til oil concept listing. Confirm ingredients, pack options, and approved uses before publishing.', size: 'Sample sizes', price: null, category: 'Sesame', color: 'gold', tag: 'Sample product', variants: '500 ml · 1 litre · 5 litres' },
  { id: 5, name: 'Cold Pressed Sunflower Oil', officialName: 'Cold-Pressed Sunflower Oil', detail: 'Sample pack sizes: 1 L and 5 L', description: 'Sunflower oil concept listing. Add verified ingredients, production details, and approved uses before publishing.', size: 'Sample sizes', price: null, category: 'Sunflower', color: 'gold', tag: 'Sample product', variants: '1 litre · 5 litres' },
  { id: 6, name: 'Cold Pressed Mustard Oil', officialName: 'Cold-Pressed Mustard Oil', detail: 'Sample pack sizes: 1 L and 5 L', description: 'Mustard oil concept listing. Add verified ingredients, production details, and approved uses before publishing.', size: 'Sample sizes', price: null, category: 'Mustard', color: 'peach', tag: 'Sample product', variants: '1 litre · 5 litres' },
  { id: 7, name: 'Groundnut + Sesame Oil Combo', officialName: 'Groundnut and Sesame Oil Combo', detail: 'Sample pack: 1 L groundnut + 1 L sesame', description: 'Concept combo containing one sample 1-litre groundnut pack and one sample 1-litre sesame pack. Confirm contents before publishing.', size: 'Sample combo', price: null, category: 'Combos', color: 'peach', tag: 'Sample product', variants: '1 × 1 litre groundnut oil · 1 × 1 litre sesame oil' },
  { id: 8, name: 'Coconut + Sesame + Groundnut Combo', officialName: 'Coconut, Sesame, and Groundnut Oil Combo', detail: 'Sample pack: 1 L each of coconut, sesame, and groundnut', description: 'Concept combo containing one sample 1-litre pack of coconut, sesame, and groundnut oil. Confirm contents before publishing.', size: 'Sample combo', price: null, category: 'Combos', color: 'gold', tag: 'Sample product', variants: '1 litre coconut · 1 litre sesame · 1 litre groundnut' },
  { id: 9, name: '7 L Coconut + Sesame + Groundnut Combo', officialName: '7 L Coconut, Sesame, and Groundnut Oil Combo', detail: 'Sample pack: 5 L coconut + 1 L sesame + 1 L groundnut', description: 'Concept combo containing sample 5-litre coconut oil and 1-litre sesame and groundnut oil packs. Confirm contents before publishing.', size: 'Sample combo', price: null, category: 'Combos', color: 'cream', tag: 'Sample product', variants: '5 litres coconut · 1 litre sesame · 1 litre groundnut' },
  { id: 10, name: 'Castor + Coconut Oil Combo', officialName: 'Castor and Coconut Oil Combo', detail: 'Sample pack: 200 ml castor + 200 ml coconut', description: 'Concept personal-care combo containing sample 200 ml castor and coconut oil packs. Confirm contents and product instructions before publishing.', size: 'Sample combo', price: null, category: 'Combos', color: 'rose', tag: 'Sample product', variants: '200 ml castor oil · 200 ml coconut oil' },
]
const categories = ['All products', 'Groundnut', 'Sesame', 'Coconut', 'Castor', 'Sunflower', 'Mustard', 'Combos']

function Bottle({ color }) {
  return <div aria-hidden="true" className={`bottle-scene ${color}`}><div className="bottle"><i /><b /></div><span className="bottle-shadow" /></div>
}

function getVariantOptions(product) {
  if (product.variantRecords?.length) {
    return product.variantRecords.map((variant) => ({ id: variant.id, label: variant.size_label }))
  }
  return product.variants.split(' · ').filter(Boolean).map((label) => ({ id: label, label }))
}

function App() {
  const [category, setCategory] = useState('All products')
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutReviewed, setCheckoutReviewed] = useState(false)
  const [checkoutDetails, setCheckoutDetails] = useState({ fullName: '', phone: '', address: '', city: '', state: '', postalCode: '' })
  const [saved, setSaved] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [productQuery, setProductQuery] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [compareIds, setCompareIds] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState(referenceProducts)
  const [catalogConnected, setCatalogConnected] = useState(false)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.every((item) => Number.isFinite(item.unitPrice))
    ? cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
    : null
  const cartContainsDemoPrices = cartItems.some((item) => item.isDemoPrice)
  const selectedVariantRecord = selectedProduct?.variantRecords?.find((variant) => variant.id === selectedVariant)
  const selectedVariantPrice = selectedVariantRecord?.price_inr ?? selectedProduct?.price ?? null

  useEffect(() => {
    let active = true
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

    async function loadCatalog() {
      try {
        const productResponse = await fetch(`${apiBase}/api/catalog/products`)
        if (!productResponse.ok) throw new Error('Catalog API is unavailable')
        const apiProducts = await productResponse.json()
        if (!active) return

        const mergedProducts = apiProducts.map((apiProduct, index) => {
          const variantRecords = (apiProduct.product_variants || []).map((variant) => ({
            ...variant,
            price_inr: Number(variant.price_inr),
          }))
          const variantPrice = variantRecords.length ? Math.min(...variantRecords.map((variant) => variant.price_inr)) : null
          const variantLabels = variantRecords.map((variant) => variant.size_label)
          const reference = referenceProducts.find((product) => product.name === apiProduct.name)
          if (!reference) {
            return {
              id: apiProduct.id,
              slug: apiProduct.slug,
              sortOrder: 100 + index,
              name: apiProduct.name,
              officialName: apiProduct.name,
              description: apiProduct.description || '',
              size: variantLabels.length ? `${variantLabels.length} pack option${variantLabels.length === 1 ? '' : 's'}` : 'Pack details pending',
              detail: variantLabels.length ? `Available packs: ${variantLabels.join(', ')}` : 'Pack sizes pending',
              price: variantPrice,
              category: apiProduct.categories?.name || 'Other',
              color: 'cream',
              tag: 'Demo catalog',
              variants: variantLabels.join(' · '),
              variantRecords,
              source: null,
            }
          }
          return {
            ...reference,
            id: apiProduct.id,
            slug: apiProduct.slug,
            sortOrder: reference.id,
            description: apiProduct.description || reference.description,
            category: apiProduct.categories?.name || reference.category,
            detail: variantLabels.length ? `Available packs: ${variantLabels.join(', ')}` : reference.detail,
            size: variantLabels.length ? `${variantLabels.length} pack option${variantLabels.length === 1 ? '' : 's'}` : reference.size,
            price: variantPrice,
            variants: variantLabels.length ? variantLabels.join(' · ') : reference.variants,
            variantRecords,
          }
        })

        setProducts(mergedProducts)
        setCatalogConnected(true)
      } catch {
        if (active) setCatalogConnected(false)
      }
    }

    loadCatalog()
    return () => { active = false }
  }, [])

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All products' || product.category === category
    const text = `${product.name} ${product.officialName} ${product.category}`.toLowerCase()
    return matchesCategory && text.includes(productQuery.toLowerCase().trim()) && (!savedOnly || saved.includes(product.id))
  }).sort((a, b) => sortBy === 'price-low' ? (a.price ?? Infinity) - (b.price ?? Infinity) : sortBy === 'price-high' ? (b.price ?? -Infinity) - (a.price ?? -Infinity) : sortBy === 'name' ? a.name.localeCompare(b.name) : a.sortOrder - b.sortOrder), [products, category, productQuery, savedOnly, saved, sortBy])

  function toggleSaved(id) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function toggleCompare(id) {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current)
  }

  function addToCart(product, variant) {
    const productVariant = product.variantRecords?.find((item) => item.id === variant)
    const variantLabel = productVariant?.size_label || variant
    const unitPrice = productVariant?.price_inr ?? null
    const key = `${product.id}:${productVariant?.id || variantLabel}`
    setCartItems((current) => {
      const existing = current.find((item) => item.key === key)
      return existing
        ? current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { key, productId: product.id, name: product.name, variant: variantLabel, unitPrice, isDemoPrice: product.slug !== 'virgin-coconut-oil', quantity: 1 }]
    })
    setSelectedProduct(null)
    setSelectedVariant('')
    setCartOpen(true)
  }

  function changeCartQuantity(key, amount) {
    setCartItems((current) => current
      .map((item) => item.key === key ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0))
  }

  return (
    <main>
      <div className="announcement">Natural Oil <span>·</span> Oils for everyday living</div>
      <header className="site-header">
        <button className="icon-button mobile-menu" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}><Menu size={21} /></button>
        <a className="brand-link" href="#top" aria-label="Natural Oil home"><BrandLogo /></a>
        <nav className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a onClick={() => setMobileMenuOpen(false)} href="#shop">Catalog</a><a onClick={() => setMobileMenuOpen(false)} href="#smart">Smart features</a><a onClick={() => setMobileMenuOpen(false)} href="#story">About this concept</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-button" aria-label={searchOpen ? 'Close product search' : 'Search products'} aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); setProductQuery('') }}><Search size={19} /></button>
          <button className={`wishlist-button ${savedOnly ? 'selected' : ''}`} onClick={() => { setSavedOnly((only) => !only); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}><Heart size={16} /><span>Saved</span><b>{saved.length}</b></button>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${cartCount} items`}><ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> THE NEXT-GENERATION OIL STORE</div>
          <h1>Good products.<br />A <em>smarter business.</em></h1>
          <p>Discover products, compare pack sizes, check a demo batch, and make repeat shopping easier. Operations live in a separate team portal.</p>
          <div className="hero-ctas"><a className="primary-button" href="#shop">Explore the catalog <ArrowRight size={17} /></a><a className="hero-secondary" href="#smart">See smart features <ArrowDown size={15} /></a></div>
          <div className="hero-note"><span className="note-icon"><Check size={15} /></span> Independent concept <i /> Demo data is labelled</div>
        </div>
        <div className="hero-art" aria-label="Original illustration of a cooking oil tin">
          <div className="sun-disc" /><div className="hero-leaf leaf-one">✳</div><div className="hero-leaf leaf-two">✳</div>
          <div className="hero-bottle"><span className="cap" /><span className="neck" /><span className="body"><span className="label-top">NATURAL OIL</span><span className="label-line" /><span className="label-name">OIL<br />COLLECTION</span><span className="label-volume">SAMPLE · CONCEPT</span></span></div>
          <div className="hero-caption">A slower press.<br /><strong>A fuller flavour.</strong></div>
          <div className="hero-stamp">MADE WITH<br />CARE <Leaf size={15} /></div>
        </div>
        <div className="hero-bottom"><span>01 / EVERYDAY ESSENTIALS</span><a href="#shop">SCROLL TO DISCOVER <ArrowDown size={14} /></a></div>
      </section>

      <section className="trust-strip" id="care">
        <div><span className="trust-icon">✳</span><p>Smarter product discovery</p></div><div><span className="trust-icon">⌁</span><p>Sample batch information</p></div><div><span className="trust-icon">♡</span><p>Customer-first service</p></div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading"><div><div className="eyebrow">NATURAL OIL · DEMO CATALOG</div><h2>Explore the product range.</h2></div></div>
        <div className="shop-tools"><div className="filters" role="group" aria-label="Filter products by type">{categories.map((item) => <button key={item} className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="catalog-controls">{savedOnly && <button className="saved-filter" onClick={() => setSavedOnly(false)}>Saved for later · clear <X size={12} /></button>}{searchOpen && <label className="catalog-search"><Search size={15} /><input autoFocus value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="Search oils and combos" aria-label="Search oils and combos" /></label>}<label className="sort-control"><span>Sort</span><select aria-label="Sort product list" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name A to Z</option></select></label></div><span className="result-count">{catalogConnected ? 'Supabase catalog' : 'Demo snapshot'} · {visibleProducts.length} products · Random demo prices shown for all oils except the Coconut Oil prices you supplied; demo values are not selling prices.</span></div>
        {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}>
          <div className="product-visual"><span className="product-tag">{product.tag}</span><button className={`save-button ${saved.includes(product.id) ? 'is-saved' : ''}`} onClick={() => toggleSaved(product.id)} aria-label={saved.includes(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}><Heart size={17} fill={saved.includes(product.id) ? 'currentColor' : 'none'} /></button><Bottle color={product.color} /></div>
          <div className="product-info"><div><h3>{product.name}</h3><p>{product.detail}</p><div className="card-links"><button className="details-link" onClick={() => { setSelectedProduct(product); setSelectedVariant('') }}>Product details <ArrowRight size={13} /></button><button className={`compare-toggle ${compareIds.includes(product.id) ? 'is-compared' : ''}`} onClick={() => toggleCompare(product.id)} disabled={!compareIds.includes(product.id) && compareIds.length >= 3} aria-label={compareIds.includes(product.id) ? `Remove ${product.name} from comparison` : `Compare ${product.name}`}><GitCompareArrows size={13} />{compareIds.includes(product.id) ? 'Added' : 'Compare'}</button></div></div><div className="product-buy"><span className="product-size-count">{product.size}</span><button className="choose-pack" onClick={() => { setSelectedProduct(product); setSelectedVariant('') }}>Choose</button><div className="product-price-options" aria-label={`Prices for ${product.name}`}>{product.variantRecords?.length ? product.variantRecords.map((variant) => <div className="product-price-option" key={variant.id}><span>{variant.size_label}</span><strong>₹{variant.price_inr.toLocaleString('en-IN')}</strong><small>{product.slug === 'virgin-coconut-oil' ? 'SUPPLIED' : 'DEMO'}</small></div>) : <span className="price-not-set">Price not set yet</span>}</div></div></div>
        </article>)}</div> : <div className="empty-catalog">No products match that search. Try a different name or category.</div>}
        {compareIds.length > 0 && <div className="compare-dock"><div><GitCompareArrows size={17} /><strong>{compareIds.length} of 3 products selected</strong><span>Compare packs, types, and descriptions side by side.</span></div><button disabled={compareIds.length < 2} onClick={() => setCompareOpen(true)}>Compare products <ArrowRight size={15} /></button><button className="clear-compare" onClick={() => setCompareIds([])} aria-label="Clear comparison">Clear</button></div>}
        <div className="note-banner"><div className="sparkle"><Sparkles size={20} /></div><div><strong>Not sure where to start?</strong><span>Tell us what you love to cook. We’ll help you compare the catalog.</span></div><a href="#smart">Try the product guide <ArrowRight size={16} /></a></div>
      </section>

      <SmartFeatures />

      <section className="story-section" id="story"><div className="story-art"><div className="story-orb"><BrandLogo /></div><span>INDEPENDENT WEBSITE STUDY</span></div><div className="story-copy"><div className="eyebrow">ABOUT THIS DEMO</div><h2>Study the range.<br /><em>Build something better.</em></h2><p>Natural Oil is an independent store concept. Sample products and pack sizes are placeholders; add your verified product information before launch.</p></div></section>
      <footer><a className="brand-link" href="#top"><BrandLogo footer /></a><span>Independent demonstration · Independent store concept</span><a className="employee-footer-link" href="/employee">Employee & operations portal <ArrowRight size={14} /></a><span>Demo catalog · sample data</span></footer>
      {selectedProduct && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null) }}>
        <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><X size={19} /></button>
          <div className="modal-product-art"><Bottle color={selectedProduct.color} /></div>
          <div className="modal-product-copy"><div className="eyebrow">NATURAL OIL PRODUCT · {selectedProduct.category.toUpperCase()}</div><h2 id="product-modal-title">{selectedProduct.officialName}</h2><p className="modal-description">{selectedProduct.description}</p>
            <div className="sample-notice"><strong>{selectedProduct.variantRecords?.length ? (selectedProduct.slug === 'virgin-coconut-oil' ? 'Prices supplied by you' : 'Random demo prices') : 'Price not set yet'}</strong><span>{selectedProduct.variantRecords?.length ? (selectedProduct.slug === 'virgin-coconut-oil' ? 'These are the Coconut Oil prices you provided.' : 'These example values are random and are not real selling prices.') : 'Prices for this product have not been added yet.'}</span></div>
            <div className="modal-pairing"><label htmlFor="pack-size">{selectedProduct.variantRecords?.length ? 'Available pack sizes' : 'Sample pack sizes'}</label><select id="pack-size" value={selectedVariant} onChange={(event) => setSelectedVariant(event.target.value)}><option value="">Choose a pack size</option>{getVariantOptions(selectedProduct).map((variant) => <option key={variant.id} value={variant.id}>{variant.label}</option>)}</select></div>
            <div className="modal-purchase"><div><span>Selected pack price</span><strong>{selectedVariantRecord ? (selectedProduct.slug === 'virgin-coconut-oil' ? '₹' : 'Demo · ₹') + selectedVariantRecord.price_inr.toLocaleString('en-IN') : selectedProduct.variantRecords?.length ? "Choose a pack" : selectedVariantPrice == null ? "Price not set" : "From ₹" + selectedVariantPrice}</strong></div></div>
            <button className="modal-add-button" disabled={!selectedVariant} onClick={() => addToCart(selectedProduct, selectedVariant)}>Add selected pack to demo bag <ShoppingBag size={16} /></button>
          </div>
        </section>
      </div>}
      {cartOpen && <div className="cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="cart-heading"><div><span className="eyebrow">YOUR DEMO BAG</span><h2 id="cart-title">Shopping bag <small>({cartCount})</small></h2></div><button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><X size={19} /></button></div>
          {cartItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={26} /><strong>Your bag is empty</strong><p>Choose a product and pack to add it here.</p><button onClick={() => { setCartOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse the catalog</button></div> : checkoutOpen ? <>
            <div className="checkout-summary"><strong>Order preview</strong><span>{cartTotal == null ? "Total pending prices" : `${cartContainsDemoPrices ? 'Demo subtotal' : 'Subtotal'} ₹${cartTotal.toLocaleString("en-IN")}`}</span></div>
            <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setCheckoutReviewed(true) }}>
              <h3>Contact and delivery</h3>
              <label>Full name<input required name="fullName" autoComplete="name" value={checkoutDetails.fullName} onChange={(event) => { setCheckoutReviewed(false); setCheckoutDetails((current) => ({ ...current, fullName: event.target.value })) }} /></label>
              <label>Phone number<input required name="phone" type="tel" autoComplete="tel" inputMode="tel" value={checkoutDetails.phone} onChange={(event) => { setCheckoutReviewed(false); setCheckoutDetails((current) => ({ ...current, phone: event.target.value })) }} /></label>
              <label>Delivery address<textarea required name="address" autoComplete="street-address" rows="2" value={checkoutDetails.address} onChange={(event) => { setCheckoutReviewed(false); setCheckoutDetails((current) => ({ ...current, address: event.target.value })) }} /></label>
              <div className="checkout-row"><label>City<input required name="city" autoComplete="address-level2" value={checkoutDetails.city} onChange={(event) => { setCheckoutReviewed(false); setCheckoutDetails((current) => ({ ...current, city: event.target.value })) }} /></label><label>State<input required name="state" autoComplete="address-level1" value={checkoutDetails.state} onChange={(event) => { setCheckoutReviewed(false); setCheckoutDetails((current) => ({ ...current, state: event.target.value })) }} /></label></div>
              <label>PIN code<input required name="postalCode" autoComplete="postal-code" inputMode="numeric" maxLength={6} value={checkoutDetails.postalCode} onChange={(event) => { setCheckoutReviewed(false); setCheckoutDetails((current) => ({ ...current, postalCode: event.target.value.replace(/\D/g, '') })) }} /></label>
              <button className="cart-checkout" type="submit">Review delivery details</button>
            </form>
            {checkoutReviewed && <div className="checkout-reviewed" role="status"><strong>Delivery details reviewed</strong><span>Demo preview only. Nothing has been saved or ordered.</span></div>}
            <div className="cart-demo-note"><strong>Payment is not ready</strong><span>Some prices are random demo examples. Checkout is only a preview; don’t enter real personal details here.</span></div>
            <button className="cart-continue secondary" onClick={() => { setCheckoutOpen(false); setCheckoutReviewed(false) }}>Back to bag</button>
          </> : <>
            <div className="cart-items">{cartItems.map((item) => <article className="cart-item" key={item.key}>
              <div className="cart-item-art"><Bottle color={products.find((product) => product.id === item.productId)?.color || 'cream'} /></div>
              <div className="cart-item-copy"><strong>{item.name}</strong><span>{item.variant}</span><span className="cart-item-price">{item.unitPrice == null ? "Price not set" : `${item.isDemoPrice ? 'Demo · ' : ''}₹${(item.unitPrice * item.quantity).toLocaleString("en-IN")}`}</span><div className="cart-quantity"><button onClick={() => changeCartQuantity(item.key, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => changeCartQuantity(item.key, 1)} aria-label={`Add one ${item.name}`}>+</button><button className="cart-remove" onClick={() => setCartItems((current) => current.filter((cartItem) => cartItem.key !== item.key))}>Remove</button></div></div>
            </article>)}</div>
            <div className="cart-demo-note"><strong>Demo bag only</strong><span>Some pack prices are random examples, not selling prices. Checkout, inventory, and payment aren’t connected.</span></div>
            <button className="cart-checkout" onClick={() => { setCheckoutOpen(true); setCheckoutReviewed(false) }}>Continue to checkout</button>
            <button className="cart-continue secondary" onClick={() => setCartOpen(false)}>Continue browsing</button>
          </>}
        </aside>
      </div>}
      {compareOpen && <div className="modal-backdrop compare-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCompareOpen(false) }}><section className="compare-modal" role="dialog" aria-modal="true" aria-labelledby="compare-title"><div className="compare-modal-heading"><div><div className="eyebrow"><span /> SIDE-BY-SIDE PRODUCT GUIDE</div><h2 id="compare-title">Find the right fit for your pantry.</h2></div><button className="modal-close" onClick={() => setCompareOpen(false)} aria-label="Close comparison"><X size={19} /></button></div><div className="compare-table-wrap"><table className="compare-table"><tbody><tr><th>Product</th>{products.filter((product) => compareIds.includes(product.id)).map((product) => <td key={product.id}><strong>{product.name}</strong><small>{product.officialName}</small></td>)}</tr><tr><th>Category</th>{products.filter((product) => compareIds.includes(product.id)).map((product) => <td key={product.id}>{product.category}</td>)}</tr><tr><th>Pack options</th>{products.filter((product) => compareIds.includes(product.id)).map((product) => <td key={product.id}>{product.variants.replaceAll(' · ', ', ')}</td>)}</tr><tr><th>Starting price</th>{products.filter((product) => compareIds.includes(product.id)).map((product) => <td key={product.id}>{product.price == null ? "Price not set" : "₹" + product.price}<small>{product.slug === 'virgin-coconut-oil' ? 'Supplied by you' : 'Random demo example'}</small></td>)}</tr><tr><th>Product notes</th>{products.filter((product) => compareIds.includes(product.id)).map((product) => <td key={product.id}>{product.description}</td>)}</tr></tbody></table></div><p className="compare-disclaimer">Random prices are illustrative examples only, not selling prices. Confirm all details before launch.</p></section></div>}
    </main>
  )
}

export default App
