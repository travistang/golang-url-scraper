export const testUsers = {
    admin: { username: 'admin', password: 'password' },
};

export const testUrls = {
    valid: 'https://example.com',
    invalid: 'not-a-url',
    google: 'https://google.com',
    github: 'https://github.com'
};

export const testTasks = {
    simple: {
        url: 'https://example.com',
        expectedStatus: 'completed'
    },
    complex: {
        url: 'https://github.com',
        expectedStatus: 'completed'
    }
}; 