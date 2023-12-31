import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const calculateTotalAmount = (items) => {
  // Assuming each item has a 'price' and 'quantity' property
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const urlData = await request.url.split('?');
    const isLayaway = urlData[1] === 'layaway';
    const reqBody = await request.json();
    const { items, email, user, shipping } = await reqBody;

    const existingCustomers = await stripe.customers.list({
      email: user.email,
    });
    let customerId;

    if (existingCustomers.data.length > 0) {
      // Customer already exists, use the first customer found
      const existingCustomer = existingCustomers.data[0];
      customerId = existingCustomer.id;
    } else {
      // Customer doesn't exist, create a new customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
      });

      customerId = newCustomer.id;
    }

    // Calculate total amount based on items
    let totalAmount = await calculateTotalAmount(items);

    console.log(totalAmount);

    // Calculate installment amount
    let installmentAmount = Math.round(totalAmount * 0.3);

    let session;

    const shippingInfo = JSON.stringify(shipping);

    const line_items = await items.map((item) => {
      return {
        price_data: {
          currency: 'mxn',
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            description: item.description,
            images: [item.images[0].url],
            metadata: { productId: item._id },
          },
        },
        quantity: item.quantity,
      };
    });

    if (isLayaway) {
      const invoice = await stripe.invoices.create({
        customer: customerId,
        collection_method: 'send_invoice',
        auto_advance: false,
        // Add line items and other details as needed
        days_until_due: 30,
      });

      const lineItems = [];

      for (const item of line_items) {
        // Create a product
        const product = await stripe.products.create({
          name: item.price_data.product_data.name,
          type: 'good',
          images: [item.price_data.product_data.images[0]],
          metadata: { productId: item._id },
        });

        // Create a price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: item.price_data.unit_amount,
          currency: item.price_data.currency,
        });

        const newItem = {
          price: price.id,
          quantity: item.quantity,
        };

        lineItems.push(newItem);

        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          price: price.id,
          quantity: item.quantity,
        });
      }

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'oxxo', 'customer_balance'],
        mode: 'payment',
        customer: customerId,
        payment_method_options: {
          oxxo: {
            expires_after_days: 2,
          },
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'mx_bank_transfer',
            },
          },
        },
        locale: 'es-419',
        client_reference_id: user?._id,
        success_url: `${process.env.NEXTAUTH_URL}/perfil/pedidos?pedido_exitoso=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/cancelado`,
        metadata: {
          shippingInfo,
          layaway: isLayaway,
          invoice: invoice.id,
        },
        shipping_options: [
          {
            shipping_rate: 'shr_1OW9lzF1B19DqtcQpzK984xg',
          },
        ],
        line_items: [
          {
            price_data: {
              currency: 'mxn',
              unit_amount: installmentAmount * 100, // Convert to cents
              product_data: {
                name: 'Pago Inicial de Apartado',
                description: `Pago inicial para apartado de pedido`,
              },
            },
            quantity: 1,
          },
        ],
      });
    } else {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'oxxo', 'customer_balance'],
        mode: 'payment',
        customer: customerId,
        payment_method_options: {
          oxxo: {
            expires_after_days: 2,
          },
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'mx_bank_transfer',
            },
          },
        },
        locale: 'es-419',
        success_url: `${process.env.NEXTAUTH_URL}/perfil/pedidos?pedido_exitoso=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/cancelado`,
        client_reference_id: user?._id,
        metadata: { shippingInfo },

        shipping_options: [
          {
            shipping_rate: 'shr_1OW9lzF1B19DqtcQpzK984xg',
          },
        ],
        line_items,
        // Add metadata to store layaway information
        metadata: {
          shippingInfo,
          layaway: isLayaway,
        },
      });
    }

    return NextResponse.json({
      message: 'Connection is active',
      success: true,
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
