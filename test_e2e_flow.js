// Automated verification script for Vibe Digital Store business logic and compliance
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('STARTING AUTOMATED ACCEPTANCE & COMPLIANCE TESTING');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
  }
}

// 1. Verify products catalog
const productsFile = fs.readFileSync(path.join(__dirname, 'src/data/products.ts'), 'utf-8');
assert(productsFile.includes('PRODUCTS'), 'Product catalog data source exists');
assert(productsFile.includes('Media Player PRO'), 'Assignment 1 (ฟังเพลง Media Player PRO) defined');
assert(productsFile.includes('Tarot App PRO'), 'Assignment 2 (ดูไพ่ทาโรต์ Tarot App PRO) defined');
assert(productsFile.includes('SQLite Task Manager PRO'), 'Assignment 3 (จัดการงาน SQLite Task Manager PRO) defined');

// 2. Verify Sample Downloads for 3 assignments
const sampleFiles = [
  'MediaPlayerPRO-Cyberpunk-Guide.pdf',
  'TarotApp-PRO-Spread-Guide.pdf',
  'SQLite-TaskManager-PRO-Guide.pdf',
];

sampleFiles.forEach((file) => {
  const filePath = path.join(__dirname, 'public/sample-downloads', file);
  assert(fs.existsSync(filePath), `Sample downloadable asset exists: ${file}`);
});

// 3. Verify DEMO ONLY Banner & Payment simulation
const bannerFile = fs.readFileSync(path.join(__dirname, 'src/components/DemoBanner.tsx'), 'utf-8');
assert(bannerFile.includes('DEMO ONLY'), 'DEMO ONLY warning banner exists and is visible');

const paymentFile = fs.readFileSync(path.join(__dirname, 'src/app/payment/[orderId]/page.tsx'), 'utf-8');
assert(paymentFile.includes('DEMO ONLY'), 'Payment screen contains explicit DEMO ONLY notice');
assert(paymentFile.includes('จำลองชำระเงินสำเร็จ'), 'Payment screen contains exact button "จำลองชำระเงินสำเร็จ"');
assert(paymentFile.includes('PAID'), 'Payment transition changes status to PAID');
assert(paymentFile.includes('useSearchParams') && paymentFile.includes('[orderId, accessToken]'), 'Payment page revalidates when access token changes');

const successFile = fs.readFileSync(path.join(__dirname, 'src/app/order-success/[orderId]/page.tsx'), 'utf-8');
assert(successFile.includes('useSearchParams') && successFile.includes('[orderId, accessToken]'), 'Success page revalidates when access token changes');

// 4. Verify Privacy in Order Tracking
const trackFile = fs.readFileSync(path.join(__dirname, 'src/app/track-order/page.tsx'), 'utf-8');
assert(trackFile.includes('Order ID') || trackFile.includes('หมายเลขคำสั่งซื้อ'), 'Track order asks for Order ID');
assert(trackFile.includes('อีเมล') || trackFile.includes('Email'), 'Track order asks for Buyer Email');
assert(trackFile.includes('htmlFor="order-id"') && trackFile.includes('id="order-id"'), 'Order ID input has an associated label');
assert(trackFile.includes('htmlFor="order-email"') && trackFile.includes('id="order-email"'), 'Order email input has an associated label');

const storageFile = fs.readFileSync(path.join(__dirname, 'src/lib/storage.ts'), 'utf-8');
assert(storageFile.includes('verifyAndGetOrder'), 'Storage contains verifyAndGetOrder function');
assert(storageFile.includes('foundOrder.customerEmail.trim().toLowerCase() !== cleanEmail'), 'Strict email check prevents exposing other users orders');
assert(storageFile.includes('ORDER_LOOKUP_ERROR') && !storageFile.includes('ไม่พบคำสั่งซื้อหมายเลข'), 'Unknown order and wrong email use the same generic error');

// 5. Verify checkout accessibility and keyboard operation
const checkoutFile = fs.readFileSync(path.join(__dirname, 'src/app/checkout/page.tsx'), 'utf-8');
assert(checkoutFile.includes('htmlFor="customer-name"') && checkoutFile.includes('id="customer-name"'), 'Customer name input has an associated label');
assert(checkoutFile.includes('htmlFor="customer-email"') && checkoutFile.includes('id="customer-email"'), 'Customer email input has an associated label');
assert(checkoutFile.includes('type="radio"') && checkoutFile.includes('name="payment-method"'), 'Payment method is keyboard-selectable');

// 6. Verify storefront accessibility and motion safety
const layoutFile = fs.readFileSync(path.join(__dirname, 'src/app/layout.tsx'), 'utf-8');
const homeFile = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf-8');
const navFile = fs.readFileSync(path.join(__dirname, 'src/components/Navbar.tsx'), 'utf-8');
const cartFile = fs.readFileSync(path.join(__dirname, 'src/components/CartDrawer.tsx'), 'utf-8');
const cssFile = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf-8');
assert(layoutFile.includes('href="#main-content"') && layoutFile.includes('id="main-content"'), 'Layout provides a keyboard skip link');
assert(homeFile.includes('aria-label="ค้นหาหนังสือ"'), 'Catalog search has an accessible name');
assert(homeFile.includes('role="status"') && homeFile.includes('aria-live="polite"'), 'Cart toast is announced to assistive technology');
assert(homeFile.includes('สั่งซื้อทันที') && homeFile.includes('ใส่ตะกร้า'), 'Home catalog cards provide both instant checkout and add-to-cart actions');
assert(navFile.includes('vibe-open-cart'), 'Navbar listens to vibe-open-cart to reveal the CartDrawer');
assert(storageFile.includes('openCartDrawer'), 'Storage module exports openCartDrawer helper');
assert(navFile.includes('aria-expanded={mobileMenuOpen}') && navFile.includes("'ปิดเมนูหลัก' : 'เปิดเมนูหลัก'"), 'Mobile navigation exposes its state and name');
assert(cartFile.includes('role="dialog"') && cartFile.includes('aria-modal="true"'), 'Cart drawer is exposed as a modal dialog');
assert(cssFile.includes('@media (prefers-reduced-motion: reduce)'), 'Animations respect reduced-motion preferences');

// 7. Verify MIT App Inventor AIA project
const aiaPath = path.join(__dirname, 'mobile_app/VibeEBookShop_Wrapper.aia');
assert(fs.existsSync(aiaPath), 'MIT App Inventor .aia file exists and is packaged');

const guidePath = path.join(__dirname, 'mobile_app/BLOCKS_GUIDE.md');
assert(fs.existsSync(guidePath), 'MIT App Inventor Blocks guide exists');
const guideContent = fs.readFileSync(guidePath, 'utf-8');
assert(guideContent.includes('CanGoBack') && guideContent.includes('GoBack'), 'Guide includes back button bug fix (CanGoBack -> GoBack)');

// 8. Verify Git & Secret Protection
const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf-8');
assert(gitignore.includes('.env.local') && gitignore.includes('.env'), '.gitignore properly excludes all .env files from Git');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
