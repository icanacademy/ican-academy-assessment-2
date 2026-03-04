// Student dropdown functionality with Notion integration
import NotionAPI from './notion-api.js';

class StudentDropdown {
    constructor() {
        this.notionAPI = new NotionAPI();
        this.students = [];
        this.init();
    }

    async init() {
        await this.loadStudents();
        this.updateDropdown();
    }

    // Load students from Notion
    async loadStudents() {
        try {
            console.log('Loading students from Notion...');
            this.students = await this.notionAPI.getStudents();
            console.log(`Loaded ${this.students.length} students:`, this.students);
        } catch (error) {
            console.error('Failed to load students:', error);
            // Fallback to empty array or default students
            this.students = [];
        }
    }

    // Update the student dropdown with loaded students
    updateDropdown() {
        const studentSelect = document.getElementById('student-name');
        if (!studentSelect) {
            console.error('Student dropdown not found');
            return;
        }

        // Clear existing options except the first one
        while (studentSelect.children.length > 1) {
            studentSelect.removeChild(studentSelect.lastChild);
        }
        
        // Add students to dropdown
        this.students.forEach(student => {
            const option = document.createElement('option');
            option.value = student;
            option.textContent = student;
            studentSelect.appendChild(option);
        });

        // Setup refresh button functionality
        this.setupRefreshButton();
    }

    // Setup refresh button functionality
    setupRefreshButton() {
        const refreshBtn = document.getElementById('refresh-students');
        const loadingIndicator = document.getElementById('loading-students');
        
        if (!refreshBtn) {
            console.error('Refresh button not found');
            return;
        }
        
        refreshBtn.onclick = async (e) => {
            e.preventDefault();
            
            // Show loading state
            refreshBtn.style.display = 'none';
            loadingIndicator.style.display = 'block';
            
            try {
                await this.loadStudents();
                this.updateDropdown();
            } catch (error) {
                console.error('Failed to refresh students:', error);
            } finally {
                // Hide loading state
                refreshBtn.style.display = 'block';
                loadingIndicator.style.display = 'none';
            }
        };
    }

    // Test the Notion connection
    async testConnection() {
        const isConnected = await this.notionAPI.testConnection();
        console.log('Notion connection:', isConnected ? 'Success' : 'Failed');
        return isConnected;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('student-name')) {
        window.studentDropdown = new StudentDropdown();
    }
});

export default StudentDropdown;