// Rewards System with Random Rewards
class RewardsManager {
    constructor() {
        this.rewardTypes = [
            {
                id: 'free_tea',
                name: '🍵 Free Tea',
                description: 'Get a complimentary cup of tea',
                icon: '🍵',
                color: 'from-green-500 to-green-600'
            },
            {
                id: 'free_coffee',
                name: '☕ Free Coffee',
                description: 'Get a complimentary cup of coffee',
                icon: '☕',
                color: 'from-amber-600 to-amber-700'
            },
            {
                id: 'discount_100',
                name: '💰 ₹100 Off',
                description: '₹100 discount on your next purchase',
                icon: '💰',
                color: 'from-emerald-500 to-emerald-600'
            },
            {
                id: 'bonus_stamps',
                name: '⭐ 2 Free Stamps + Tea',
                description: 'Get 2 bonus stamps plus a free tea',
                icon: '⭐',
                color: 'from-purple-500 to-purple-600',
                bonusStamps: 2
            },
            {
                id: 'free_chai',
                name: '🫖 Free Chai',
                description: 'Get a complimentary cup of chai',
                icon: '🫖',
                color: 'from-orange-500 to-orange-600'
            },
            {
                id: 'combo_offer',
                name: '🎁 Combo: Tea + Snack',
                description: 'Get a free tea with a complimentary snack',
                icon: '🎁',
                color: 'from-red-500 to-red-600'
            },
            {
                id: 'discount_50',
                name: '🎯 ₹50 Off',
                description: '₹50 discount on any beverage',
                icon: '🎯',
                color: 'from-blue-500 to-blue-600'
            },
            {
                id: 'mega_bonus',
                name: '🌟 Mega Bonus',
                description: '3 free stamps + free coffee',
                icon: '🌟',
                color: 'from-yellow-500 to-yellow-600',
                bonusStamps: 3
            }
        ];
    }

    getRandomReward() {
        const randomIndex = Math.floor(Math.random() * this.rewardTypes.length);
        const reward = this.rewardTypes[randomIndex];
        
        return {
            ...reward,
            earnedDate: new Date().toISOString(),
            redeemed: false,
            expiryDate: this.getExpiryDate()
        };
    }

    getRandomRewardForUser(user) {
        // Get the last 2 rewards earned by the user
        const recentRewards = [];
        if (user.rewards && user.rewards.length > 0) {
            const lastRewards = user.rewards.slice(-2);
            lastRewards.forEach(r => recentRewards.push(r.id));
        }
        
        // Filter out recently earned rewards
        let availableRewards = this.rewardTypes.filter(r => !recentRewards.includes(r.id));
        
        // If all rewards were recent (edge case), allow all rewards
        if (availableRewards.length === 0) {
            availableRewards = this.rewardTypes;
        }
        
        // Select random reward from available ones
        const randomIndex = Math.floor(Math.random() * availableRewards.length);
        const reward = availableRewards[randomIndex];
        
        return {
            ...reward,
            earnedDate: new Date().toISOString(),
            redeemed: false,
            expiryDate: this.getExpiryDate()
        };
    }

    getExpiryDate() {
        const date = new Date();
        date.setDate(date.getDate() + 30); // 30 days validity
        return date.toISOString();
    }

    generateRewardForUser(user) {
        const reward = this.getRandomRewardForUser(user);
        
        // Add reward to user's rewards array
        if (!user.rewards) user.rewards = [];
        user.rewards.push(reward);
        
        // Apply bonus stamps if applicable
        if (reward.bonusStamps) {
            user.stamps += reward.bonusStamps;
            user.totalStamps += reward.bonusStamps;
        }
        
        // Reset current stamp count
        user.stamps = reward.bonusStamps || 0;
        user.rewardsEarned++;
        
        return reward;
    }

    redeemReward(user, rewardIndex) {
        if (!user.rewards || !user.rewards[rewardIndex]) {
            throw new Error('Reward not found');
        }

        const reward = user.rewards[rewardIndex];
        
        if (reward.redeemed) {
            throw new Error('Reward already redeemed');
        }

        // Check if expired
        if (new Date(reward.expiryDate) < new Date()) {
            throw new Error('Reward has expired');
        }

        // Mark as redeemed
        reward.redeemed = true;
        reward.redeemedDate = new Date().toISOString();
        
        // Add to history
        if (!user.history) user.history = [];
        user.history.push({
            type: 'reward_redeemed',
            reward: reward.name,
            rewardIcon: reward.icon,
            timestamp: new Date().toISOString()
        });

        return reward;
    }

    getActiveRewards(user) {
        if (!user.rewards) return [];
        
        return user.rewards.filter(r => 
            !r.redeemed && 
            new Date(r.expiryDate) > new Date()
        );
    }

    getRedeemedRewards(user) {
        if (!user.rewards) return [];
        return user.rewards.filter(r => r.redeemed);
    }
}
