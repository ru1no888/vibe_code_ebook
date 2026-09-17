import { NextResponse } from 'next/server';
import { getDbOrderById, updateDbOrderStatus } from '@/lib/server-db';

interface RouteContext {
  params: Promise<{ orderId: string }>;
}

// GET /api/orders/[orderId]
export async function GET(request: Request, context: RouteContext) {
  try {
    const { orderId } = await context.params;
    const order = getDbOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคำสั่งซื้อในระบบ' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Optional privacy verification if requested
    if (email && order.customerEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'อีเมลไม่ตรงกับคำสั่งซื้อ' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[orderId] (Update status, e.g. PAID)
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { orderId } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุสถานะที่ต้องการเปลี่ยน (status)' },
        { status: 400 }
      );
    }

    const updatedOrder = updateDbOrderStatus(orderId, status);

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคำสั่งซื้อที่ต้องการอัปเดต' },
        { status: 404 }
      );
    }

    // If status became PAID, automatically trigger confirmation email
    if (status === 'PAID') {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const downloadUrl = `${baseUrl}/order-success/${updatedOrder.id}?token=${updatedOrder.downloadToken}`;

      try {
        await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: updatedOrder.customerEmail,
            customerName: updatedOrder.customerName,
            orderId: updatedOrder.id,
            downloadUrl,
            items: updatedOrder.items.map((i) => ({
              title: i.product.title,
              price: i.product.price,
              fileFormat: i.product.fileFormat,
            })),
            totalAmount: updatedOrder.totalAmount,
          }),
        });
      } catch (err) {
        console.warn('Auto-email dispatch from order PATCH failed:', err);
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'อัปเดตสถานะคำสั่งซื้อสำเร็จ',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating order' },
      { status: 500 }
    );
  }
}