export default function BrandLogo({ footer = false }) {
  return <span className={footer ? 'brand-lockup footer-lockup' : 'brand-lockup'} aria-label="Natural Oil store concept">
    <span className="custom-brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M28.9 10.7A14.1 14.1 0 1 0 29 29.4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/><path d="M12.2 21.1c3.5-3.6 6.2-3.6 9.8 0 3.5 3.5 6.2 3.5 9.8-.1" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"/><path d="M20 13.7c-1.8 2.7-3.2 4.3-3.2 6a3.2 3.2 0 0 0 6.4 0c0-1.7-1.4-3.3-3.2-6Z" fill="currentColor" opacity=".68"/></svg></span>
    <span className="brand-type"><strong>NATURAL OIL</strong><small>PURE · PRESSED · EVERYDAY</small></span>
  </span>
}
