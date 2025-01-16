// File: /app/lib/auth.ts

export function saveToken(token: string) {
    localStorage.setItem("token", token);
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function saveUser(userObj: any) {
    localStorage.setItem("user", JSON.stringify(userObj));
}

export function getUser(): any {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
