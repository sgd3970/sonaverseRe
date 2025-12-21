import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../login/route';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('@/lib/db', () => ({
    default: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
    setSessionCookie: vi.fn(),
}));

const { mockFindOne, mockUpdateOne } = vi.hoisted(() => ({
    mockFindOne: vi.fn(),
    mockUpdateOne: vi.fn(),
}));

vi.mock('mongoose', () => ({
    default: {
        Schema: class { },
        models: {
            LegacyAdminUser: {
                findOne: () => ({
                    lean: mockFindOne,
                }),
                updateOne: mockUpdateOne,
            },
        },
        model: () => ({
            findOne: () => ({
                lean: mockFindOne,
            }),
            updateOne: mockUpdateOne,
        }),
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        compare: vi.fn(),
    },
}));

describe('Login API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if email or password is missing', async () => {
        const req = new NextRequest('http://localhost/api/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
    });

    it('should return 401 if user not found', async () => {
        mockFindOne.mockResolvedValue(null);

        const req = new NextRequest('http://localhost/api/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.success).toBe(false);
    });

    it('should return 401 if password invalid', async () => {
        mockFindOne.mockResolvedValue({
            _id: '123',
            email: 'test@example.com',
            password_hash: 'hash',
            failed_login_attempts: 0,
        });
        (bcrypt.compare as any).mockResolvedValue(false);

        const req = new NextRequest('http://localhost/api/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.success).toBe(false);
    });

    it('should return 200 on success', async () => {
        mockFindOne.mockResolvedValue({
            _id: '123',
            email: 'test@example.com',
            password_hash: 'hash',
            failed_login_attempts: 0,
            name: 'Admin',
            role: 'admin',
        });
        (bcrypt.compare as any).mockResolvedValue(true);

        const req = new NextRequest('http://localhost/api/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.user.email).toBe('test@example.com');
    });
});
