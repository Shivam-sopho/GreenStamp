# 🧪 Test Badge System

## Quick Test Commands

Open your browser console (F12) and run these commands one by one:

### 1. Test Badge System
```javascript
fetch('/api/badges/test').then(r => r.json()).then(console.log)
```

### 2. Test Eco-Actors
```javascript
fetch('/api/eco-actors').then(r => r.json()).then(console.log)
```

### 3. Test Badges List
```javascript
fetch('/api/badges/list').then(r => r.json()).then(console.log)
```

### 4. Test User Profile
```javascript
// First get a user ID from eco-actors
fetch('/api/eco-actors').then(r => r.json()).then(data => {
  if (data.ecoActors && data.ecoActors.length > 0) {
    const userId = data.ecoActors[0].id;
    console.log('Testing profile for user:', userId);
    fetch(`/api/users/${userId}/profile`).then(r => r.json()).then(console.log);
  }
});
```

### 5. Test Award Badge
```javascript
// First get a user ID and badge ID
Promise.all([
  fetch('/api/eco-actors').then(r => r.json()),
  fetch('/api/badges/list').then(r => r.json())
]).then(([ecoData, badgeData]) => {
  if (ecoData.ecoActors && ecoData.ecoActors.length > 0 && 
      badgeData.badges && badgeData.badges.length > 0) {
    
    const userId = ecoData.ecoActors[0].id;
    const badgeId = badgeData.badges[0].id;
    
    console.log('Awarding badge:', { userId, badgeId });
    
    fetch('/api/badges/award', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, badgeId })
    }).then(r => r.json()).then(console.log);
  }
});
```

## Expected Results

### 1. Badge System Test
Should return: `{ message: "Badge system is working", tables: { Badge: "✅ Accessible", UserBadge: "✅ Accessible" } }`

### 2. Eco-Actors
Should return: `{ ecoActors: [...] }` with 5 users

### 3. Badges List
Should return: `{ badges: [...] }` with available badges

### 4. User Profile
Should return: `{ profile: {...} }` with user data and badges

### 5. Award Badge
Should return: `{ message: "Badge awarded successfully", ... }`

## Troubleshooting

### If badge system test fails:
- Tables not created - Run the SQL commands in Supabase

### If eco-actors is empty:
- No users created - Run: `fetch('/api/seed-users', { method: 'POST' }).then(r => r.json()).then(console.log)`

### If badges list is empty:
- No badges created - Create badges using the setup guide

### If award badge fails:
- Check console for specific error messages
- Make sure both user and badge exist 