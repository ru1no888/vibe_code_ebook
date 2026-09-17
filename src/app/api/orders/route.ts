import { NextResponse } from 'next/server';
import { getDbOrders, saveDbOrder } from '@/lib/server-db';
import { Order } from '@/types';

// GET /api/orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status');

    let orders = getDbOrders();

    if (status) {
      orders = orders.filter((o) => o.status.toUpperCase() === status.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders (Creates new order from Mobile or Web into Central DB)
export async function POST(request: Request) {
  try {
    const orderData: Order = await request.json();

    if (!orderData || !orderData.id || !orderData.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลคำสั่งซื้อไม่สมบูรณ์ (Missing id or customerEmail)' },
        { status: 400 }
      );
    }

    const savedOrder = saveDbOrder(orderData);

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: 'บันทึกลงฐานข้อมูลส่วนกลางเรียบร้อยแล้ว',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save order to central database' },
      { status: 500 }
    );
  }
}
