// Dashboard Management
let authManager, rewardsManager, stampManager, currentUser;

// Initialize managers
function initDashboard() {
    authManager = new AuthManager();
    rewardsManager = new RewardsManager();
    stampManager = new StampManager();
    
    checkAuth();
}

// Check authentication
function checkAuth() {
    currentUser = authManager.getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    loadDashboard();
}

// Load dashboard data
function loadDashboard() {
    // Update user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userMobile').textContent = currentUser.mobile;
    document.getElementById('currentStamps').textContent = currentUser.stamps;
    document.getElementById('currentStampsLarge').textContent = currentUser.stamps;
    
    // Set user initial
    const initial = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('userInitial').textContent = initial;
    
    // Top bar stats
    document.getElementById('totalRewardsTop').textContent = currentUser.rewardsEarned;
    document.getElementById('totalStampsTop').textContent = currentUser.totalStamps || 0;
    
    // Format join date
    const joinDate = new Date(currentUser.joinedDate);
    const joinDateShort = joinDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    document.getElementById('joinDateTop').textContent = joinDateShort;
    
    // Update progress bar
    const progress = stampManager.getProgress(currentUser);
    document.getElementById('progressBar').style.width = progress.percentage + '%';
    
    // Render stamp grid
    renderStampGrid();
    
    // Render activity
    renderActivity();
    
    // Render active rewards
    renderActiveRewards();
}

// Render stamp grid
function renderStampGrid() {
    const grid = document.getElementById('stampGrid');
    grid.innerHTML = '';
    
    // 7 cups
    for (let i = 0; i < 7; i++) {
        const cup = document.createElement('div');
        cup.className = 'cup cup-placeholder ' + (i < currentUser.stamps ? 'filled' : '');
        cup.textContent = '☕';
        grid.appendChild(cup);
    }
    
    // Gift box
    const gift = document.createElement('div');
    gift.className = 'w-14 h-14 gift-placeholder ' + (currentUser.stamps >= 7 ? 'animate-pulse-scale' : 'opacity-50');
    gift.textContent = '🎁';
    grid.appendChild(gift);
}

// Render recent activity
function renderActivity() {
    const activityList = document.getElementById('activityList');
    
    if (!currentUser.history || currentUser.history.length === 0) {
        activityList.innerHTML = '<p class="text-gray-500 text-center py-4">No activity yet. Add your first stamp!</p>';
        return;
    }
    
    const recentHistory = currentUser.history.slice(-5).reverse();
    activityList.innerHTML = recentHistory.map(item => {
        const date = new Date(item.timestamp);
        let icon, text, color, subtext;
        
        if (item.type === 'stamp') {
            icon = '☕';
            text = 'Stamp added';
            subtext = item.code ? `Code: ${item.code}` : '';
            color = 'text-yellow-600';
        } else if (item.type === 'reward_earned') {
            icon = item.rewardIcon || '🎁';
            text = `Earned: ${item.rewardName}`;
            subtext = '';
            color = 'text-green-600';
        } else if (item.type === 'reward_redeemed') {
            icon = '✅';
            text = `Redeemed: ${item.reward}`;
            subtext = '';
            color = 'text-blue-600';
        }
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${icon}</span>
                    <div>
                        <p class="font-semibold ${color}">${text}</p>
                        ${subtext ? `<p class="text-xs text-gray-600 font-medium mt-0.5">${subtext}</p>` : ''}
                        <p class="text-xs text-gray-500">${date.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render active rewards
function renderActiveRewards() {
    const container = document.getElementById('activeRewards');
    const activeRewards = rewardsManager.getActiveRewards(currentUser);
    
    if (activeRewards.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No active rewards. Collect 7 stamps to earn!</p>';
        return;
    }
    
    container.innerHTML = activeRewards.map((reward) => {
        const expiryDate = new Date(reward.expiryDate);
        const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        
        // Find the actual index in the full rewards array
        const actualIndex = currentUser.rewards.findIndex(r => 
            r.earnedDate === reward.earnedDate && 
            r.id === reward.id && 
            !r.redeemed
        );
        
        return `
            <div class="bg-gradient-to-r ${reward.color} p-4 rounded-xl shadow-lg text-white">
                <div class="flex items-start justify-between mb-2">
                    <div class="text-4xl">${reward.icon}</div>
                    <span class="text-xs bg-white/20 px-2 py-1 rounded-full">${daysLeft} days left</span>
                </div>
                <h4 class="font-bold text-lg mb-1">${reward.name}</h4>
                <p class="text-sm opacity-90 mb-3">${reward.description}</p>
                <button onclick="redeemReward(${actualIndex})" class="w-full bg-white text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                    Redeem Now
                </button>
            </div>
        `;
    }).join('');
}

// Open add stamp popup
function openPopup() {
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('stampCode').focus();
}

// Close popup
function closePopup() {
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('stampForm').reset();
    document.getElementById('stampError').classList.add('hidden');
}

// Close popup on overlay click
function closePopupOnOverlay(event) {
    if (event.target.id === 'popup') {
        closePopup();
    }
}

// Submit stamp
function submitStamp(event) {
    event.preventDefault();
    
    const code = document.getElementById('stampCode').value.trim().toUpperCase();
    
    try {
        const result = stampManager.addStamp(currentUser, code);
        
        // Save updated user data
        authManager.updateUser(currentUser);
        
        // Close popup
        closePopup();
        
        // Reload dashboard
        loadDashboard();
        
        // Check if reward earned
        if (result.rewardEarned) {
            setTimeout(() => {
                generateRandomReward();
            }, 500);
        }
    } catch (error) {
        showStampError(error.message);
    }
}

// Show stamp error
function showStampError(message) {
    const errorDiv = document.getElementById('stampError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Generate random reward
function generateRandomReward() {
    const reward = rewardsManager.generateRewardForUser(currentUser);
    
    // Add to history
    currentUser.history.push({
        type: 'reward_earned',
        rewardName: reward.name,
        rewardIcon: reward.icon,
        timestamp: new Date().toISOString()
    });
    
    // Save updated user data
    authManager.updateUser(currentUser);
    
    // Show reward modal with random reward
    showRewardModal(reward);
}

// Show reward modal
function showRewardModal(reward) {
    const modal = document.getElementById('rewardModal');
    const modalContent = document.getElementById('rewardModalContent');
    
    modalContent.innerHTML = `
        <div class="text-6xl md:text-7xl mb-4 animate-bounce-gentle">${reward.icon}</div>
        <h2 class="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r ${reward.color} bg-clip-text text-transparent">
            Congratulations!
        </h2>
        <div class="bg-gradient-to-r ${reward.color} p-6 rounded-2xl text-white mb-4">
            <h3 class="text-xl md:text-2xl font-bold mb-2">${reward.name}</h3>
            <p class="text-sm md:text-base opacity-90">${reward.description}</p>
        </div>
        ${reward.bonusStamps ? `
            <div class="bg-purple-50 border-2 border-purple-300 p-4 rounded-xl mb-4">
                <p class="text-purple-700 font-semibold">🎉 Bonus: ${reward.bonusStamps} free stamps added to your card!</p>
            </div>
        ` : ''}
        <p class="text-sm text-gray-600 mb-6">Valid for 30 days • Show this to staff to claim</p>
        <button onclick="closeRewardModal()" class="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
            Awesome! 🎉
        </button>
    `;
    
    modal.classList.remove('hidden');
}

// Close reward modal
function closeRewardModal() {
    document.getElementById('rewardModal').classList.add('hidden');
    loadDashboard();
}

// Redeem reward
function redeemReward(index) {
    // Validate index
    if (index === -1 || !currentUser.rewards || !currentUser.rewards[index]) {
        alert('❌ Error: Reward not found. Please refresh the page.');
        loadDashboard();
        return;
    }
    
    // Check if already redeemed
    if (currentUser.rewards[index].redeemed) {
        alert('❌ This reward has already been redeemed!');
        loadDashboard();
        return;
    }
    
    try {
        const reward = rewardsManager.redeemReward(currentUser, index);
        authManager.updateUser(currentUser);
        
        // Show redeemed card modal instead of alert
        showRedeemedCard(reward);
        loadDashboard();
    } catch (error) {
        alert('❌ ' + error.message);
        loadDashboard();
    }
}

// Show redeemed card modal
function showRedeemedCard(reward) {
    const modal = document.getElementById('redeemedModal');
    const topSection = document.getElementById('redeemedCardTop');
    const icon = document.getElementById('redeemedIcon');
    const date = document.getElementById('redeemedDate');
    const name = document.getElementById('redeemedRewardName');
    const desc = document.getElementById('redeemedRewardDesc');
    const code = document.getElementById('redemptionCode');
    
    // Update gradient color based on reward
    const gradientMap = {
        'from-green-500 to-green-600': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'from-amber-600 to-amber-700': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        'from-emerald-500 to-emerald-600': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'from-purple-500 to-purple-600': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
        'from-orange-500 to-orange-600': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'from-red-500 to-red-600': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'from-blue-500 to-blue-600': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'from-yellow-500 to-yellow-600': 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
    };
    
    topSection.style.background = gradientMap[reward.color] || 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    icon.textContent = reward.icon;
    date.textContent = new Date(reward.redeemedDate).toLocaleString('en-IN');
    name.textContent = reward.name;
    desc.textContent = reward.description;
    code.textContent = generateRedemptionCode();
    
    modal.classList.remove('hidden');
}

// Generate random redemption code
function generateRedemptionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Close redeemed modal
function closeRedeemedModal(event) {
    if (event.target.id === 'redeemedModal') {
        document.getElementById('redeemedModal').classList.add('hidden');
    }
}

function closeRedeemedModalDirect() {
    document.getElementById('redeemedModal').classList.add('hidden');
}

// Show menu
function showMenu() {
    document.getElementById('menuSidebar').classList.remove('hidden');
}

// Hide menu
function hideMenu() {
    document.getElementById('menuSidebar').classList.add('hidden');
}

// Show profile
function showProfile() {
    hideMenu();
    alert(`Profile:\n\nName: ${currentUser.name}\nMobile: ${currentUser.mobile}\nAge: ${currentUser.age}\nGender: ${currentUser.gender}\nTotal Stamps: ${currentUser.totalStamps || 0}\nRewards Earned: ${currentUser.rewardsEarned}\nJoined: ${new Date(currentUser.joinedDate).toLocaleDateString('en-IN')}`);
}

// Show all rewards
function showAllRewards() {
    hideMenu();
    const activeRewards = rewardsManager.getActiveRewards(currentUser);
    const redeemedRewards = rewardsManager.getRedeemedRewards(currentUser);
    
    let message = '🎁 Your Rewards:\n\n';
    
    if (activeRewards.length > 0) {
        message += '✅ ACTIVE REWARDS:\n';
        activeRewards.forEach((r, i) => {
            const daysLeft = Math.ceil((new Date(r.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            message += `${i + 1}. ${r.name}\n   ${r.description}\n   Expires in ${daysLeft} days\n\n`;
        });
    }
    
    if (redeemedRewards.length > 0) {
        message += '\n✔️ REDEEMED REWARDS:\n';
        redeemedRewards.forEach((r, i) => {
            message += `${i + 1}. ${r.name}\n   Redeemed on ${new Date(r.redeemedDate).toLocaleDateString('en-IN')}\n\n`;
        });
    }
    
    if (activeRewards.length === 0 && redeemedRewards.length === 0) {
        message += 'No rewards yet. Collect 7 stamps to earn your first reward!';
    }
    
    alert(message);
}

// Show history
function showHistory() {
    hideMenu();
    if (!currentUser.history || currentUser.history.length === 0) {
        alert('No history available yet!');
        return;
    }
    
    const historyText = currentUser.history.map((item, index) => {
        const date = new Date(item.timestamp).toLocaleString('en-IN');
        let type;
        
        if (item.type === 'stamp') {
            type = `☕ Stamp Added${item.code ? ` (Code: ${item.code})` : ''}`;
        } else if (item.type === 'reward_earned') {
            type = `🎁 Reward Earned: ${item.rewardName}`;
        } else if (item.type === 'reward_redeemed') {
            type = `✅ Reward Redeemed: ${item.reward}`;
        }
        
        return `${index + 1}. ${type}\n   ${date}`;
    }).join('\n\n');
    
    alert(`Complete History:\n\n${historyText}`);
}

// Clear data
function clearData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone!')) {
        hideMenu();
        logout();
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authManager.logout();
        window.location.href = 'index.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
