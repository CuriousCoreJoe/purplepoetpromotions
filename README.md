# Purple Poet Promotions (P3) — Official Website

> *"Bringing beautiful noise and people together in beautiful spaces for entertainment."*

---

## 🎤 Project Overview

A professional single-page scrolling website for **Purple Poet Promotions**, an event promotion company connecting independent artists with venues and audiences. The site replaces a Facebook-only presence with a dedicated, branded online home.

---

## ✅ Completed Features

### Pages / Sections
- **Hero** — Full-screen branded hero with animated floating music note particles, glowing logo, headline, tagline, and dual CTA buttons
- **About** — Mission & vision cards, stats (events/artists/venues), Facebook CTA
- **Services** — 3-card grid: For Artists, For Clients/Venues, Event Production — with feature lists and individual CTAs
- **Events** — Tabbed layout:
  - *Upcoming Events* — Event card with date badge + video embed placeholder
  - *Past Events Gallery* — CSS grid photo gallery with hover overlay + lightbox viewer
- **Contact** — Info bar (email, Facebook, response time) + dual inquiry forms
- **Footer** — 4-column layout with brand tagline, quick links, artist links, contact info

### Functionality
- ✅ Fixed navbar with scroll-triggered background and active link highlighting
- ✅ Mobile hamburger menu with animated toggle
- ✅ Smooth scroll with fixed navbar offset
- ✅ Animated floating music note particles (hero background)
- ✅ Scroll-triggered fade-in animations for cards and sections
- ✅ Tab system for Upcoming vs. Past Events
- ✅ Lightbox for gallery photo preview
- ✅ **Artist Inquiry Form** — Validates and saves to `artist_inquiries` table (Name, Email, Phone, Talent Type, EPK/Media Links, Message)
- ✅ **Venue/Client Inquiry Form** — Validates and saves to `venue_inquiries` table (Name, Email, Phone, Venue Name, Event Date, Event Details)
- ✅ Form validation with inline error messages
- ✅ Loading state on form submit buttons
- ✅ Success confirmation messages after form submission
- ✅ Toast notifications for user feedback
- ✅ YouTube/Vimeo video embed support (iframe-ready slot)
- ✅ Responsive design — mobile, tablet, desktop

---


## 🔗 Functional Entry Points

| URL/Anchor | Description |
|---|---|
| `/#home` | Hero section |
| `/#about` | About & Services section |
| `/#events` | Events gallery (tabbed) |
| `/#contact` | Contact forms & info |
| `/#artist-form` | Direct scroll to Artist Inquiry form |
| `/#venue-form` | Direct scroll to Venue/Client Inquiry form |
| `/#services` | Direct scroll to Services cards |

---

## 🗄️ Data Models

### Table: `artist_inquiries`
| Field | Type | Description |
|---|---|---|
| id | text | Auto UUID |
| name | text | Artist full/stage name |
| email | text | Contact email |
| phone | text | Phone number |
| talent_type | text | Singer, Rapper, DJ, Band, etc. |
| epk_links | rich_text | EPK URLs, SoundCloud, YouTube, etc. |
| message | rich_text | Additional notes |
| status | text | New / Reviewed / Contacted / Booked / Declined |

### Table: `venue_inquiries`
| Field | Type | Description |
|---|---|---|
| id | text | Auto UUID |
| name | text | Contact name |
| email | text | Contact email |
| phone | text | Phone number |
| venue_name | text | Venue or business name |
| event_details | rich_text | Promotion services needed |
| event_date | text | Desired event date/timeframe |
| status | text | New / Reviewed / Proposal Sent / Booked / Declined |

---

## 🎨 Brand Identity

| Element | Value |
|---|---|
| Primary | Royal Purple `#7851A9` |
| Accent | Gold/Brass `#C9A84C` |
| Background | Crisp White `#FFFFFF` |
| Text | Charcoal `#2C2C2C` |
| Heading Font | Playfair Display |
| Body Font | Inter |

---

## ⚠️ Not Yet Implemented

- Real event flyers/photos (placeholders in place — ready to swap)
- Actual YouTube/Vimeo video embeds (iframe slots ready)
- Email/SMS notifications to owner on form submission (requires a backend service like Zapier, Make, or Formspree integration)
- Admin panel to manage inquiries
- Ticket purchasing / RSVP integration
- Instagram or other social links

---

## 🚀 Recommended Next Steps

1. **Add real content** — Replace gallery placeholders with actual event photos; add YouTube/Vimeo video embed URLs
2. **Update email address** — Replace `info@purplepoetpromotions.com` with real email
3. **Connect form notifications** — Integrate with Zapier or Make.com to send email/SMS alerts to owner when a form is submitted
4. **Add upcoming events** — Update event cards with real flyers, dates, and venue details
5. **Publish the site** — Head to the **Publish tab** to go live with a real domain
6. **Instagram link** — Add Instagram to the social links section if P3 expands their social presence

---

## 📱 Social Media

- **Facebook:** [@purple.poet.promotions](https://www.facebook.com/purple.poet.promotions)

---

*Built with HTML5, CSS3 (custom properties, CSS Grid, Flexbox), and vanilla JavaScript. No frameworks required.*
