import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAllOrders } from '@/lib/orders-store';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    // Find orders belonging to this user by phone or customer name
    const allOrders = getAllOrders();
    const cleanUserPhone = (user.phone || '').replace(/[^0-9]/g, '');

    const userOrders = allOrders.filter(order => {
      const orderPhone = (order.user_phone || '').replace(/[^0-9]/g, '');
      const matchesPhone = cleanUserPhone && orderPhone && (orderPhone.includes(cleanUserPhone) || cleanUserPhone.includes(orderPhone));
      const matchesName = order.customer_name && user.name && order.customer_name.toLowerCase() === user.name.toLowerCase();
      return matchesPhone || matchesName;
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      orders: userOrders
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

