// DOM Elements
const imageInput = document.getElementById('imageInput');
const browseBtn = document.getElementById('browseBtn');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const sampleBtn = document.getElementById('sampleBtn');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('results');

// Result elements
const diseaseName = document.getElementById('diseaseName');
const diseaseDescription = document.getElementById('diseaseDescription');
const confidenceScore = document.getElementById('confidenceScore');
const severityLevel = document.getElementById('severityLevel');
const severityText = document.getElementById('severityText');
const treatmentOptions = document.getElementById('treatmentOptions');
const preventiveList = document.getElementById('preventiveList');
const historyList = document.getElementById('historyList');

// Sample diseases data (simulated database)
const diseasesDatabase = {
    'Tomato Early Blight': {
        description: 'Fungal disease causing dark spots with concentric rings on older leaves.',
        severity: 65,
        treatment: 'Apply fungicides containing chlorothalonil or copper-based solutions. Remove infected leaves. Rotate crops annually.',
        prevention: ['Avoid overhead watering', 'Ensure proper plant spacing', 'Remove plant debris', 'Use resistant varieties'],
        confidence: 92
    },
    'Potato Late Blight': {
        description: 'Destructive fungal disease causing water-soaked lesions on leaves and stems.',
        severity: 80,
        treatment: 'Apply fungicides like mancozeb or metalaxyl immediately. Destroy infected plants.',
        prevention: ['Plant certified disease-free seed potatoes', 'Improve drainage', 'Monitor weather conditions', 'Avoid working in wet fields'],
        confidence: 88
    },
    'Apple Scab': {
        description: 'Fungal disease causing olive-green to black spots on leaves and fruit.',
        severity: 45,
        treatment: 'Apply sulfur or captan fungicides during growing season. Prune to improve air circulation.',
        prevention: ['Rake and destroy fallen leaves', 'Apply dormant sprays', 'Plant resistant varieties', 'Maintain tree health'],
        confidence: 95
    },
    'Grape Black Rot': {
        description: 'Fungal infection causing circular brown spots with black fruiting bodies.',
        severity: 70,
        treatment: 'Apply fungicides containing myclobutanil or trifloxystrobin before and after bloom.',
        prevention: ['Prune for good air circulation', 'Remove mummified fruit', 'Avoid overhead irrigation', 'Sanitize pruning tools'],
        confidence: 85
    },
    'Healthy Leaf': {
        description: 'No significant disease detected. Plant appears healthy.',
        severity: 5,
        treatment: 'Continue regular monitoring. Maintain proper watering and fertilization schedule.',
        prevention: ['Regular inspection', 'Balanced fertilization', 'Proper irrigation', 'Weed control'],
        confidence: 98
    }
};

// Initialize
let currentDisease = null;
let analysisHistory = [];

// Event Listeners
browseBtn.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('click', () => imageInput.click());
removeBtn.addEventListener('click', resetUpload);

imageInput.addEventListener('change', handleImageUpload);
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('drop', handleDrop);

analyzeBtn.addEventListener('click', analyzeImage);
sampleBtn.addEventListener('click', useSampleImage);

// Initialize with demo data
updateStats();
loadHistory();

// Functions
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        displayImage(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.style.borderColor = var(--primary-dark);
    uploadArea.style.background = 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)';
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        displayImage(file);
    }
    uploadArea.style.borderColor = var(--primary-color);
    uploadArea.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
}

function displayImage(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        imagePreview.style.display = 'flex';
        uploadArea.style.display = 'none';
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    imageInput.value = '';
    previewImage.src = '';
    imagePreview.style.display = 'none';
    uploadArea.style.display = 'block';
    analyzeBtn.disabled = true;
}

function analyzeImage() {
    if (!previewImage.src) return;
    
    // Show loading
    loading.style.display = 'block';
    analyzeBtn.disabled = true;
    
    // Simulate AI processing delay
    setTimeout(() => {
        // Randomly select a disease for simulation
        const diseaseKeys = Object.keys(diseasesDatabase);
        const randomDisease = diseaseKeys[Math.floor(Math.random() * diseaseKeys.length)];
        currentDisease = diseasesDatabase[randomDisease];
        
        // Update UI with results
        displayResults(randomDisease, currentDisease);
        
        // Add to history
        addToHistory(randomDisease);
        
        // Hide loading
        loading.style.display = 'none';
        analyzeBtn.disabled = false;
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}

function displayResults(name, data) {
    diseaseName.textContent = name;
    diseaseDescription.textContent = data.description;
    confidenceScore.textContent = data.confidence + '%';
    
    // Update severity
    severityLevel.style.width = data.severity + '%';
    severityText.textContent = getSeverityText(data.severity);
    
    // Update treatment
    treatmentOptions.innerHTML = `
        <p><strong>Recommended Action:</strong> ${data.treatment}</p>
        <div class="treatment-details">
            <p><i class="fas fa-clock"></i> Apply treatment within 24-48 hours</p>
            <p><i class="fas fa-exclamation-triangle"></i> Follow safety guidelines when using chemicals</p>
        </div>
    `;
    
    // Update prevention
    preventiveList.innerHTML = '';
    data.prevention.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        preventiveList.appendChild(li);
    });
}

function getSeverityText(severity) {
    if (severity < 30) return 'Early Stage - Immediate treatment recommended';
    if (severity < 70) return 'Moderate Infection - Urgent treatment required';
    return 'Severe Infection - Immediate action needed to prevent spread';
}

function addToHistory(diseaseName) {
    const historyItem = {
        id: Date.now(),
        name: diseaseName,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: new Date().toLocaleDateString(),
        confidence: diseasesDatabase[diseaseName].confidence
    };
    
    analysisHistory.unshift(historyItem);
    if (analysisHistory.length > 5) analysisHistory.pop();
    
    updateHistoryDisplay();
    saveHistory();
}

function updateHistoryDisplay() {
    if (analysisHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No analysis history yet</p>';
        return;
    }
    
    historyList.innerHTML = analysisHistory.map(item => `
        <div class="history-item">
            <div class="history-disease">${item.name}</div>
            <div class="history-meta">
                <span>${item.date} ${item.time}</span>
                <span class="history-confidence">${item.confidence}%</span>
            </div>
        </div>
    `).join('');
}

function saveHistory() {
    localStorage.setItem('plantDiseaseHistory', JSON.stringify(analysisHistory));
}

function loadHistory() {
    const saved = localStorage.getItem('plantDiseaseHistory');
    if (saved) {
        analysisHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

function useSampleImage() {
    // Use a sample leaf image from Unsplash
    const sampleImages = [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    
    // Create a fake file object for simulation
    previewImage.src = randomImage;
    imagePreview.style.display = 'flex';
    uploadArea.style.display = 'none';
    analyzeBtn.disabled = false;
}

function updateStats() {
    // Simulate dynamic stats
    document.getElementById('accuracyStat').textContent = '95%';
    document.getElementById('responseTime').textContent = '2.3s';
    document.getElementById('cropsSupported').textContent = '25+';
    document.getElementById('diseasesDetected').textContent = '50+';
}

// Export functionality
document.getElementById('saveReportBtn').addEventListener('click', () => {
    if (!currentDisease) {
        alert('Please analyze an image first');
        return;
    }
    alert('Report saved as PDF (simulated)');
});

document.getElementById('shareBtn').addEventListener('click', () => {
    if (!currentDisease) {
        alert('Please analyze an image first');
        return;
    }
    if (navigator.share) {
        navigator.share({
            title: 'Plant Disease Detection Results',
            text: `Detected: ${diseaseName.textContent} with ${confidenceScore.textContent} confidence`,
            url: window.location.href
        });
    } else {
        alert('Results copied to clipboard (simulated)');
    }
});

document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

// Mobile menu toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('.nav-links').style.display = 'none';
            }
        }
    });
});