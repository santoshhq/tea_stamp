# ☕ Chai Rewards - Coffee Shop Stamp Loyalty System

A professional, fully functional, and mobile-responsive loyalty rewards system for coffee shops with a **random rewards generator**.

## 🎁 Features

### Random Rewards System
When customers collect 7 stamps, they receive ONE random reward from:
- 🍵 **Free Tea** - Complimentary cup of tea
- ☕ **Free Coffee** - Complimentary cup of coffee
- 💰 **₹100 Off** - ₹100 discount on next purchase
- ⭐ **2 Free Stamps + Tea** - Get 2 bonus stamps plus a free tea
- 🫖 **Free Chai** - Complimentary cup of chai
- 🎁 **Combo: Tea + Snack** - Free tea with snack
- 🎯 **₹50 Off** - ₹50 discount on any beverage
- 🌟 **Mega Bonus** - 3 free stamps + free coffee

### Core Features
- ✅ User Registration & Authentication
- ✅ Stamp Collection System (7 stamps required)
- ✅ Random Reward Generator
- ✅ Active Rewards Management
- ✅ Reward Redemption System
- ✅ Activity History Tracking
- ✅ Profile Management
- ✅ Mobile Responsive Design
- ✅ Data Persistence (localStorage)
- ✅ Professional UI/UX

## 📁 Project Structure

```
coffeshop_stamp/
├── index.html           # Login page
├── register.html        # Registration page
├── dashboard.html       # Main dashboard
├── rewards-demo.html    # Rewards showcase
├── js/
│   ├── auth.js         # Authentication management
│   ├── rewards.js      # Random rewards system
│   ├── stamps.js       # Stamp management
│   └── dashboard.js    # Dashboard logic
└── README.md           # This file
```

## 🚀 Getting Started

1. **Open the Demo Page**
   - Open `rewards-demo.html` to see all available rewards

2. **Register an Account**
   - Open `register.html`
   - Fill in your details (Name, Mobile, Age, Gender)
   - Click Register

3. **Login**
   - Open `index.html`
   - Enter your registered mobile number
   - Click Continue

4. **Collect Stamps**
   - Click "+ Add Stamp" button
   - Enter any stamp code (4+ characters)
   - Watch your progress!

5. **Earn Random Reward**
   - After 7 stamps, you'll receive a **random reward**
   - Reward is valid for 30 days
   - Click "Redeem Now" to claim it

## 🎨 Pages Overview

### 1. Login Page (`index.html`)
- Mobile number authentication
- Form validation
- Responsive design

### 2. Registration Page (`register.html`)
- User registration form
- Input validation
- Duplicate prevention

### 3. Dashboard (`dashboard.html`)
- User statistics (current stamps, total rewards, total stamps)
- Visual stamp card (7 cups + gift box)
- Progress bar
- Active rewards section
- Recent activity feed
- Menu sidebar

### 4. Rewards Demo (`rewards-demo.html`)
- Showcase all 8 reward types
- How it works guide
- Quick navigation

## 💻 Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS)
- **JavaScript**: Vanilla JS (ES6+)
- **Storage**: localStorage
- **Design**: Mobile-first responsive design

## 🎯 JavaScript Modules

### auth.js
- User authentication
- Registration logic
- Session management
- Input validation

### rewards.js
- Random reward generation
- 8 different reward types
- Reward expiry (30 days)
- Redemption tracking

### stamps.js
- Stamp validation
- Progress calculation
- Stamp history

### dashboard.js
- Dashboard initialization
- UI rendering
- Event handlers
- User interactions

## 📱 Mobile Responsive

- ✅ Works on all devices (mobile, tablet, desktop)
- ✅ Touch-friendly buttons
- ✅ Adaptive layouts
- ✅ Optimized for small screens

## 🔒 Validation

- Mobile number: 10 digits, starts with 6-9
- Name: Minimum 2 characters
- Age: 13-120 years
- Stamp code: Minimum 4 characters

## 🎨 Design Features

- Gradient backgrounds
- Smooth animations
- Professional color scheme
- Shadow effects
- Emoji icons
- Interactive elements

## 📊 User Data Structure

```javascript
{
  id: "unique_id",
  name: "User Name",
  mobile: "9876543210",
  age: 25,
  gender: "Male",
  stamps: 3,                    // Current stamps (0-7)
  totalStamps: 15,             // Total stamps collected
  rewardsEarned: 2,            // Number of rewards earned
  rewards: [...],              // Active and redeemed rewards
  history: [...],              // Activity history
  joinedDate: "2025-12-01"
}
```

## 🎁 Reward Data Structure

```javascript
{
  id: "free_tea",
  name: "🍵 Free Tea",
  description: "Get a complimentary cup of tea",
  icon: "🍵",
  color: "from-green-500 to-green-600",
  earnedDate: "2025-12-01",
  expiryDate: "2025-12-31",     // 30 days validity
  redeemed: false,
  bonusStamps: 0                // Some rewards give bonus stamps
}
```

## 🔥 Special Rewards with Bonuses

- **⭐ 2 Free Stamps + Tea**: Adds 2 stamps to your card + free tea
- **🌟 Mega Bonus**: Adds 3 stamps to your card + free coffee

## 📈 Future Enhancements

- Backend integration
- QR code scanning for stamps
- Push notifications
- Analytics dashboard
- Admin panel
- Multiple shop locations
- Social sharing
- Referral system

## 🐛 Testing

1. Register a new user
2. Login with credentials
3. Add stamps (enter any code 4+ chars)
4. Collect 7 stamps
5. Receive random reward
6. Check active rewards
7. Redeem reward
8. View history

## 📝 Notes

- All data stored in browser's localStorage
- No backend required (demo version)
- Rewards expire after 30 days
- Each user can have multiple active rewards
- Stamp codes validated client-side (production needs backend)

## 🎉 Credits

Created with ❤️ for coffee shop loyalty programs

---

**Enjoy your rewards! ☕🎁**
