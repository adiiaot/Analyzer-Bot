# GitHub Issues - Analyzer Dashboard Sprint

Copy these issues into your GitHub repo. Mark them with labels: `design`, `feature`, `enhancement`, `high-priority`.

---

## DESIGN ISSUES (Priority: HIGH)

### Issue 1: Implement Forex Edge Design Theme
```
Title: Implement Forex Edge Design Theme (Dark Mode + Neon Green)
Labels: design, high-priority
Assignee: You
Milestone: v2.0 - Dashboard Redesign

Description:
Apply the new design theme across the entire dashboard based on DASHBOARD_DESIGN_THEME_UPDATED.md.

Changes needed:
- Update Tailwind config with new color palette (neon green #00FF88, dark #0A0E27)
- Update all existing components to use new colors
- Update buttons, cards, forms, badges, tables
- Ensure all hover states and focus states work
- Test on mobile, tablet, desktop

Color palette:
- Background: #0A0E27
- Sidebar: #0F1432
- Card: #1A1F3A
- Border: #2D3561
- Neon Green: #00FF88 (primary accent)
- Text: #FFFFFF, #A0AEC0, #718096
- Alert: #FF3D71 (loss), #FFD700 (warning)

Acceptance criteria:
- [ ] All colors match design spec
- [ ] All components styled correctly
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Accessibility maintained (WCAG AA)
- [ ] No broken UI elements
- [ ] Performance: no layout shifts

Estimated time: 4-5 hours
```

---

### Issue 2: Update Sidebar Navigation
```
Title: Redesign Sidebar with New Theme
Labels: design, enhancement
Assignee: You
Related: #1

Description:
Update sidebar to match Forex Edge design:
- Dark background (#0F1432)
- Proper spacing (12px between items)
- Neon green highlight on active items
- Smooth hover transitions
- Collapse/expand functionality

Add new navigation items:
- Dashboard (existing)
- Trades (existing)
- Analytics (existing)
- Settings (NEW)
- Backtesting (future)
- Risk Tools (future)

Acceptance criteria:
- [ ] Sidebar matches design
- [ ] Active item highlighted with neon green
- [ ] Collapsible on mobile
- [ ] All navigation items working
- [ ] Icon alignment correct

Estimated time: 2 hours
```

---

### Issue 3: Redesign Dashboard Cards & KPIs
```
Title: Redesign Dashboard Stat Cards
Labels: design, high-priority
Assignee: You
Related: #1

Description:
Update KPI cards on dashboard overview page:
- Icon (40x40, neon green background at 10% opacity)
- Title (12px, secondary color)
- Large value (28px, weight 700)
- Change percentage (with color: green for positive, red for negative)
- Sparkline chart (60px height, neon green)

Cards to update:
- Total P&L
- Win Rate
- Profit Factor
- Current Capital
- Total Trades
- Avg Win/Loss

Acceptance criteria:
- [ ] Cards match design spec
- [ ] Icons properly styled
- [ ] Sparklines render correctly
- [ ] Responsive layout (4 col → 2 col → 1 col)
- [ ] Proper spacing and alignment

Estimated time: 2-3 hours
```

---

### Issue 4: Update Charts to Match Theme
```
Title: Restyle All Charts (Recharts) with Neon Green Theme
Labels: design, enhancement
Assignee: You
Related: #1

Description:
Update all Recharts to use new color scheme:
- Line color: #00FF88 (profit/growth)
- Area fill: rgba(0, 255, 136, 0.2)
- Loss areas: #FF3D71 with 20% opacity
- Grid color: #2D3561
- Axis labels: #A0AEC0
- Tooltip background: #1A1F3A with #2D3561 border

Charts to update:
- Performance Over Time (line chart)
- Win Rate Distribution (pie chart)
- P&L by Month (bar chart)
- Verification Score Trend (bar chart)
- Volume trends (area chart)

Acceptance criteria:
- [ ] All charts use new colors
- [ ] Grid lines visible but not intrusive
- [ ] Tooltips styled correctly
- [ ] Legend colors match
- [ ] Charts readable on mobile

Estimated time: 2-3 hours
```

---

## FEATURE ISSUES (Priority: HIGH)

### Issue 5: Create Settings Page
```
Title: Build Settings Page with Account Configuration
Labels: feature, high-priority
Assignee: You
Milestone: v2.0

Description:
Create a new Settings page (/dashboard/settings) with the following sections:

1. Account Settings
   - Username
   - Email
   - Password change
   - 2FA setup (future)

2. Trading Accounts
   - Exness demo account balance (input)
   - Real account balance (input)
   - MetaTrader 5 login (input)
   - Account type toggle (demo/live)
   - Save button (neon green)

3. Risk Management (see Issue #6)

4. Notifications
   - Email notifications toggle
   - Telegram alerts toggle
   - Discord webhook (future)
   - Win/loss thresholds

5. API Keys
   - Display existing API keys
   - Generate new key button
   - Delete key button

6. Preferences
   - Theme (dark mode default)
   - Currency display (USD/EUR)
   - Timezone
   - Trading pairs to focus on

Acceptance criteria:
- [ ] All sections load correctly
- [ ] Forms validate input
- [ ] Save button updates Firebase
- [ ] Success/error notifications work
- [ ] Mobile responsive
- [ ] No unsaved changes warnings (optional)

Estimated time: 4-5 hours
```

---

### Issue 6: Build Risk Management Calculator
```
Title: Create Risk Management & Position Sizing Calculator
Labels: feature, high-priority
Assignee: You
Related: #5 (Settings)
Milestone: v2.0

Description:
Create a dedicated Risk Management section in Settings page:

Components:
1. Current Capital Display
   - Input field for account balance
   - Displays in neon green

2. Risk % Slider
   - Min: 0%, Max: 5%
   - Default: 2%
   - Shows recommended lot size in real-time

3. Stop Loss & Lot Size Calculator
   - Input: Account balance
   - Input: Risk percentage (from slider)
   - Input: Stop loss in pips
   - Output: Recommended lot size (neon green, large text)
   - Example: "$10,000 @ 2% risk = 0.05 lots"

4. Position Sizing Table
   - Columns: Risk Level | Stop Loss (pips) | Lot Size
   - Color coded:
     - Safe (0.5-2%): Green background
     - Medium (2-3%): Yellow background
     - High (3-5%): Red background
   - Show 5-10 different scenarios

5. Daily Loss Limit
   - Slider (0-10% of capital)
   - Progress bar showing current daily loss
   - Color: Green (safe) → Yellow (warning) → Red (limit reached)
   - Reset button (daily)

Acceptance criteria:
- [ ] Calculator works correctly (validate math)
- [ ] Lot sizes are accurate for XAU/USD
- [ ] Table updates in real-time
- [ ] Colors match design
- [ ] Mobile responsive
- [ ] Save calculations to Firebase
- [ ] Load saved calculations on page load

Estimated time: 3-4 hours
```

---

### Issue 7: Implement Forex News Feed
```
Title: Add Forex News Feed (Macro Events Affecting XAU/USD)
Labels: feature, enhancement
Assignee: You
Milestone: v2.0
Related: New page or new tab in Analytics

Description:
Create a new News Feed page showing economic events that affect XAU/USD:

Data source: ForexFactory API or NewsAPI (free tier)

Layout:
- Card-based list, full width
- Each card shows:
  - Impact level badge (High: red, Medium: yellow, Low: green)
  - Time of event
  - Event title
  - Description
  - Country/source
  - Forecast vs Previous vs Actual

Features:
- Filter by impact level (High/Medium/Low)
- Sort by time or impact
- Search by keyword
- Show next 7 days of events
- Highlight events in next 24 hours (yellow border)
- Update every 1 hour

Event examples affecting XAU/USD:
- US Fed Interest Rate Decisions
- Inflation data (CPI)
- Employment reports
- GDP reports
- USD strength index
- Geopolitical events

Acceptance criteria:
- [ ] Fetches news from API
- [ ] Displays events correctly
- [ ] Filters work
- [ ] Mobile responsive
- [ ] Updates automatically
- [ ] Caches data (refresh every hour)
- [ ] Error handling (API down)

Estimated time: 3-4 hours
```

---

### Issue 8: Create Volume & Macro Analysis Dashboard
```
Title: Build Volume & Macro Trends Analysis Page
Labels: feature, enhancement
Assignee: You
Milestone: v2.0
Related: New page in Analytics

Description:
Create a new page showing volume and macro analysis:

Left Column (50%):
1. Volume Indicator Chart
   - Volume bars (color: neon green for up, red for down)
   - Current volume level
   - Average volume
   - Volume trend (↑ increasing, ↓ decreasing, → stable)

2. Current Volume Status
   - "Expanding" / "Contracting" / "Normal"
   - Color coded
   - Text explanation

Right Column (50%):
1. Macro Trends List
   - US Dollar strength
   - US Interest rates
   - Global inflation
   - Geopolitical risks
   - Central bank policies

2. Economic Calendar
   - Upcoming events
   - Impact level
   - Event name & time
   - Previous/Forecast/Actual

3. XAU/USD Specific Factors
   - Safe haven demand
   - Inflation expectations
   - Real rates

Charts:
- Volume trend (last 30 days)
- USD index trend
- Global rates trend

Data sources:
- TradingView API (volume)
- ForexFactory or NewsAPI (macro events)
- Central Bank APIs (rates)

Acceptance criteria:
- [ ] All data fetches correctly
- [ ] Charts render properly
- [ ] Mobile responsive
- [ ] Updates daily
- [ ] Error handling
- [ ] Layout 2-column on desktop, 1-column on mobile

Estimated time: 4-5 hours
```

---

### Issue 9: Build Profit Potential Calculator
```
Title: Create Profit Potential & ROI Calculator
Labels: feature, enhancement
Assignee: You
Milestone: v2.0
Related: #6 (Risk Management)

Description:
Create a profit potential calculator tool (can be in Settings or separate page):

Inputs:
- Account balance
- Lot size
- Entry price
- Take profit price
- Risk amount (%)

Calculations:
- Pips to TP
- Potential profit ($)
- Potential profit (%)
- Risk/Reward ratio
- Position duration estimate (based on volatility)

Outputs (displayed):
- Profit amount (neon green, large)
- Profit percentage
- R:R ratio (e.g., "1:3" - risk $1 to make $3)
- Daily income potential (based on signal frequency)
- Monthly income potential (estimated)

Optional:
- Show 100 trades scenario (at win rate %)
- Show annual projection (conservative estimate)
- Risk warning if R:R too low

Acceptance criteria:
- [ ] Calculator accurate for XAU/USD
- [ ] All inputs validated
- [ ] Real-time calculations
- [ ] Outputs clear and prominent
- [ ] Mobile responsive
- [ ] Save scenarios to history

Estimated time: 2-3 hours
```

---

## UI/UX ISSUES (Priority: MEDIUM)

### Issue 10: Improve Responsive Design
```
Title: Audit & Fix Responsive Design Across All Pages
Labels: design, enhancement
Assignee: You

Description:
Test all pages on mobile (375px), tablet (768px), and desktop (1024px+).

Fixes needed:
- Ensure sidebar collapses on mobile
- Tables scroll horizontally on small screens
- Charts adjust height on mobile
- Forms stack properly
- Stat cards show 1 per row on mobile
- Modals fill screen on mobile (full height)
- All buttons clickable (min 44px height)

Devices to test:
- iPhone 12 (390px)
- iPad (768px)
- Desktop (1920px)

Acceptance criteria:
- [ ] All pages tested on 3+ breakpoints
- [ ] No horizontal scroll on mobile
- [ ] Typography readable
- [ ] Buttons easily clickable
- [ ] No layout shifts
- [ ] Performance: <3s load time

Estimated time: 2-3 hours
```

---

### Issue 11: Improve Dark Mode Details
```
Title: Fine-tune Dark Mode Colors & Contrast
Labels: design, enhancement
Assignee: You

Description:
Audit contrast ratios and color consistency:

Check:
- All text meets WCAG AA (7:1 contrast)
- Focus states visible on all interactive elements
- Color consistency across all pages
- Hover states clear and obvious
- Disabled states visible

Use tools:
- WebAIM Contrast Checker
- Browser dev tools

Fixes:
- Adjust colors if contrast too low
- Add focus outlines (2px #00FF88)
- Ensure disabled text darker/grayed
- Test colorblind vision simulation

Acceptance criteria:
- [ ] All text AA or AAA contrast
- [ ] Focus states visible
- [ ] Accessible to colorblind users
- [ ] Consistent throughout app

Estimated time: 1-2 hours
```

---

## CONTENT/DATA ISSUES (Priority: MEDIUM)

### Issue 12: Create Helpful User Onboarding Guide
```
Title: Add Onboarding Guide & Help Documentation
Labels: enhancement
Assignee: You

Description:
Create in-app help for new users:

Components:
1. First Login Modal
   - Welcome message
   - Quick setup (5 steps)
   - Link to full documentation

2. Tooltip System
   - Add tooltips to confusing UI elements
   - Risk calculator explanation
   - Chart legend explanation
   - Settings explanations

3. Help Page
   - FAQ about using dashboard
   - How to set up trading accounts
   - How to interpret signals
   - Risk management basics
   - Links to external resources

4. Video Links (future)
   - Setup guide video
   - How to read charts
   - Risk management video

Acceptance criteria:
- [ ] Onboarding triggers on first login
- [ ] Help page accessible from all pages
- [ ] Tooltips appear on hover
- [ ] All content clear and helpful
- [ ] No typos or broken links

Estimated time: 2 hours
```

---

## TESTING ISSUES (Priority: MEDIUM)

### Issue 13: Create Comprehensive Testing Checklist
```
Title: Execute Full QA Testing Before v2.0 Release
Labels: testing
Assignee: You
Milestone: v2.0

Description:
Test all features and pages:

Dashboard:
- [ ] All cards display correctly
- [ ] Charts load and animate
- [ ] Stats update correctly
- [ ] Trade log shows all trades
- [ ] Responsive on mobile/tablet/desktop

Settings:
- [ ] All forms save correctly
- [ ] Validation works
- [ ] Success/error notifications appear
- [ ] Settings persist after reload

Risk Calculator:
- [ ] All calculations correct
- [ ] Table updates in real-time
- [ ] Responsive

News Feed:
- [ ] Events load correctly
- [ ] Filters work
- [ ] Updates properly

Analytics:
- [ ] All tabs accessible
- [ ] Charts render
- [ ] Screenshot analysis works
- [ ] Verification metrics display

Performance:
- [ ] Page load time < 3s
- [ ] No layout shifts
- [ ] Images optimized
- [ ] No console errors

Acceptance criteria:
- [ ] All tests pass
- [ ] No bugs found
- [ ] Performance acceptable
- [ ] Accessibility checked

Estimated time: 3-4 hours
```

---

## DOCUMENTATION ISSUES (Priority: LOW)

### Issue 14: Update README with New Features
```
Title: Update README & Documentation for v2.0
Labels: documentation
Assignee: You

Description:
Update README.md with:
- New design description (Forex Edge theme)
- New features list
- Screenshots of new pages
- How to use each feature
- Installation/setup instructions
- Configuration guide

Estimated time: 1-2 hours
```

---

## PRIORITY ORDER FOR YOUR SPRINT

**TODAY/TOMORROW:**
1. Issue #1 - Implement theme (5h)
2. Issue #2 - Sidebar redesign (2h)
3. Issue #3 - Dashboard cards (2-3h)

**TUESDAY:**
4. Issue #4 - Update charts (2-3h)
5. Issue #5 - Settings page (4-5h)
6. Issue #6 - Risk calculator (3-4h)

**WEDNESDAY+:**
7. Issue #7 - News feed (3-4h)
8. Issue #8 - Macro analysis (4-5h)
9. Issue #9 - Profit calculator (2-3h)
10. Issue #10 - Responsive (2-3h)
11. Issue #13 - Testing (3-4h)

---

## HOW TO USE THESE

1. Create a GitHub Project board
2. Add these issues to the board
3. Drag into: **To Do**, **In Progress**, **Done**
4. Update descriptions as you work
5. Link commits to issues (use "fixes #X" in commit messages)
6. Check off acceptance criteria as you complete them

---

**Total estimated time: 35-45 hours**

**Realistic timeline:**
- Day 1 (Tomorrow): 5-6 hours → Issues #1-3
- Day 2 (Tuesday): 6-8 hours → Issues #4-6
- Day 3-4: Remaining issues + testing + refinement

---

**This is a solid sprint that showcases:**
✅ UI/UX design skills (Forex Edge theme)
✅ Feature implementation (settings, calculators)
✅ Professional dashboard building
✅ Monetizable product (clients will see value)
