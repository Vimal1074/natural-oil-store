import { useState } from 'react'
import { ArrowUpRight, BadgeIndianRupee, Boxes, CalendarCheck2, ChartNoAxesCombined, CircleDollarSign, Download, UsersRound } from 'lucide-react'

const starterTeam = [
  { id: 1, name: 'Asha Kumar', role: 'Packing lead', initials: 'AK', attendance: 'Present', checkIn: '08:54', salary: 24500, paid: false },
  { id: 2, name: 'Ravi Prakash', role: 'Quality assistant', initials: 'RP', attendance: 'Present', checkIn: '09:02', salary: 22800, paid: false },
  { id: 3, name: 'Meena Raj', role: 'Dispatch coordinator', initials: 'MR', attendance: 'Leave', checkIn: '—', salary: 26400, paid: false },
  { id: 4, name: 'Arun Das', role: 'Warehouse associate', initials: 'AD', attendance: 'Present', checkIn: '09:11', salary: 21800, paid: false },
]

const attendanceOptions = ['Present', 'Leave', 'Absent']

function formatRupees(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function OperationsCenter() {
  const [team, setTeam] = useState(starterTeam)
  const [payrollReady, setPayrollReady] = useState(false)

  function cycleAttendance(id) {
    setTeam((current) => current.map((member) => {
      if (member.id !== id) return member
      const next = (attendanceOptions.indexOf(member.attendance) + 1) % attendanceOptions.length
      return { ...member, attendance: attendanceOptions[next], checkIn: attendanceOptions[next] === 'Present' ? '09:00' : '—' }
    }))
  }

  return (
    <section className="operations-section" id="business">
      <div className="operations-wrap">
        <div className="section-heading ops-heading">
          <div><div className="eyebrow"><span /> NATURAL OIL · TEAM WORKSPACE · DEMO DATA</div><h2>One clearer view of the business.</h2></div>
          <span className="demo-status"><i /> Live prototype · Sample figures</span>
        </div>

        <div className="metric-grid">
          <article className="metric-card"><span className="metric-icon green"><CircleDollarSign size={19} /></span><small>Gross sales · this month</small><strong>₹8,42,650</strong><em><ArrowUpRight size={13} /> 12.8% vs last month</em></article>
          <article className="metric-card"><span className="metric-icon amber"><ShoppingCartIcon /></span><small>Orders to fulfill</small><strong>128</strong><em>18 need attention today</em></article>
          <article className="metric-card"><span className="metric-icon blue"><Boxes size={19} /></span><small>Stock alerts</small><strong>05</strong><em>Across 3 sample products</em></article>
          <article className="metric-card"><span className="metric-icon lilac"><UsersRound size={19} /></span><small>Team attendance today</small><strong>{team.filter((member) => member.attendance === 'Present').length} / {team.length}</strong><em>Demo employee records</em></article>
        </div>

        <div className="ops-panels">
          <article className="ops-panel revenue-panel">
            <div className="panel-heading"><div><span className="panel-kicker">SALES OVERVIEW</span><h3>Revenue, at a glance</h3></div><button className="period-button">Last 7 days <span>⌄</span></button></div>
            <div className="revenue-total"><strong>₹2,18,400</strong><span>Illustrative weekly revenue</span></div>
            <div className="chart-bars" aria-label="Illustrative revenue over seven days">{[['M',44],['T',63],['W',51],['T',78],['F',58],['S',94],['S',71]].map(([day,height], index) => <div className="chart-day" key={`${day}-${index}`}><span className="bar-value" style={{height:`${height}%`}} /><small>{day}</small></div>)}</div>
            <div className="chart-foot"><span><i /> Revenue by day</span><button>View report <ArrowUpRight size={13} /></button></div>
          </article>
          <article className="ops-panel workflow-panel">
            <div className="panel-heading"><div><span className="panel-kicker">TODAY'S WORKFLOW</span><h3>Keep the day moving</h3></div><CalendarCheck2 size={18} /></div>
            <div className="workflow-row"><span className="workflow-count green-bg">18</span><div><strong>Orders to pack</strong><small>Ready for the dispatch team</small></div><span className="priority-dot" /></div>
            <div className="workflow-row"><span className="workflow-count gold-bg">05</span><div><strong>Stock needs a look</strong><small>Low inventory demo alert</small></div><ArrowUpRight size={15} /></div>
            <div className="workflow-row"><span className="workflow-count blue-bg">03</span><div><strong>Customer questions</strong><small>Sample support queue</small></div><ArrowUpRight size={15} /></div>
            <div className="workflow-note">A connected system could bring order, stock, support, and staff workflows together here.</div>
          </article>
        </div>

        <div className="team-panel" id="team">
          <div className="team-heading">
            <div><div className="panel-kicker">PEOPLE OPERATIONS · SAMPLE RECORDS</div><h3>Team attendance & payroll</h3><p>A dedicated employee workspace for daily attendance and monthly salary preparation.</p></div>
            <div className="team-actions"><button className="secondary-button"><Download size={15} /> Export demo report</button><button className="primary-small" onClick={() => setPayrollReady((ready) => !ready)}><BadgeIndianRupee size={16} /> {payrollReady ? 'Payroll prepared · demo' : 'Prepare payroll'}</button></div>
          </div>
          <div className="privacy-note"><span>i</span> Employee names, attendance, and salary figures below are fictional sample data. No real staff records or payments are connected.</div>
          <div className="team-table-scroll"><table className="team-table"><thead><tr><th>EMPLOYEE</th><th>TODAY'S ATTENDANCE</th><th>CHECK-IN</th><th>MONTHLY SALARY</th><th>PAYROLL STATUS</th><th>UPDATE</th></tr></thead><tbody>{team.map((member) => <tr key={member.id}>
            <td><div className="employee-cell"><span className="employee-avatar">{member.initials}</span><span><strong>{member.name}</strong><small>{member.role}</small></span></div></td>
            <td><span className={`attendance-pill ${member.attendance.toLowerCase()}`}><i />{member.attendance}</span></td><td className="checkin-cell">{member.checkIn}</td><td className="salary-cell">{formatRupees(member.salary)}</td><td><span className={`payroll-pill ${payrollReady ? 'ready' : ''}`}>{payrollReady ? 'Ready · demo' : 'Draft'}</span></td><td><button className="table-action" onClick={() => cycleAttendance(member.id)}>Change status</button></td>
          </tr>)}</tbody></table></div>
          <div className="payroll-summary"><div><span>MONTHLY PAYROLL TOTAL</span><strong>{formatRupees(team.reduce((total, member) => total + member.salary, 0))}</strong><small>Based on 4 fictional demo employees</small></div><div className="payroll-due"><span>Next step</span><strong>{payrollReady ? 'Review sample payroll' : 'Confirm attendance before payroll'}</strong></div></div>
        </div>
        <div className="operations-footer"><span><ChartNoAxesCombined size={15} /> DEMONSTRATION DASHBOARD</span><span>Illustrative analytics only · No business data is connected</span></div>
      </div>
    </section>
  )
}

function ShoppingCartIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
}
