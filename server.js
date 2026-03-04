// Simple Node.js server to handle Notion API requests and avoid CORS issues
const http = require('http');
const url = require('url');

// Import fetch for Node.js versions that don't have it built-in
let fetch;
(async () => {
    if (typeof globalThis.fetch === 'undefined') {
        const { default: nodeFetch } = await import('node-fetch');
        fetch = nodeFetch;
    } else {
        fetch = globalThis.fetch;
    }
})();

// Notion configuration
const NOTION_CONFIG = {
    apiKey: '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',
    studentsDbId: '1abd37d666308071bfe1e37d1d155035',  // Current students database
    assessmentDbId: '2a2d37d6663080c39fb5c34639b33114'    // ICAN Academy Assessment Records database
};

// CORS headers for browser requests
function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Fetch students from Notion with pagination
async function fetchStudentsFromNotion() {
    try {
        console.log('Fetching students from Notion...');
        
        let allResults = [];
        let hasMore = true;
        let cursor = undefined;
        
        while (hasMore) {
            const bodyData = {
                page_size: 100,
                sorts: [
                    {
                        property: "Created time",
                        direction: "descending"
                    }
                ]
            };
            
            if (cursor) {
                bodyData.start_cursor = cursor;
            }
            
            const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_CONFIG.studentsDbId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_CONFIG.apiKey}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            allResults = allResults.concat(data.results);
            hasMore = data.has_more;
            cursor = data.next_cursor;
            
            console.log(`Fetched ${data.results.length} records, total so far: ${allResults.length}`);
        }
        
        console.log(`Total records fetched: ${allResults.length}`);
        return parseStudentNames(allResults);
        
    } catch (error) {
        console.error('Error fetching from Notion:', error);
        throw error;
    }
}

function parseStudentNames(results) {
    const students = [];
    
    results.forEach((page, index) => {
        console.log(`Processing page ${index}:`, Object.keys(page.properties));
        
        let studentData = {
            id: page.id,
            name: '',
            studentId: '',
            grade: ''
        };
        
        
        // Try different possible property names for student names
        const possibleNameProps = ['Full Name', 'Name', 'name', 'Student', 'student', 'Title', 'title'];
        
        for (const propName of possibleNameProps) {
            const nameProperty = page.properties[propName];
            if (nameProperty) {
                console.log(`Found property ${propName}:`, nameProperty.type);
                
                if (nameProperty.type === 'title' && nameProperty.title.length > 0) {
                    studentData.name = nameProperty.title[0].plain_text;
                    break;
                } else if (nameProperty.type === 'rich_text' && nameProperty.rich_text.length > 0) {
                    studentData.name = nameProperty.rich_text[0].plain_text;
                    break;
                } else if (nameProperty.type === 'select' && nameProperty.select) {
                    studentData.name = nameProperty.select.name;
                    break;
                }
            }
        }
        
        // Try to get Student ID
        const possibleIdProps = ['Student ID', 'ID', 'StudentID', 'Student Number', 'Number'];
        for (const propName of possibleIdProps) {
            const idProperty = page.properties[propName];
            if (idProperty) {
                if (idProperty.type === 'rich_text' && idProperty.rich_text.length > 0) {
                    studentData.studentId = idProperty.rich_text[0].plain_text;
                    break;
                } else if (idProperty.type === 'number' && idProperty.number !== null) {
                    studentData.studentId = idProperty.number.toString();
                    break;
                } else if (idProperty.type === 'title' && idProperty.title.length > 0) {
                    studentData.studentId = idProperty.title[0].plain_text;
                    break;
                } else if (idProperty.type === 'select' && idProperty.select) {
                    studentData.studentId = idProperty.select.name;
                    break;
                } else if (idProperty.type === 'unique_id' && idProperty.unique_id) {
                    studentData.studentId = `${idProperty.unique_id.prefix}-${idProperty.unique_id.number}`;
                    break;
                }
            }
        }
        
        // Try to get Grade Level
        const possibleGradeProps = ['Grade', 'Grade Level', 'Class', 'Year', 'Level'];
        for (const propName of possibleGradeProps) {
            const gradeProperty = page.properties[propName];
            if (gradeProperty) {
                if (gradeProperty.type === 'select' && gradeProperty.select) {
                    studentData.grade = gradeProperty.select.name;
                    break;
                } else if (gradeProperty.type === 'rich_text' && gradeProperty.rich_text.length > 0) {
                    studentData.grade = gradeProperty.rich_text[0].plain_text;
                    break;
                } else if (gradeProperty.type === 'number' && gradeProperty.number !== null) {
                    studentData.grade = gradeProperty.number.toString();
                    break;
                }
            }
        }
        
        if (studentData.name.trim()) {
            students.push(studentData);
            console.log(`Added student:`, studentData);
        }
    });

    console.log(`Total students found: ${students.length}`);
    // Sort by name
    return students.sort((a, b) => a.name.localeCompare(b.name));
}

// Function to fetch assessment data for a student from Notion
async function fetchAssessmentsFromNotion(studentName) {
    try {
        console.log(`Fetching assessments for student: ${studentName}`);
        
        // Query the assessment database for records matching the student name
        const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_CONFIG.assessmentDbId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                filter: {
                    property: "Student Name",
                    title: {
                        equals: studentName
                    }
                },
                sorts: [
                    {
                        property: "Assessment Date",
                        direction: "descending"
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const assessments = [];

        // Parse each assessment record
        for (const page of data.results) {
            const props = page.properties;
            
            const assessment = {
                id: page.id,
                studentName: props["Student Name"]?.title?.[0]?.plain_text || '',
                studentId: props["Student ID"]?.rich_text?.[0]?.plain_text || '',
                assessmentDate: props["Assessment Date"]?.date?.start || null,
                testType: props["Test Type"]?.select?.name || '',
                status: props["Assessment Status"]?.status?.name || '',
                gradeLevel: props["Grade level"]?.select?.name || '',
                
                // WPM data
                wpm: {
                    grade: props["WPM Grade Tested"]?.select?.name || '',
                    score: props["WPM Score"]?.number || 0
                },
                
                // GBWT attempts
                gbwt: [],
                
                // Comprehension attempts
                comprehension: []
            };
            
            // Parse GBWT attempts (up to 5) - only include attempts with actual scores
            for (let i = 1; i <= 5; i++) {
                const score = props[`GBWT Attempt ${i} Score`]?.number;
                const percentage = props[`GBWT Attempt ${i} Percentage`]?.number;
                const grade = props[`GBWT Attempt ${i} Grade`]?.select?.name;
                
                // Only include attempts that were actually attempted (including legitimate zeros)
                if ((score !== undefined && score !== null) && (percentage !== undefined && percentage !== null) && grade) {
                    assessment.gbwt.push({
                        attemptNumber: i,
                        grade: grade || assessment.gradeLevel || '',
                        correctCount: score,
                        percentage: percentage,
                        totalWords: 10 // Standard GBWT has 10 words
                    });
                }
            }
            
            // Parse Comprehension attempts (up to 5) - only include attempts with actual scores
            for (let i = 1; i <= 5; i++) {
                const grade = props[`Comprehension Attempt ${i} Grade`]?.select?.name;
                const passage = props[`Comprehension Attempt ${i} Passage`]?.select?.name;
                const scoreText = props[`Comprehension Attempt ${i} Score`]?.rich_text?.[0]?.plain_text || '';
                const percentage = props[`Comprehension Attempt ${i} Percentage`]?.number;
                
                // Parse score format "X/Y"
                let score = 0, total = 0;
                if (scoreText.includes('/')) {
                    const parts = scoreText.split('/');
                    score = parseInt(parts[0]) || 0;
                    total = parseInt(parts[1]) || 0;
                }
                
                // Only include attempts that were actually attempted (including legitimate zeros)
                if (total > 0 && (score !== undefined && score !== null) && (percentage !== undefined && percentage !== null) && grade && passage) {
                    assessment.comprehension.push({
                        attemptNumber: i,
                        grade: grade,
                        passage: passage,
                        score: score,
                        total: total,
                        percentage: percentage
                    });
                }
            }
            
            // Add summary if available
            assessment.summary = props["Assessment Summary"]?.rich_text?.[0]?.plain_text || '';
            
            assessments.push(assessment);
        }
        
        console.log(`Found ${assessments.length} assessments for ${studentName}`);
        return assessments;
        
    } catch (error) {
        console.error('Error fetching assessments from Notion:', error);
        throw error;
    }
}

// Function to save assessment data to Notion
async function saveAssessmentToNotion(assessmentData) {
    try {
        console.log('Saving assessment data to Notion:', JSON.stringify(assessmentData, null, 2));
        
        // Prepare the data for Notion API
        const notionData = {
            parent: { database_id: NOTION_CONFIG.assessmentDbId },
            properties: {
                "Student Name": {
                    title: [{ text: { content: assessmentData.studentName || 'Unknown' } }]
                }
            }
        };

        // Try adding other properties one by one to debug
        try {
            // Add Student ID if available
            if (assessmentData.studentId) {
                notionData.properties["Student ID"] = {
                    rich_text: [{ text: { content: assessmentData.studentId } }]
                };
            }

            // Add Assessment Date
            notionData.properties["Assessment Date"] = {
                date: { start: new Date().toISOString().split('T')[0] }
            };

            // Add Test Type if it's a select property
            if (assessmentData.testType) {
                notionData.properties["Test Type"] = {
                    select: { name: assessmentData.testType }
                };
            }

            // Add Assessment Status as status type
            notionData.properties["Assessment Status"] = {
                status: { name: 'Complete' }
            };

            // Try adding Grade level - note the lowercase 'l'
            if (assessmentData.gradeLevel) {
                // First try as select
                notionData.properties["Grade level"] = {
                    select: { name: assessmentData.gradeLevel.toString() }
                };
            }

        } catch (propError) {
            console.error('Error building properties:', propError);
        }

        // Add WPM data if available
        if (assessmentData.wpm) {
            notionData.properties["WPM Grade Tested"] = {
                select: { name: assessmentData.wpm.grade || '' }
            };
            notionData.properties["WPM Score"] = {
                number: parseFloat(assessmentData.wpm.score) || 0
            };
        }

        // Add GBWT data if available - record all attempts (max 5)
        if (assessmentData.gbwt && assessmentData.gbwt.length > 0) {
            const gbwtAttempts = assessmentData.gbwt.slice(-5); // Keep last 5 attempts
            
            // Add overall GBWT info
            const latestGBWT = gbwtAttempts[gbwtAttempts.length - 1];
            notionData.properties["GBWT Grade Tested"] = {
                select: { name: latestGBWT.grade || '' }
            };
            
            // Note: Individual attempts will be recorded below
            // No longer using summary "GBWT Attempts" property
            
            // Add individual attempt data
            gbwtAttempts.forEach((attempt, index) => {
                const attemptNum = index + 1;
                
                // GBWT Attempt 1, 2, 3, 4, 5 - Score and Percentage
                notionData.properties[`GBWT Attempt ${attemptNum} Score`] = {
                    number: attempt.correctCount || 0
                };
                notionData.properties[`GBWT Attempt ${attemptNum} Percentage`] = {
                    number: attempt.percentage || 0
                };
                
                // Add grade for each attempt if different
                if (attempt.grade) {
                    notionData.properties[`GBWT Attempt ${attemptNum} Grade`] = {
                        select: { name: attempt.grade.toString() }
                    };
                }
            });
        }

        // Add Comprehension data if available - record all attempts (max 5)
        if (assessmentData.comprehension && assessmentData.comprehension.length > 0) {
            console.log('DEBUG: Processing comprehension data:', assessmentData.comprehension);
            const comprehensionAttempts = assessmentData.comprehension.slice(-5); // Keep last 5 attempts
            
            // Add individual attempt data only (removed old overall properties)
            comprehensionAttempts.forEach((attempt, index) => {
                const attemptNum = index + 1;
                console.log(`DEBUG: Adding comprehension attempt ${attemptNum}:`, attempt);
                
                // Comprehension Attempt 1, 2, 3, 4, 5 - Grade, Passage, Score, Percentage
                notionData.properties[`Comprehension Attempt ${attemptNum} Grade`] = {
                    select: { name: attempt.grade || '' }
                };
                notionData.properties[`Comprehension Attempt ${attemptNum} Passage`] = {
                    select: { name: attempt.passage || '' }
                };
                notionData.properties[`Comprehension Attempt ${attemptNum} Score`] = {
                    rich_text: [{ text: { content: `${attempt.score}/${attempt.total}` } }]
                };
                notionData.properties[`Comprehension Attempt ${attemptNum} Percentage`] = {
                    number: attempt.percentage || 0
                };
            });
        }

        // Add assessment summary if available
        if (assessmentData.summary) {
            notionData.properties["Assessment Summary"] = {
                rich_text: [{ text: { content: assessmentData.summary } }]
            };
        }

        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify(notionData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Notion API Error Response:', errorData);
            console.log('Sent data:', JSON.stringify(notionData, null, 2));
            throw new Error(`HTTP ${response.status}: ${errorData}`);
        }

        const result = await response.json();
        console.log('✅ Assessment data saved to Notion successfully:', result.id);
        return { success: true, pageId: result.id };

    } catch (error) {
        console.error('❌ Error saving assessment to Notion:', error);
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
    } else if (parsedUrl.pathname === '/fetch-assessments' && req.method === 'GET') {
        try {
            console.log('Received request for student assessments');
            
            // Get student name from query parameter
            const studentName = parsedUrl.query.studentName;
            
            if (!studentName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Student name is required' 
                }));
                return;
            }
            
            const assessments = await fetchAssessmentsFromNotion(decodeURIComponent(studentName));
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                assessments: assessments,
                count: assessments.length 
            }));
            
        } catch (error) {
            console.error('Error handling assessments request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: error.message 
            }));
        }
    } else if (parsedUrl.pathname === '/save-assessment' && req.method === 'POST') {
        try {
            console.log('Received assessment data for saving');
            
            // Collect POST data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                try {
                    const assessmentData = JSON.parse(body);
                    console.log('Parsed assessment data:', JSON.stringify(assessmentData, null, 2));
                    
                    // Save to Notion
                    const result = await saveAssessmentToNotion(assessmentData);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Assessment data saved successfully',
                        pageId: result.pageId
                    }));
                    
                } catch (error) {
                    console.error('Error processing assessment data:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: error.message
                    }));
                }
            });
            
        } catch (error) {
            console.error('Error handling assessment save request:', error);
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

const PORT = parseInt(process.env.PORT || '919', 10);

// Get local network IP address
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('\n🚀 ICAN Academy Assessment Server Started Successfully!');
    console.log('═'.repeat(70));
    console.log(`📍 Port: ${PORT}`);
    console.log(`🏠 Local Access: http://localhost:${PORT}`);
    console.log(`🌐 Network Access: http://${localIP}:${PORT}`);
    console.log('═'.repeat(70));
    console.log('\n📋 Available Endpoints:');
    console.log(`   • GET  /students - Fetch all students from Notion`);
    console.log(`   • GET  /fetch-assessments?studentName={name} - Get student assessments`);
    console.log(`   • POST /save-assessment - Save assessment data to Notion`);
    console.log('\n💡 Access Instructions:');
    console.log(`   • From this computer: http://localhost:${PORT}`);
    console.log(`   • From other devices on network: http://${localIP}:${PORT}`);
    console.log(`   • Open the HTML file in browser after noting the IP above`);
    console.log('\n🛑 Press Ctrl+C to stop the server');
    console.log('═'.repeat(70) + '\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});