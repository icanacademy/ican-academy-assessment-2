# ICAN Academy Reading Assessment App

A comprehensive reading level assessment tool with Notion database integration.

## Files Structure

```
ICAN_Academy_Assessment/
├── ICAN_Academy_Reading_Assessment_App.html  # Main application
├── config.js                                 # API configuration (add your keys here)
├── notion-api.js                            # Notion API integration
├── student-dropdown.js                      # Student dropdown functionality
├── .gitignore                               # Protect API keys from git
└── README.md                                # This file
```

## Setup Instructions

1. **Configure API Key**
   - Open `config.js`
   - Replace `YOUR_API_KEY_HERE` with your actual Notion API key
   - Save the file

2. **Run the Application**
   - Open `ICAN_Academy_Reading_Assessment_App.html` in a web browser
   - The student dropdown will automatically load names from your Notion database

3. **Features**
   - Auto-populating student names from Notion
   - WPM (Words Per Minute) test
   - GBWT (Grade-Based Word Test) assessment
   - Reading comprehension evaluation
   - Results summary with glass design
   - Save results as image
   - Print functionality

## Notion Database Requirements

Your Notion database should have a property called "Name" (or "Student") that contains student names.

## Security

- The `config.js` file is gitignored to protect your API keys
- Never commit API keys to version control
- This is designed for local use only

## Usage

1. Select a student from the dropdown (loads from Notion)
2. Choose the appropriate test section
3. Complete the assessment
4. View results in the Results Summary tab
5. Save or print results as needed

## Troubleshooting

- Check browser console for any API connection errors
- Ensure your Notion API key has proper permissions
- Verify the database ID in config.js matches your Notion database
- Use the refresh button (🔄) to reload student list if needed