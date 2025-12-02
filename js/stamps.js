// Stamp Management System
class StampManager {
    constructor() {
        this.stampsRequired = 7;
    }

    validateStampCode(code) {
        // Simple validation - in production, verify with backend
        return code.length >= 4;
    }

    addStamp(user, code) {
        if (!this.validateStampCode(code)) {
            throw new Error('Invalid stamp code');
        }

        if (user.stamps >= this.stampsRequired) {
            throw new Error('You already have 7 stamps! Claim your reward first.');
        }

        user.stamps++;
        if (!user.totalStamps) user.totalStamps = 0;
        user.totalStamps++;

        // Add to history
        if (!user.history) user.history = [];
        user.history.push({
            type: 'stamp',
            code: code,
            timestamp: new Date().toISOString()
        });

        // Check if reward earned
        const rewardEarned = user.stamps === this.stampsRequired;
        
        return {
            success: true,
            currentStamps: user.stamps,
            rewardEarned: rewardEarned
        };
    }

    getProgress(user) {
        return {
            current: user.stamps,
            required: this.stampsRequired,
            percentage: (user.stamps / this.stampsRequired) * 100
        };
    }
}
