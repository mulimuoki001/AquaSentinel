// Shared test variables between authentication tests
export let sharedEmail: string;
export let token: string;
export let userId: number;

export const setSharedEmail = (email: string) => {
    sharedEmail = email;
};

export const setToken = (t: string) => {
    token = t;
};

export const setUserId = (id: number) => {
    userId = id;
};
