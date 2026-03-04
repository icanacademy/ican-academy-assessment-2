# 🚀 ICAN Academy Assessment - Notion Integration Setup

## Overview
Your assessment app now automatically logs all test data to Notion whenever assessment data is generated or updated.

## 📋 Step 1: Create Your Notion Assessment Database

### 1.1 Create New Database
1. Go to your Notion workspace
2. Click "+ New Page" 
3. Select "Database" → "Table"
4. Name it **"ICAN Academy Assessment Records"**

### 1.2 Add Required Properties
Add these properties to your database (exact names matter for the integration):

#### Student Information
- **Student Name** (Title) - Primary identifier
- **Student ID** (Text) - Unique identifier
- **Grade Level** (Select) - Options: K,1,2,3,4,5,6,7,8,9,10,11,12

#### Assessment Info
- **Assessment Date** (Date) - When test was taken
- **Test Type** (Select) - Options: Initial, Final, Progress Check
- **Assessment Status** (Select) - Options: Complete, In Progress, Scheduled

#### WPM Test Results
- **WPM Grade Tested** (Select) - Grade level of text used
- **WPM Score** (Number) - Words per minute

#### GBWT Test Results
- **GBWT Grade Tested** (Select) - Grade level tested
- **GBWT Score** (Number) - Number correct out of 10
- **GBWT Percentage** (Number) - Percentage score
- **GBWT Attempts** (Number) - How many tries

#### Comprehension Test Results
- **Comprehension Grade Tested** (Select) - Grade level tested
- **Comprehension Passage** (Select) - Options: A, B
- **Comprehension Score** (Text) - e.g., "3/4"
- **Comprehension Percentage** (Number) - Percentage score
- **Comprehension Attempts** (Number) - How many tries

#### Summary
- **Assessment Summary** (Text) - Generated summary from app

## 🔧 Step 2: Update Server Configuration

### 2.1 Get Your Database ID
1. Open your new Notion database
2. Copy the URL - it looks like: `https://notion.so/your-workspace/DATABASE_ID?v=...`
3. Extract the `DATABASE_ID` (32-character string)

### 2.2 Update server.js
Open `/Users/mungmoong/Desktop/ICAN_Academy_Assessment/server.js` and replace:

```javascript
assessmentDbId: 'YOUR_NEW_ASSESSMENT_DATABASE_ID'
```

With your actual database ID:

```javascript
assessmentDbId: 'your-actual-32-character-database-id'
```

## 🚀 Step 3: Test the Integration

### 3.1 Start the Server
```bash
cd /Users/mungmoong/Desktop/ICAN_Academy_Assessment
node server.js
```

You should see:
```
🚀 Server running at http://localhost:3000
📋 Students endpoint: http://localhost:3000/students
💾 Save assessment endpoint: http://localhost:3000/save-assessment
```

### 3.2 Open the Assessment App
Open `ICAN_Academy_Reading_Assessment_App.html` in your browser

### 3.3 Test Automatic Logging
1. Select a student
2. Complete any test (WPM, GBWT, or Comprehension)
3. Check the browser console for: `✅ Assessment data saved to Notion`
4. Check your Notion database - you should see a new record!

## 📊 How It Works

### Automatic Logging Triggers
Data is automatically saved to Notion when:
- ✅ Any test is completed (WPM, GBWT, Comprehension)
- ✅ Auto-save occurs (every 30 seconds)
- ✅ Manual save with Ctrl+S
- ✅ Assessment summary is updated

### Manual Save Option
You can also manually save to Notion by:
- Clicking the **"📝 Save to Notion"** button in Results Summary
- This sends the current assessment data immediately

### Data Logged
For each student assessment, the system logs:
- Student information (name, ID, grade)
- All WPM test results
- All GBWT test attempts and scores
- All comprehension test attempts and scores
- Complete assessment summary text
- Test type (Initial/Final)
- Automatic timestamp

## 🔍 Troubleshooting

### Common Issues

**"Failed to save to Notion" Error:**
1. Check that your database ID is correct in `server.js`
2. Ensure all required properties exist in your Notion database
3. Verify your Notion API key has access to the database

**"No student selected" Message:**
- This is normal - data only saves when a student is selected

**Server Connection Error:**
- Make sure `node server.js` is running
- Check that port 3000 is not blocked

### Console Monitoring
Open browser console (F12) to see:
- `Sending assessment data to Notion:` - Data being sent
- `✅ Assessment data saved to Notion:` - Success message
- `❌ Error saving to Notion:` - Error details

## 🎯 Benefits

✅ **Automatic Backup** - No data loss, everything logged to Notion
✅ **Real-time Tracking** - See assessments as they happen
✅ **Centralized Data** - All assessment records in one place
✅ **Progress Monitoring** - Track student improvement over time
✅ **Report Generation** - Use Notion's filtering and views for reports

## 📈 Next Steps

Once your integration is working:
1. Create Notion views for different reporting needs
2. Set up Notion formulas for automatic calculations
3. Use Notion's sharing features for team collaboration
4. Export data for further analysis if needed

---

**Need Help?** Check the browser console for detailed error messages and ensure your Notion database properties match exactly as listed above.