import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Inquiry from '@/lib/models/Inquiry'

// 문의 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
        const inquiry = await Inquiry.findById(id)
        
        if (!inquiry) {
            return NextResponse.json(
                { success: false, message: '문의를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                id: inquiry._id,
                inquiryNumber: inquiry.inquiry_number,
                name: inquiry.inquirer?.name,
                email: inquiry.inquirer?.email,
                phone: inquiry.inquirer?.phone_number,
                companyName: inquiry.inquirer?.company_name,
                inquiryType: inquiry.inquiry_type,
                inquiryTypeLabel: inquiry.inquiry_type_label?.ko,
                message: inquiry.message,
                status: inquiry.status,
                responses: inquiry.responses,
                ipAddress: inquiry.ip_address,
                createdAt: inquiry.created_at,
                updatedAt: inquiry.updated_at,
            }
        })
    } catch (error) {
        console.error('Error fetching inquiry:', error)
        return NextResponse.json(
            { success: false, message: '문의 조회에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 문의 수정 (상태 변경 등)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
        const body = await request.json()
        const { status } = body

        const updateData: Record<string, unknown> = {
            updated_at: new Date(),
        }

        if (status) {
            updateData.status = status
        }

        const inquiry = await Inquiry.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        
        if (!inquiry) {
            return NextResponse.json(
                { success: false, message: '문의를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: inquiry
        })
    } catch (error) {
        console.error('Error updating inquiry:', error)
        return NextResponse.json(
            { success: false, message: '문의 수정에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 문의 삭제 (소프트 삭제)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
        const inquiry = await Inquiry.findByIdAndUpdate(
            id,
            { 
                deleted_at: new Date(),
                updated_at: new Date(),
            },
            { new: true }
        )
        
        if (!inquiry) {
            return NextResponse.json(
                { success: false, message: '문의를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: '문의가 삭제되었습니다.'
        })
    } catch (error) {
        console.error('Error deleting inquiry:', error)
        return NextResponse.json(
            { success: false, message: '문의 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}
