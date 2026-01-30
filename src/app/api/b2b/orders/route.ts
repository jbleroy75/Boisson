import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendB2BOrderNotification } from '@/lib/email';
import type { B2BOrderItem } from '@/types';

// GET - Fetch orders for the authenticated distributor
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get distributor ID for the user
    const { data: distributor, error: distributorError } = await supabase
      .from('distributors')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (distributorError || !distributor) {
      return NextResponse.json({ error: 'Distributor not found' }, { status: 404 });
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('b2b_orders')
      .select('*')
      .eq('distributor_id', distributor.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error in GET /api/b2b/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new B2B order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body as { items: B2BOrderItem[] };

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity < 100) {
      return NextResponse.json(
        { error: 'Minimum order quantity is 100 units' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get distributor
    const { data: distributor, error: distributorError } = await supabase
      .from('distributors')
      .select('id, approved')
      .eq('user_id', session.user.id)
      .single();

    if (distributorError || !distributor) {
      return NextResponse.json({ error: 'Distributor not found' }, { status: 404 });
    }

    if (!distributor.approved) {
      return NextResponse.json(
        { error: 'Your account is pending approval' },
        { status: 403 }
      );
    }

    // Calculate total with volume discount
    const getDiscountPercent = (quantity: number): number => {
      if (quantity >= 1000) return 50;
      if (quantity >= 500) return 40;
      if (quantity >= 100) return 30;
      return 0;
    };

    const discountPercent = getDiscountPercent(totalQuantity);
    const basePrice = 3.99;
    const discountedPrice = basePrice * (1 - discountPercent / 100);
    const total = totalQuantity * discountedPrice;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('b2b_orders')
      .insert({
        distributor_id: distributor.id,
        items,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Get distributor details for email
    const { data: distributorDetails } = await supabase
      .from('distributors')
      .select('company_name, user_id')
      .eq('id', distributor.id)
      .single();

    const { data: userDetails } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', distributorDetails?.user_id)
      .single();

    // Send confirmation email to distributor and notify admin
    if (distributorDetails && userDetails) {
      await sendB2BOrderNotification({
        distributorName: distributorDetails.company_name,
        distributorEmail: userDetails.email,
        orderId: order.id,
        items: items.map((item) => ({
          name: item.product_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
        })),
        total,
        discount: discountPercent,
      });
    }

    return NextResponse.json({
      order,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/b2b/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
