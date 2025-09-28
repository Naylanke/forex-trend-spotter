// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBouUqJHuUjiQeHR8iOhrjvL_6IMnsbSJs",
  authDomain: "forexproan.firebaseapp.com",
  databaseURL: "https://forexproan-default-rtdb.firebaseio.com",
  projectId: "forexproan",
  storageBucket: "forexproan.firebasestorage.app",
  messagingSenderId: "547483505293",
  appId: "1:547483505293:web:2f665645a3589437c708c4",
  measurementId: "G-614Z65HVS3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global variables
let currentUser = null;
let currentPair = 'EUR/USD';
let chart = null;
let marketData = {};
let watchlist = [];
let refreshInterval;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Check for saved auth state
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Initialize chart
    initializeChart();
    
    // Load market data
    loadMarketData();
    
    // Start real-time updates (every 1 second)
    startRealTimeUpdates();
    
    // Load watchlist
    loadWatchlist();
    
    console.log('App initialized successfully');
}

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.getElementById('themeIcon');
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    
    if (theme === 'dark') {
        themeIcon.className = 'bi bi-sun-fill';
        darkModeSwitch.checked = true;
    } else {
        themeIcon.className = 'bi bi-moon-fill';
        darkModeSwitch.checked = false;
    }
}

// Authentication
function toggleAuth() {
    if (currentUser) {
        signOut();
    } else {
        const authModal = new bootstrap.Modal(document.getElementById('authModal'));
        authModal.show();
    }
}

function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    // Simulate sign in (replace with actual Firebase auth)
    const user = {
        uid: 'user_' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
    };
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateAuthUI();
    
    const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    authModal.hide();
    
    showToast('Signed in successfully!', 'success');
    loadWatchlist();
}

function handleSignUp(event) {
    event.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    
    // Simulate sign up (replace with actual Firebase auth)
    const user = {
        uid: 'user_' + Date.now(),
        email: email,
        displayName: name
    };
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateAuthUI();
    
    const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    authModal.hide();
    
    showToast('Account created successfully!', 'success');
    loadWatchlist();
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    watchlist = [];
    updateAuthUI();
    showToast('Signed out successfully!', 'info');
}

function updateAuthUI() {
    const authText = document.getElementById('authText');
    if (currentUser) {
        authText.textContent = currentUser.displayName || currentUser.email;
    } else {
        authText.textContent = 'Sign In';
    }
}

// Chart Management
function initializeChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: currentPair,
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    updateChart();
}

function updateChart() {
    if (!chart) return;
    
    // Generate sample data for the selected pair
    const data = generateChartData(currentPair);
    const labels = data.map((_, index) => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - (data.length - 1 - index));
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = currentPair;
    
    // Update color based on trend
    const isPositive = data[data.length - 1] >= data[data.length - 2];
    chart.data.datasets[0].borderColor = isPositive ? '#10b981' : '#ef4444';
    chart.data.datasets[0].backgroundColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    
    chart.update('none');
    
    // Update current price display
    const currentPrice = data[data.length - 1];
    const priceElement = document.getElementById('currentPrice');
    priceElement.textContent = `${currentPrice.toFixed(4)} ${isPositive ? '↑' : '↓'}`;
    priceElement.className = `badge ${isPositive ? 'bg-success' : 'bg-danger'}`;
}

function generateChartData(pair) {
    const baseRates = {
        'EUR/USD': 1.0872,
        'GBP/USD': 1.2534,
        'USD/JPY': 148.25,
        'AUD/USD': 0.6734,
        'USD/CAD': 1.3567,
        'XAU/USD': 2034.50,
        'XAG/USD': 24.85,
        'BTC/USD': 43250.00,
        'ETH/USD': 2650.00
    };
    
    const baseRate = baseRates[pair] || 1.0000;
    const data = [];
    
    for (let i = 0; i < 30; i++) {
        const variation = (Math.random() - 0.5) * 0.002;
        const price = baseRate + (baseRate * variation);
        data.push(price);
    }
    
    return data;
}

function changePair() {
    const selector = document.getElementById('pairSelector');
    currentPair = selector.value;
    updateChart();
    
    // Track pair change
    gtag('event', 'pair_change', {
        'pair': currentPair
    });
}

// Market Data Management
function loadMarketData() {
    // Generate sample market data
    const forexPairs = [
        { symbol: 'EUR/USD', price: 1.0872, change: 0.0023, changePercent: 0.21 },
        { symbol: 'GBP/USD', price: 1.2534, change: -0.0045, changePercent: -0.36 },
        { symbol: 'USD/JPY', price: 148.25, change: 0.75, changePercent: 0.51 },
        { symbol: 'AUD/USD', price: 0.6734, change: 0.0012, changePercent: 0.18 },
        { symbol: 'USD/CAD', price: 1.3567, change: -0.0023, changePercent: -0.17 }
    ];
    
    const metalsPairs = [
        { symbol: 'XAU/USD', price: 2034.50, change: 12.30, changePercent: 0.61 },
        { symbol: 'XAG/USD', price: 24.85, change: -0.45, changePercent: -1.78 }
    ];
    
    const cryptoPairs = [
        { symbol: 'BTC/USD', price: 43250.00, change: 1250.00, changePercent: 2.98 },
        { symbol: 'ETH/USD', price: 2650.00, change: -85.00, changePercent: -3.11 }
    ];
    
    marketData = { forex: forexPairs, metals: metalsPairs, crypto: cryptoPairs };
    updateMarketDisplay();
}

function updateMarketDisplay() {
    updateMarketTab('forexPairs', marketData.forex);
    updateMarketTab('metalsPairs', marketData.metals);
    updateMarketTab('cryptoPairs', marketData.crypto);
    updateSummaryStats();
}

function updateMarketTab(containerId, pairs) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = pairs.map(pair => {
        const isPositive = pair.change >= 0;
        const trendClass = isPositive ? 'text-bull' : 'text-bear';
        const trendIcon = isPositive ? '↑' : '↓';
        
        return `
            <div class="market-pair" onclick="selectPair('${pair.symbol}')">
                <div class="pair-info">
                    <div class="pair-name">${pair.symbol}</div>
                    <div class="pair-details">Vol: ${(Math.random() * 1000).toFixed(0)}K</div>
                </div>
                <div class="pair-price">
                    <div class="pair-current">${pair.price.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}</div>
                    <div class="pair-change ${trendClass}">
                        ${isPositive ? '+' : ''}${pair.changePercent.toFixed(2)}% ${trendIcon}
                    </div>
                </div>
                <div class="ms-2">
                    <i class="bi bi-star${watchlist.includes(pair.symbol) ? '-fill text-warning' : ''} watchlist-star" 
                       onclick="event.stopPropagation(); toggleWatchlist('${pair.symbol}')"></i>
                </div>
            </div>
        `;
    }).join('');
}

function selectPair(symbol) {
    currentPair = symbol;
    document.getElementById('pairSelector').value = symbol;
    updateChart();
    showToast(`Selected ${symbol}`, 'info');
}

function updateSummaryStats() {
    const allPairs = [...marketData.forex, ...marketData.metals, ...marketData.crypto];
    const bullish = allPairs.filter(pair => pair.change > 0).length;
    const bearish = allPairs.filter(pair => pair.change < 0).length;
    const sideways = allPairs.filter(pair => pair.change === 0).length;
    
    document.getElementById('bullishCount').textContent = bullish;
    document.getElementById('bearishCount').textContent = bearish;
    document.getElementById('sidewaysCount').textContent = sideways;
}

// Watchlist Management
function loadWatchlist() {
    const saved = localStorage.getItem(`watchlist_${currentUser?.uid || 'guest'}`);
    watchlist = saved ? JSON.parse(saved) : [];
    updateWatchlistDisplay();
}

function toggleWatchlist(symbol) {
    if (!currentUser) {
        showToast('Please sign in to manage your watchlist', 'warning');
        return;
    }
    
    const index = watchlist.indexOf(symbol);
    if (index > -1) {
        watchlist.splice(index, 1);
        showToast(`Removed ${symbol} from watchlist`, 'info');
    } else {
        watchlist.push(symbol);
        showToast(`Added ${symbol} to watchlist`, 'success');
    }
    
    localStorage.setItem(`watchlist_${currentUser.uid}`, JSON.stringify(watchlist));
    updateWatchlistDisplay();
    updateMarketDisplay(); // Refresh to update star icons
}

function updateWatchlistDisplay() {
    const container = document.getElementById('watchlistContent');
    
    if (watchlist.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Add pairs to your watchlist by clicking the star icon</p>';
        return;
    }
    
    const allPairs = [...marketData.forex, ...marketData.metals, ...marketData.crypto];
    const watchedPairs = allPairs.filter(pair => watchlist.includes(pair.symbol));
    
    container.innerHTML = watchedPairs.map(pair => {
        const isPositive = pair.change >= 0;
        const trendClass = isPositive ? 'text-bull' : 'text-bear';
        const trendIcon = isPositive ? '↑' : '↓';
        
        return `
            <div class="watchlist-item">
                <div>
                    <div class="fw-bold">${pair.symbol}</div>
                    <div class="small text-muted">Price: ${pair.price.toFixed(4)}</div>
                </div>
                <div class="text-end">
                    <div class="pair-current">${pair.price.toFixed(4)}</div>
                    <div class="small ${trendClass}">
                        ${isPositive ? '+' : ''}${pair.changePercent.toFixed(2)}% ${trendIcon}
                    </div>
                </div>
                <div class="ms-2">
                    <i class="bi bi-star-fill text-warning watchlist-star" 
                       onclick="toggleWatchlist('${pair.symbol}')"></i>
                </div>
            </div>
        `;
    }).join('');
}

// Real-time Updates
function startRealTimeUpdates() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(() => {
        // Update market data with small random changes
        updateMarketPrices();
        updateChart();
        updateMarketDisplay();
        updateWatchlistDisplay();
    }, 1000); // Update every 1 second for live MT5-style experience
}

function updateMarketPrices() {
    // Simulate small price movements
    Object.keys(marketData).forEach(category => {
        marketData[category].forEach(pair => {
            const volatility = 0.001; // 0.1% max change per second
            const change = (Math.random() - 0.5) * volatility * pair.price;
            pair.price += change;
            pair.change = change;
            pair.changePercent = (change / pair.price) * 100;
        });
    });
}

// App Drawer Functions
function downloadApp(type) {
    const message = type === 'mobile' ? 'Mobile app download started!' : 'Desktop app download started!';
    showToast(message, 'success');
    
    // Track download event
    gtag('event', 'app_download', {
        'app_type': type
    });
    
    // Close drawer
    const drawer = bootstrap.Offcanvas.getInstance(document.getElementById('appDrawer'));
    drawer.hide();
}

function showSettings() {
    showToast('Settings feature coming soon!', 'info');
    const drawer = bootstrap.Offcanvas.getInstance(document.getElementById('appDrawer'));
    drawer.hide();
}

function showProfile() {
    if (!currentUser) {
        showToast('Please sign in first', 'warning');
        return;
    }
    showToast('Profile feature coming soon!', 'info');
    const drawer = bootstrap.Offcanvas.getInstance(document.getElementById('appDrawer'));
    drawer.hide();
}

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastBody = document.getElementById('toastBody');
    
    toastBody.textContent = message;
    
    // Update toast styling based on type
    toast.className = `toast bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'info'} text-white`;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});

console.log('Forex Pro App loaded successfully!');