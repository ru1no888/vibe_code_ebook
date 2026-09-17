import { NextResponse } from 'next/server';
import { getDbOrders, getDbStats, updateDbOrderStatus, getDbOrderById } from '@/lib/server-db';

// GET /api/admin/orders
export async function GET() {
  try {
    const orders = getDbOrders();
    const stats = getDbStats();

    return NextResponse.json({
      success: true,
      stats,
      orders,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
}

// POST /api/admin/orders (Admin actions: mark_paid, resend_email)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'ต้องระบุ orderId' },
        { status: 400 }
      );
    }

    const order = getDbOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคำสั่งซื้อนี้' },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/order-success/${order.id}?token=${order.downloadToken}`;

    if (action === 'mark_paid') {
      const updated = updateDbOrderStatus(orderId, 'PAID');
      
      // Send confirmation email
      let emailResult = { success: false, message: '' };
      try {
        const emailRes = await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: order.customerEmail,
            customerName: order.customerName,
            orderId: order.id,
            downloadUrl,
            items: order.items.map((i) => ({
              title: i.product.title,
              price: i.product.price,
              fileFormat: i.product.fileFormat,
            })),
            totalAmount: order.totalAmount,
          }),
        });
        const resData = await emailRes.json();
        emailResult = { success: resData.success, message: resData.message };
      } catch (e: any) {
        emailResult = { success: false, message: e.message };
      }

      return NextResponse.json({
        success: true,
        order: updated,
        message: 'อนุมัติการชำระเงินสำเร็จ และส่งอีเมลยืนยันแล้ว',
        emailResult,
      });
    }

    if (action === 'resend_email') {
      try {
        const emailRes = await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: order.customerEmail,
            customerName: order.customerName,
            orderId: order.id,
            downloadUrl,
            items: order.items.map((i) => ({
              title: i.product.title,
              price: i.product.price,
              fileFormat: i.product.fileFormat,
            })),
            totalAmount: order.totalAmount,
          }),
        });
        const resData = await emailRes.json();
        return NextResponse.json({
          success: true,
          message: 'ส่งอีเมลไปยัง ' + order.customerEmail + ' เรียบร้อยแล้ว',
          details: resData,
        });
      } catch (err: any) {
        return NextResponse.json(
          { success: false, error: 'ส่งอีเมลไม่สำเร็จ: ' + err.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'ไม่รู้จัก action ที่ระบุ' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Admin action failed' },
      { status: 500 }
    );
  }
}