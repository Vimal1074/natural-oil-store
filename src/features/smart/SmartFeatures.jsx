import { useState } from 'react'
import { ArrowRight, BadgeCheck, Bot, CalendarClock, Check, CircleHelp, Gift, Languages, MapPin, QrCode, Send, Sparkles, Truck } from 'lucide-react'
import './delivery.css'

const sampleBatch = {
  code: 'DEMO-BATCH-026',
  product: 'Groundnut Oil · Sample listing',
  batch: 'BATCH-GN-1101',
  made: '01 Nov 2026',
  bestBefore: '01 Aug 2027',
}

export default function SmartFeatures() {
  const [language, setLanguage] = useState('English')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [batchCode, setBatchCode] = useState('')
  const [batchResult, setBatchResult] = useState(null)
  const [interval, setInterval] = useState('Every 30 days')
  const [subscriptionPaused, setSubscriptionPaused] = useState(false)
  const [pointsRedeemed, setPointsRedeemed] = useState(false)
  const [trackVisible, setTrackVisible] = useState(false)
  const [pinCode, setPinCode] = useState('')
  const [pinMessage, setPinMessage] = useState('')

  function askAssistant(event) {
    event.preventDefault()
    if (!question.trim()) return
    const prompt = question.toLowerCase()
    if (language === 'தமிழ்') {
      setAnswer('இது டெமோ உதவியாளர் பதில். சமையல் பயன்பாடு மற்றும் சுவையை அடிப்படையாகக் கொண்டு எள் எண்ணெய் அல்லது கடலை எண்ணெய் தயாரிப்புகளை ஒப்பிடலாம். தயாரிப்பு லேபிளில் உள்ள தகவலைச் சரிபார்க்கவும்.')
    } else if (/(compare|difference)/.test(prompt) && /sesame|gingelly|til/.test(prompt) && /groundnut|peanut/.test(prompt)) {
      setAnswer('The sesame listing is also described as gingelly or til oil, while the groundnut listing is described as peanut oil. Compare the seller’s current pack options and product labels before choosing; this guide uses reference descriptions only.')
    } else if (/sesame|gingelly|til/.test(prompt)) {
      setAnswer('For a sesame-forward flavour, compare the sesame oil concept listing. It is also known as gingelly or til oil. Confirm the current pack options and product label before publishing.')
    } else if (/coconut|தேங்க/.test(prompt)) {
      setAnswer('The coconut oil concept listing includes sample pack sizes. Confirm the available options and approved uses for your own products before publishing.')
    } else if (/groundnut|peanut|கடலை/.test(prompt)) {
      setAnswer('The groundnut oil listing includes several pack sizes. Compare the pack options and read the seller’s cooking-use description on its linked product page.')
    } else {
      setAnswer('Tell me which oil or cooking use you have in mind. I can help compare the product names and pack options in this demo catalog. Check seller labels and product pages for exact details.')
    }
  }

  function verifyBatch(event) {
    event.preventDefault()
    setBatchResult(batchCode.trim().toUpperCase() === sampleBatch.code ? sampleBatch : { notFound: true })
  }

  function checkPin(event) {
    event.preventDefault()
    setPinMessage(/^\d{6}$/.test(pinCode.trim()) ? 'Demo estimate: 2–4 working days. Live serviceability is not connected.' : 'Enter a valid 6-digit PIN code to see the demo estimate.')
  }

  return (
    <section className="smart-section" id="smart">
      <div className="smart-wrap">
        <div className="section-heading smart-heading"><div><div className="eyebrow"><span /> A STORE THAT DOES MORE</div><h2>Helpful ideas, built into the journey.</h2></div><p>Small technology touches for product confidence, repeat orders, and better service.</p></div>

        <div className="smart-grid">
          <article className="smart-card assistant-card">
            <div className="smart-card-top"><span className="feature-icon mint"><Bot size={20} /></span><span className="prototype-tag">PRODUCT GUIDE · DEMO</span></div>
            <h3>A little help choosing?</h3><p>Ask about oil types or pack options. This local guide gives sample catalog tips; it is not connected to a live AI service.</p>
            <div className="assistant-chat"><div className="chat-avatar"><Sparkles size={14} /></div><div><small>NATURAL OIL GUIDE · DEMO</small><p>{answer || 'Tell me what you like to cook, and I’ll help compare the catalog.'}</p></div></div>
            <form className="assistant-form" onSubmit={askAssistant}><input aria-label="Ask the demo shopping guide" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Try: compare sesame and groundnut"/><button type="submit" aria-label="Ask the product guide">Ask <Send size={14} /></button></form>
            <div className="assistant-foot"><Languages size={14} /><span>Reply language</span><button className={language === 'English' ? 'language-chip selected' : 'language-chip'} onClick={() => setLanguage('English')}>EN</button><button className={language === 'தமிழ்' ? 'language-chip selected' : 'language-chip'} onClick={() => setLanguage('தமிழ்')}>தமிழ்</button><span className="demo-inline">Demo replies · no live AI</span></div>
          </article>

          <article className="smart-card trace-card">
            <div className="smart-card-top"><span className="feature-icon cream-icon"><QrCode size={20} /></span><span className="prototype-tag">SAMPLE BATCH</span></div>
            <h3>Know what’s in the tin.</h3><p>Enter the demo code to preview a batch record. This is not a real authenticity check.</p>
            <form className="trace-form" onSubmit={verifyBatch}><input aria-label="Demo batch code" value={batchCode} onChange={(event) => setBatchCode(event.target.value)} placeholder="Enter a demo batch code"/><button>Check code</button></form>
            {batchResult ? batchResult.notFound ? <div className="trace-result not-found"><CircleHelp size={17} /><span>No matching demo batch. Try DEMO-BATCH-026.</span></div> : <div className="trace-result"><BadgeCheck size={18} /><div><strong>Sample record found</strong><span>{batchResult.product} · {batchResult.batch}</span><small>Made {batchResult.made} · Best before {batchResult.bestBefore}</small></div></div> : <div className="trace-hint"><span className="mini-qr">▦</span><span>Try code: <button onClick={() => setBatchCode(sampleBatch.code)}>{sampleBatch.code}</button></span></div>}
            <div className="micro-disclaimer">Real verification requires manufacturer-registered batches.</div>
          </article>

          <article className="smart-card subscription-card">
            <div className="smart-card-top"><span className="feature-icon lilac-icon"><CalendarClock size={20} /></span><span className="prototype-tag">REORDER PROTOTYPE</span></div>
            <h3>Your pantry, on a rhythm.</h3><p>Set a repeat delivery and pause it whenever plans change.</p>
            <label className="select-label" htmlFor="delivery-interval">Delivery interval</label><select id="delivery-interval" value={interval} onChange={(event) => setInterval(event.target.value)}><option>Every 30 days</option><option>Every 45 days</option><option>Every 60 days</option></select>
            <div className="subscription-next"><span className="calendar-stamp">{subscriptionPaused ? 'Ⅱ' : '↻'}</span><div><small>DEMO SUBSCRIPTION</small><strong>{subscriptionPaused ? 'Delivery paused' : `Next delivery · ${interval}`}</strong></div><button onClick={() => setSubscriptionPaused((paused) => !paused)}>{subscriptionPaused ? 'Resume' : 'Pause'}</button></div>
          </article>

          <article className="smart-card rewards-card">
            <div className="smart-card-top"><span className="feature-icon amber-icon"><Gift size={20} /></span><span className="prototype-tag">LOYALTY DEMO</span></div>
            <h3>A thank-you that adds up.</h3><p>Reward repeat customers and referrals with points they can use later.</p>
            <div className="points-display"><div><small>DEMO REWARDS BALANCE</small><strong>{pointsRedeemed ? '300' : '500'} <span>pts</span></strong></div><div className="points-orbit"><Gift size={21} /></div></div>
            <button className="redeem-button" disabled={pointsRedeemed} onClick={() => setPointsRedeemed(true)}>{pointsRedeemed ? '200 points redeemed · demo' : 'Redeem 200 points'} <ArrowRight size={15} /></button>
            <small className="micro-disclaimer">No payment or real reward is issued.</small>
          </article>

          <article className="smart-card tracking-card">
            <div className="smart-card-top"><span className="feature-icon blue-icon"><Truck size={20} /></span><span className="prototype-tag">ORDER TRACKING</span></div>
            <h3>From order to doorstep.</h3><p>A clear status timeline keeps customers informed at each handoff.</p>
            <div className="tracking-head"><span>DEMO ORDER · OR-2846</span><button onClick={() => setTrackVisible((visible) => !visible)}>{trackVisible ? 'Hide timeline' : 'View timeline'} <ArrowRight size={13} /></button></div>
            {trackVisible && <div className="tracking-timeline"><div className="timeline-step complete"><i><Check size={10} /></i><span><strong>Order confirmed</strong><small>Today · 9:14 AM</small></span></div><div className="timeline-step complete"><i><Check size={10} /></i><span><strong>Being packed</strong><small>Demo status</small></span></div><div className="timeline-step upcoming"><i /><span><strong>With the delivery partner</strong><small>Awaiting dispatch</small></span></div></div>}
            <div className="micro-disclaimer">Illustrative order status only.</div>
          </article>

          <article className="smart-card delivery-card">
            <div className="smart-card-top"><span className="feature-icon mint"><MapPin size={20} /></span><span className="prototype-tag">DELIVERY CHECKER</span></div>
            <div className="delivery-copy"><h3>Check delivery before checkout.</h3><p>Enter your PIN code for a quick delivery estimate before you place an order.</p></div>
            <div className="delivery-action"><form className="delivery-form" onSubmit={checkPin}><input value={pinCode} inputMode="numeric" maxLength={6} onChange={(event) => setPinCode(event.target.value.replace(/\D/g, ''))} aria-label="6-digit delivery PIN code" placeholder="6-digit PIN code"/><button aria-label="Check delivery availability"><ArrowRight size={15} /></button></form>
              {pinMessage && <p className="pin-message" role="status">{pinMessage}</p>}
              <small className="micro-disclaimer">Demo estimate only. Live PIN-level coverage requires courier data.</small></div>
          </article>
        </div>
        <div className="smart-bottom-note"><span><Check size={14} /></span><p>Designed around customer trust: useful product guidance, clear batch records, and transparent order updates.</p><span className="not-medical">Product information only · No medical advice</span></div>
      </div>
    </section>
  )
}
