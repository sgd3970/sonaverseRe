// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInquirySubmit } from '../useInquiry';

// Mock useLocale
vi.mock('@/lib/i18n', () => ({
    useLocale: () => 'ko',
}));

describe('useInquirySubmit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it('should submit inquiry successfully', async () => {
        const mockResponse = {
            success: true,
            data: { inquiryNumber: '123', message: 'Success' },
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useInquirySubmit());

        const formData = {
            inquiryType: 'general',
            name: 'Test User',
            phoneNumber: '010-1234-5678',
            email: 'test@example.com',
            message: 'Test message',
            privacyConsented: true,
        };

        let success;
        await act(async () => {
            success = await result.current.submitInquiry(formData);
        });

        expect(success).toBe(true);
        expect(result.current.result).toEqual(mockResponse.data);
        expect(result.current.error).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith('/api/inquiries', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Test User'),
        }));
    });

    it('should handle submission failure', async () => {
        const mockResponse = {
            success: false,
            error: 'Failed',
        };

        (global.fetch as any).mockResolvedValue({
            ok: false,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useInquirySubmit());

        const formData = {
            inquiryType: 'general',
            name: 'Test User',
            phoneNumber: '010-1234-5678',
            email: 'test@example.com',
            message: 'Test message',
            privacyConsented: true,
        };

        let success;
        await act(async () => {
            success = await result.current.submitInquiry(formData);
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('Failed');
    });
});
