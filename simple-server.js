// Simple Node.js server to handle Notion API requests and avoid CORS issues
const http = require('http');
const https = require('https');
const url = require('url');

// Notion configuration
const NOTION_CONFIG = {
    apiKey: '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',
    databaseId: '1abd37d666308071bfe1e37d1d155035'
};

// CORS headers for browser requests
function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Make HTTPS request to Notion API with pagination support
function makeNotionRequestWithCursor(cursor = undefined) {
    return new Promise((resolve, reject) => {
        const bodyData = {
            page_size: 100,
            sorts: [
                {
                    property: "Created time",
                    direction: "descending"
                }
            ]
        };
        
        // Add cursor if provided for pagination
        if (cursor) {
            bodyData.start_cursor = cursor;
        }
        
        const postData = JSON.stringify(bodyData);

        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: `/v1/databases/${NOTION_CONFIG.databaseId}/query`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON: ${error.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Fetch all pages from Notion
async function makeNotionRequest() {
    let allResults = [];
    let hasMore = true;
    let cursor = undefined;
    
    console.log('Starting to fetch all pages from Notion...');
    
    while (hasMore) {
        try {
            const response = await makeNotionRequestWithCursor(cursor);
            allResults = allResults.concat(response.results);
            hasMore = response.has_more;
            cursor = response.next_cursor;
            
            console.log(`Fetched ${response.results.length} records, total so far: ${allResults.length}`);
            
            if (hasMore) {
                console.log('More pages available, fetching next...');
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            throw error;
        }
    }
    
    console.log(`Fetched all pages. Total records: ${allResults.length}`);
    
    return {
        results: allResults
    };
}

// Parse student names from Notion response
function parseStudentNames(results) {
    const students = [];
    
    console.log(`📊 Total pages received: ${results.length}`);
    
    if (results.length === 0) {
        console.log('❌ No pages found in the database');
        return students;
    }
    
    // First, let's see the structure of the first page
    if (results[0]) {
        console.log('🔍 First page structure:');
        console.log('Available properties:', Object.keys(results[0].properties));
        console.log('Full first page properties:', JSON.stringify(results[0].properties, null, 2));
    }
    
    results.forEach((page, index) => {
        console.log(`\n--- Processing page ${index + 1}/${results.length} ---`);
        console.log(`Available properties:`, Object.keys(page.properties));
        
        // Try ALL properties to see their structure
        for (const [propName, propValue] of Object.entries(page.properties)) {
            console.log(`Property "${propName}":`, {
                type: propValue.type,
                hasContent: propValue[propValue.type] ? 'yes' : 'no',
                content: propValue[propValue.type]
            });
        }
        
        // Try different possible property names for student names
        const possibleNameProps = ['Full Name', 'Name', 'name', 'Student', 'student', 'Title', 'title'];
        let studentName = '';
        
        for (const propName of possibleNameProps) {
            const nameProperty = page.properties[propName];
            if (nameProperty) {
                console.log(`✅ Found property "${propName}" with type: ${nameProperty.type}`);
                console.log(`Content:`, nameProperty[nameProperty.type]);
                
                if (nameProperty.type === 'title' && nameProperty.title && nameProperty.title.length > 0) {
                    studentName = nameProperty.title[0].plain_text;
                    console.log(`📝 Extracted from title: "${studentName}"`);
                    break;
                } else if (nameProperty.type === 'rich_text' && nameProperty.rich_text && nameProperty.rich_text.length > 0) {
                    studentName = nameProperty.rich_text[0].plain_text;
                    console.log(`📝 Extracted from rich_text: "${studentName}"`);
                    break;
                } else if (nameProperty.type === 'select' && nameProperty.select && nameProperty.select.name) {
                    studentName = nameProperty.select.name;
                    console.log(`📝 Extracted from select: "${studentName}"`);
                    break;
                }
            }
        }
        
        // If no name found from primary fields, try combining Given Name + Family Name
        if (!studentName && page.properties["Given Name"] && page.properties["Family Name"]) {
            const givenName = page.properties["Given Name"].rich_text?.[0]?.plain_text || '';
            const familyName = page.properties["Family Name"].rich_text?.[0]?.plain_text || '';
            
            if (givenName || familyName) {
                studentName = `${familyName} ${givenName}`.trim();
                console.log(`📝 Constructed from Given + Family: "${studentName}"`);
            }
        }
        
        if (studentName && studentName.trim()) {
            students.push(studentName.trim());
            console.log(`✅ Added student: "${studentName}"`);
        } else {
            console.log(`❌ No student name found for page ${index + 1}`);
        }
    });

    console.log(`\n🎯 FINAL RESULT: ${students.length} students found`);
    if (students.length > 0) {
        console.log(`Students: ${students.join(', ')}`);
    }
    return students.sort();
}

// Fetch students from Notion
async function fetchStudentsFromNotion() {
    try {
        console.log('Fetching students from Notion...');
        const data = await makeNotionRequest();
        console.log('Raw Notion response received');
        return parseStudentNames(data.results);
    } catch (error) {
        console.error('Error fetching from Notion:', error);
        throw error;
    }
}

// Create server
const server = http.createServer(async (req, res) => {
    setCORSHeaders(res);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/students' && req.method === 'GET') {
        try {
            console.log('Received request for students');
            const students = await fetchStudentsFromNotion();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                students: students,
                count: students.length 
            }));
            
        } catch (error) {
            console.error('Error handling students request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: error.message 
            }));
        }
    } else if (parsedUrl.pathname === '/debug' && req.method === 'GET') {
        try {
            console.log('Received request for debug data');
            const data = await makeNotionRequest();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data, null, 2));
            
        } catch (error) {
            console.error('Error handling debug request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: error.message 
            }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Students endpoint: http://localhost:${PORT}/students`);
    console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});