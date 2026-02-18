-- ============================================================================
-- BLOG TABLE FOR ACQUITY
-- ============================================================================

CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Stored as Markdown
  cover_image TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public can view published posts
CREATE POLICY blogs_view_published ON blogs
  FOR SELECT
  USING (status = 'published');

-- Admins can view all
CREATE POLICY blogs_admin_all ON blogs
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Indexes for performance
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_created_at ON blogs(created_at DESC);

-- ============================================================================
-- INSERT INITIAL BLOG POSTS (MARKDOWN FORMAT)
-- ============================================================================

INSERT INTO blogs (title, slug, excerpt, content, cover_image, status, created_at) VALUES
(
  'How to Buy a Business Without Getting Rejected',
  'how-to-buy-business-without-getting-rejected',
  'Master the art of making compelling offers that sellers accept. Learn the proven strategies successful buyers use to win negotiations.',
  '# How to Buy a Business Without Getting Rejected

When you''re ready to buy a business, one of the biggest fears is getting rejected by the seller. But rejection isn''t random—it''s usually because of one of these 5 critical mistakes.

## 1. Coming in With Too Low an Offer

**The mistake:** Trying to "anchor low" and negotiate up.

**Why it fails:** Sellers talk. If word gets out you lowball, other sellers won''t take you seriously. You lose credibility in the market.

**What works:** 
- Research comparable sales
- Offer within 10-15% of asking (initially)
- Show you''re serious, not shopping for a deal

## 2. Lack of Financial Proof

**The mistake:** Saying you have financing when you don''t.

**Why it fails:** Sellers want certainty. If your financing falls through, they lost 3-6 months.

**What works:**
- Get pre-approval BEFORE making offers
- Show bank statements
- Include earnest money deposit
- Work with an SBA lender if needed

## 3. No Clear Timeline

**The mistake:** Vague closing dates or "we''ll figure it out later."

**Why it fails:** Uncertainty kills deals. Sellers need to plan their exit.

**What works:**
- Specify exact closing date
- Build in contingency time (30-60 days typical)
- Show you understand their timeline

## 4. Bad Due Diligence Approach

**The mistake:** Asking for everything immediately, seeming distrustful.

**Why it fails:** Sellers feel attacked. They become defensive and pull the listing.

**What works:**
- Structured approach (financial records → operations → legal)
- Build rapport with the seller
- Ask why, don''t just demand access
- Respect their time

## 5. No Personal Connection

**The mistake:** Treating it like a pure transaction.

**Why it fails:** Most business owners care who buys their life''s work.

**What works:**
- Have conversations with the seller
- Share your vision for the business
- Show genuine interest in their story
- Explain why you''re the right buyer

## The Winning Formula

**Step 1:** Get financing pre-approved  
**Step 2:** Research the market thoroughly  
**Step 3:** Make a competitive offer quickly  
**Step 4:** Follow a structured due diligence process  
**Step 5:** Build rapport—this is personal, not just business  

## Ready to Find Your Business?

Browse verified businesses for sale on [Acquity Marketplace](/businesses-for-sale). Start with businesses in your preferred industry and location.

Want more details on a specific acquisition step? Check out our [Acquisition Guides](/resources) section.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
  'published',
  now() - INTERVAL '7 days'
),
(
  'Franchise vs Buying an Existing Business',
  'franchise-vs-buying-existing-business',
  'Unsure whether to buy a franchise or an independent business? We break down the pros and cons to help you make the right choice.',
  '# Franchise vs Buying an Existing Business: Which is Right for You?

One of the biggest decisions in entrepreneurship is choosing between a franchise and an independent business. Both have merits—and both have serious drawbacks.

## Franchise: The Structured Path

### Pros
- **Proven business model** - You''re not reinventing the wheel
- **Brand recognition** - Customers already know the name
- **Training & support** - Corporate provides systems, marketing, operations
- **Easier financing** - Banks love franchises because they''re lower risk
- **Built-in supply chain** - You don''t negotiate everything yourself

### Cons
- **High upfront costs** - Franchise fees ($50K-$500K+) before you even open
- **Limited control** - Can''t change menus, locations, branding decisions
- **Ongoing royalties** - 4-8% of revenue goes to corporate (forever)
- **Marketing fees** - Additional 2-3% for national campaigns you may not want
- **Territorial restrictions** - Can''t expand beyond your assigned area

### When Franchises Win
- You want stability and support
- You have $200K+ to invest
- You prefer proven systems
- You want someone else setting strategy

---

## Independent Business: The Entrepreneur''s Path

### Pros
- **Total control** - You make all decisions
- **No royalties** - 100% of profits stay with you
- **Unique positioning** - You create the brand
- **Growth flexibility** - Scale however you want
- **Lower startup costs** - No franchise fees

### Cons
- **Everything is on you** - Systems, marketing, hiring, operations
- **Higher failure risk** - You need to figure it out
- **Harder to finance** - Banks want proven models
- **Slower to profitability** - Building takes time
- **No support system** - When problems arise, you solve them

### When Independent Businesses Win
- You''re experienced in the industry
- You want creative control
- You''re bootstrapping or have limited capital
- You''re willing to invest time in building

---

## The Numbers: Franchise vs Independent

| Factor | Franchise | Independent |
|--------|-----------|------------|
| Startup Cost | $100K-$500K+ | $30K-$200K |
| Success Rate | 80%+ | 60-70% |
| Time to Profitability | 12-24 months | 18-36 months |
| Annual Royalties | 4-8% of revenue | 0% |
| Autonomy | Low | High |
| Support | High | Low |

---

## Decision Framework

**Choose Franchise if:**
✓ You have $200K+ capital  
✓ You want lower risk  
✓ You prefer structure  
✓ You''re new to business  

**Choose Independent if:**
✓ You have industry experience  
✓ You want creative control  
✓ You''re capital constrained  
✓ You''re willing to build systems  

---

## Your Next Step

**Exploring franchises?** Browse [franchise opportunities on Acquity](/franchises-for-sale)

**Looking for independent businesses?** Check out [established businesses for sale](/businesses-for-sale)

Both paths lead to success—it''s about matching the path to your goals, capital, and personality.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
  'published',
  now() - INTERVAL '5 days'
),
(
  'Common Mistakes First-Time Business Buyers Make',
  'common-mistakes-first-time-business-buyers-make',
  'Avoid costly errors that could sabotage your business acquisition. Learn from the mistakes thousands of first-time buyers have made.',
  '# Common Mistakes First-Time Business Buyers Make

Most first-time business buyers have great intentions but fall into predictable traps. Here are the 7 most expensive mistakes—and how to avoid them.

## Mistake #1: Falling in Love With One Business

**The Problem:** You find a business, you love the industry, the location is perfect... and suddenly you''re not evaluating anymore, you''re justifying.

**The Cost:** Overpaying by $100K-$500K+

**The Fix:**
- Evaluate at least 5-10 businesses
- Create a scoring rubric before looking
- Walk away from deals that don''t fit your criteria
- Remember: There''s always another business

---

## Mistake #2: Skipping the Numbers Check

**The Problem:** The seller says "We make $500K a year" but when you dig into the books, it''s really $250K.

**The Cost:** Buying a business that can''t support your lifestyle

**The Fix:**
- **Never trust the seller''s word** - Verify everything
- Request 3 years of tax returns (most important)
- Review P&L statements month-by-month
- Look for red flags (one-time revenue, fake expenses)
- Hire an accountant ($1,500) to review before closing

---

## Mistake #3: Ignoring Customer Concentration Risk

**The Problem:** 60% of revenue comes from 3 customers.

**The Cost:** One customer leaves after closing, your revenue drops by half

**The Fix:**
- Ask: "Who are your top 10 customers?"
- Calculate percentage of revenue per customer
- If >20% from one customer, that''s a red flag
- Understand WHY customers buy from this business

---

## Mistake #4: Not Understanding the Owner''s Role

**The Problem:** The owner runs everything. On day one, you realize the business can''t function without them.

**The Cost:** Working 80 hours/week to replace an undocumented owner

**The Fix:**
- Create a detailed org chart
- Document key processes before closing
- Ask: "What would break if you took 2 weeks off?"
- Budget 3-6 months of owner involvement in the deal

---

## Mistake #5: Underestimating Transition Costs

**The Problem:** "We''re closing Tuesday!" But you need new systems, staff training, customer reassurance...

**The Cost:** Additional $20K-$100K in unexpected expenses

**The Fix:**
- Budget 10-15% of purchase price for transition
- Plan for staff turnover and hiring
- Budget for technology upgrades
- Account for lost revenue during transition

---

## Mistake #6: Skipping Professional Help

**The Problem:** "It''s a simple deal, I can do this myself."

**The Cost:** Missing liabilities that legally transfer to you ($50K-$500K)

**The Fix:**
- Hire a business lawyer ($3K-$5K)
- Get an accountant to review ($1,500-$3K)
- Consider a business broker for guidance
- This is 1-2% of purchase price—it''s cheap insurance

---

## Mistake #7: Not Having an Exit Plan

**The Problem:** You buy without knowing how you''ll exit.

**The Cost:** Being stuck in a business you don''t want to run

**The Fix:**
- Before buying: How will you exit in 5-10 years?
- Is this business sellable to someone else?
- Are there growth opportunities?
- What''s your success metric?

---

## The Buyer''s Checklist

Before you make an offer, confirm:

- [ ] Reviewed 3 years of tax returns
- [ ] Verified revenue with customers/vendors
- [ ] Understand top 10 customers
- [ ] Know owner''s role and documentation level
- [ ] Calculated transition costs
- [ ] Hired professional advisors
- [ ] Built in 30-60 day due diligence period
- [ ] Have financing pre-approved

---

## Ready to Buy Smart?

**Browse verified businesses** on [Acquity](/businesses-for-sale) and use these frameworks to evaluate correctly.

Want step-by-step guidance? Check out our [resource guides](/resources) for detailed acquisition checklists.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
  'published',
  now() - INTERVAL '3 days'
);
