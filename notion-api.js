// Notion API integration for student data
import config from './config.js';

class NotionAPI {
    constructor() {
        this.apiKey = config.notion.apiKey;
        this.databaseId = config.notion.databaseId;
        this.baseURL = 'https://api.notion.com/v1';
    }

    // Fetch all students from the Notion database
    async getStudents() {
        try {
            const response = await fetch(`${this.baseURL}/databases/${this.databaseId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                body: JSON.stringify({
                    page_size: 100 // Adjust as needed
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.parseStudentData(data.results);
        } catch (error) {
            console.error('Error fetching students from Notion:', error);
            return [];
        }
    }

    // Parse the Notion response to extract student names
    parseStudentData(results) {
        const students = [];
        
        results.forEach(page => {
            // Assuming your database has a "Name" property
            // Adjust property name based on your actual database structure
            const nameProperty = page.properties.Name || page.properties.name || page.properties.Student;
            
            if (nameProperty) {
                let studentName = '';
                
                // Handle different property types
                if (nameProperty.type === 'title' && nameProperty.title.length > 0) {
                    studentName = nameProperty.title[0].plain_text;
                } else if (nameProperty.type === 'rich_text' && nameProperty.rich_text.length > 0) {
                    studentName = nameProperty.rich_text[0].plain_text;
                } else if (nameProperty.type === 'select' && nameProperty.select) {
                    studentName = nameProperty.select.name;
                }
                
                if (studentName.trim()) {
                    students.push(studentName.trim());
                }
            }
        });

        return students.sort(); // Sort alphabetically
    }

    // Test the API connection
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/databases/${this.databaseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Notion-Version': '2022-06-28'
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
}

// Export the class
export default NotionAPI;