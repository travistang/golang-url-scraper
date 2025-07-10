export const testUsers = {
    admin: { username: 'admin', password: 'password' },
};

export const testUrls = {
    valid: (suffix: string) => `https://example-${suffix}.com`,
    invalid: 'not-a-url',
    google: 'https://google.com',
    github: 'https://github.com'
};