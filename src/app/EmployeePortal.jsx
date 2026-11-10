import { ArrowLeft, ArrowRight, CalendarDays, CircleDollarSign, ShieldCheck, UsersRound } from 'lucide-react'
import BrandLogo from '../components/BrandLogo.jsx'
import OperationsCenter from '../features/operations/OperationsCenter.jsx'

export default function EmployeePortal() {
  return <main className="employee-portal">
    <header className="employee-header"><a href="/" aria-label="Return to customer storefront"><BrandLogo /></a><span className="workspace-tag"><ShieldCheck size={14} /> SEPARATE TEAM WORKSPACE · DEMO</span><a className="store-return" href="/"><ArrowLeft size={14} /> Customer storefront</a></header>
    <section className="employee-welcome"><div className="welcome-copy"><div className="eyebrow"><span /> PEOPLE & OPERATIONS</div><h1>A calmer way<br />to run the <em>workday.</em></h1><p>A separate operations space for attendance, payroll preparation, orders, and inventory. Built to keep internal work out of the customer shopping journey.</p><div className="portal-actions"><a href="#team"><UsersRound size={15} /> Open team desk</a><a href="#team"><CircleDollarSign size={15} /> Review payroll <ArrowRight size={14} /></a></div></div><div className="welcome-side"><span className="welcome-icon"><CalendarDays size={24} /></span><small>DEMO WORKSPACE</small><strong>People first.<br />Operations in sync.</strong><p>Sample employees and business figures only.</p><div className="welcome-side-foot"><span><i /> Customer site is separate</span><span>Independent concept · demo data only</span></div></div></section>
    <OperationsCenter />
    <footer className="employee-footer"><BrandLogo footer /><span>Private staff data requires secure sign-in and role-based access before real use.</span><a href="/">Return to customer site <ArrowRight size={13} /></a></footer>
  </main>
}
