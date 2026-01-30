import Client from 'shopify-buy';

// Initialize Shopify client
const shopifyClient = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'demo.myshopify.com',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'demo-token',
  apiVersion: '2024-01',
});

export default shopifyClient;

// Fetch all products
export async function getProducts() {
  try {
    const products = await shopifyClient.product.fetchAll();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch single product by handle (slug)
export async function getProductByHandle(handle: string) {
  try {
    const product = await shopifyClient.product.fetchByHandle(handle);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Create checkout
export async function createCheckout() {
  try {
    const checkout = await shopifyClient.checkout.create();
    return checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
}

// Add items to checkout
export async function addToCheckout(
  checkoutId: string,
  lineItems: Array<{ variantId: string; quantity: number }>
) {
  try {
    const checkout = await shopifyClient.checkout.addLineItems(checkoutId, lineItems);
    return checkout;
  } catch (error) {
    console.error('Error adding to checkout:', error);
    return null;
  }
}

// Update checkout items
export async function updateCheckoutItems(
  checkoutId: string,
  lineItems: Array<{ id: string; quantity: number }>
) {
  try {
    const checkout = await shopifyClient.checkout.updateLineItems(checkoutId, lineItems);
    return checkout;
  } catch (error) {
    console.error('Error updating checkout:', error);
    return null;
  }
}

// Remove items from checkout
export async function removeFromCheckout(checkoutId: string, lineItemIds: string[]) {
  try {
    const checkout = await shopifyClient.checkout.removeLineItems(checkoutId, lineItemIds);
    return checkout;
  } catch (error) {
    console.error('Error removing from checkout:', error);
    return null;
  }
}

// Fetch existing checkout
export async function fetchCheckout(checkoutId: string) {
  try {
    const checkout = await shopifyClient.checkout.fetch(checkoutId);
    return checkout;
  } catch (error) {
    console.error('Error fetching checkout:', error);
    return null;
  }
}
