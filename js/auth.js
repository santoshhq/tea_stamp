// Authentication Management
class AuthManager {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
    }

    validateMobile(mobile) {
        return /^[6-9]\d{9}$/.test(mobile);
    }

    validateName(name) {
        return name.length >= 2;
    }

    validateAge(age) {
        return age >= 13 && age <= 120;
    }

    register(userData) {
        const users = this.getUsers();
        
        // Check if mobile already exists
        if (users.find(u => u.mobile === userData.mobile)) {
            throw new Error('Mobile number already registered');
        }

        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            mobile: userData.mobile,
            age: userData.age,
            gender: userData.gender,
            stamps: 0,
            totalStamps: 0,
            rewardsEarned: 0,
            history: [],
            rewards: [],
            joinedDate: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    login(mobile) {
        const users = this.getUsers();
        const user = users.find(u => u.mobile === mobile);
        
        if (!user) {
            throw new Error('Mobile number not registered');
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) return null;
        
        const currentUser = JSON.parse(userStr);
        
        // Sync with users array
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            const syncedUser = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(syncedUser));
            return syncedUser;
        }
        
        return currentUser;
    }

    updateUser(user) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }
}
