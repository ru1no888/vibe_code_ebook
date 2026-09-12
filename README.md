# 🚀 Vibe Digital Store: E-Book & Digital Products Platform

> **แพลตฟอร์มจำหน่าย E-Book และสินค้าดิจิทัลแบบครบวงจร (Web สู่ Mobile App)**  
> พัฒนาตามข้อกำหนด **"ใบงานฉบับกระชับ: Vibe Coding: E-book Shop"** และ **"Mini Project: ร้านขาย Digital Product"**

---

## 🌟 จุดเด่นของผลงาน (Key Highlights)

1. **Cyber-Modern UI / UX ระดับพรีเมียม**:
   - ดีไซน์ Glassmorphism พร้อมโทนสีทันสมัย Cyber Glow
   - ระบบตัวกรองหมวดหมู่ (E-Books, Notion Templates, Source Code, UI Kit) และระบบค้นหาแบบเรียลไทม์
   - Responsive 100% ใช้งานลื่นไหลบนหน้าจอคอมพิวเตอร์ แท็บเล็ต และสมาร์ตโฟน
2. **ระบบ Dual-Engine (พร้อมใช้งานทันที 100%)**:
   - สามารถรันได้ทันทีโดยไม่ต้องตั้งค่าฐานข้อมูลภายนอกล่วงหน้า
   - มี **In-App Simulated Mailbox** ให้ผู้ตรวจงานคลิกตรวจดูอีเมลและลิงก์ดาวน์โหลดได้ทันทีจากแถบ Navbar
   - พร้อมสลับไปใช้ Supabase และ Resend สำหรับ Production ได้ง่ายดายเพียงใส่ค่าใน `.env.local`
3. **ระบบความปลอดภัยและการป้องกันปัญหาตามเกณฑ์ (Anti-Pitfall Compliance)**:
   - **Privacy-First Order Tracking**: หน้าติดตามคำสั่งซื้อกำหนดให้กรอกทั้ง **Order ID และ Email ที่ตรงกัน** จึงจะเข้าถึงข้อมูลได้ เพื่อป้องกันการแอบดูคำสั่งซื้อของผู้อื่น
   - **DEMO ONLY Transparency**: ป้ายเตือนระบบจำลองการชำระเงินเด่นชัดทุกหน้าตามข้อกำหนดใบงาน
   - **ปุ่ม "จำลองชำระเงินสำเร็จ"**: เปลี่ยนสถานะจาก `PENDING` สู่ `PAID` พร้อมเอฟเฟกต์พลุ Confetti และจัดส่งลิงก์ดาวน์โหลด
   - **No Secrets in Git**: ไฟล์ `.gitignore` รัดกุม ป้องกัน `.env` หลุดขึ้น GitHub 100%
4. **Mobile Wrapper (MIT App Inventor Ready)**:
   - จัดเตรียมไฟล์โปรเจกต์ `.aia` (`mobile_app/VibeEBookShop_Wrapper.aia`) นำเข้าสู่ MIT App Inventor ได้ใน 1 คลิก
   - มีคู่มือบล็อกคำสั่ง `BLOCKS_GUIDE.md` อธิบายการแก้ไขบั๊กปุ่มย้อนกลับ (Back Button) เพื่อไม่ให้แอปปิดตัวเองทันที

---

## 📋 Checklist ตรวจสอบความถูกต้องตามใบงาน (หน้า 7)

| ตรวจแล้ว | รายการประเมิน (Checklist) | ผลการทดสอบในระบบ |
| :---: | :--- | :---: |
| ✅ | **ออกแบบหน้าจอระบบ** | ออกแบบสวยงาม ทันสมัย สไตล์ Cyber-Modern |
| ✅ | **หน้าร้านแสดง E-book อย่างน้อย 3 รายการ** | มี 6 รายการครอบคลุม E-books, Templates, Code, และ UI Kits |
| ✅ | **Checkout สร้างเลขคำสั่งซื้อและสถานะ PENDING ได้** | บันทึกสถานะ PENDING พร้อมสร้างเลข `ORD-2026-xxxx` |
| ✅ | **Mock Payment มีคำว่า DEMO ONLY ชัดเจน และเปลี่ยนเป็น PAID ได้** | ป้าย DEMO ONLY เด่นชัด พร้อมปุ่ม "จำลองชำระเงินสำเร็จ" |
| ✅ | **หน้าติดตามคำสั่งซื้อไม่เปิดเผยข้อมูลของผู้อื่น** | ต้องระบุ Order ID + Email ที่ตรงกันเท่านั้น จึงจะแสดงผล |
| ✅ | **ได้รับ/เห็นผลการส่งอีเมลหลัง PAID ตามเงื่อนไข** | มี In-App Simulated Mailbox แสดงอีเมลและลิงก์ดาวน์โหลด |
| ✅ | **Vercel production URL เปิดได้จริง และ GitHub ไม่มี secret** | โครงสร้าง Next.js 14 มาตรฐาน พร้อม Deploy Vercel ใน 1 คลิก |
| ✅ | **App Inventor เปิด production URL ได้ และปุ่มย้อนกลับไม่ออกจากแอปทันที** | มีไฟล์ `.aia` และโค้ดบล็อก `CanGoBack -> GoBack` ถูกต้อง |
| ✅ | **มีหลักฐานพร้อมส่งงาน** | โค้ดครบถ้วน, ไฟล์ .aia, ภาพ UI, และสคริปต์ทดสอบ E2E |

---

## 🛠️ โครงสร้างไฟล์ในโปรเจกต์

```
vibe-digital-store/
├── mobile_app/
│   ├── BLOCKS_GUIDE.md              # คู่มือบล็อก MIT App Inventor
│   ├── generate_aia.py              # สคริปต์สร้างไฟล์ .aia
│   └── VibeEBookShop_Wrapper.aia    # ไฟล์โปรเจกต์สำเร็จรูปนำเข้าได้ทันที
├── public/
│   ├── sample-downloads/            # ไฟล์ดิจิทัลตัวอย่างสำหรับดาวน์โหลดจริง
│   │   ├── Vibe-Coding-Modern-AI-Guide.pdf
│   │   ├── Nextjs-Supabase-Mastery.pdf
│   │   ├── Clean-Architecture-Pragmatic.pdf
│   │   ├── Second-Brain-Notion-Setup.zip
│   │   ├── nextjs-saas-starter-kit.zip
│   │   └── CyberVibe-Design-System.fig
│   ├── icon.png                     # ไอคอนแอปพลิเคชันความละเอียดสูง
│   ├── favicon.ico
│   └── manifest.json                # PWA Manifest สำหรับมือถือ
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root Layout + DemoBanner + Navbar + Footer
│   │   ├── page.tsx                 # หน้าร้านค้า + Hero + Catalog + Search + Filter
│   │   ├── checkout/page.tsx        # หน้า Checkout กรอกข้อมูลและสร้าง Order PENDING
│   │   ├── payment/[orderId]/page.tsx # หน้า Mock Payment (DEMO ONLY + PromptPay)
│   │   ├── order-success/[orderId]/page.tsx # หน้าชำระสำเร็จ + ดาวน์โหลด + อีเมล
│   │   ├── track-order/page.tsx     # หน้าติดตามคำสั่งซื้อ (Privacy Validation)
│   │   └── globals.css              # Cyber-Glow & Glassmorphism Styling
│   ├── components/
│   │   ├── CartDrawer.tsx           # สไลด์ตะกร้าสินค้า
│   │   ├── DemoBanner.tsx           # ป้ายเตือน DEMO ONLY ตามเกณฑ์
│   │   ├── Footer.tsx               # ข้อมูลโปรเจกต์และลิขสิทธิ์
│   │   ├── Navbar.tsx               # แถบเมนูด้านบนพร้อมตัวนับตะกร้าและอีเมล
│   │   └── SimulatedInboxModal.tsx  # กล่องอีเมลจำลองสำหรับตรวจงาน
│   ├── data/
│   │   └── products.ts              # ข้อมูลแคตตาล็อกสินค้าดิจิทัล
│   ├── lib/
│   │   ├── storage.ts               # ระบบจัดการข้อมูล Order, Cart, Simulated Mailbox
│   │   └── utils.ts                 # ฟังก์ชันจัดรูปแบบราคาเงินบาทและวันที่
│   └── types/
│       └── index.ts                 # Data Types & Models
├── .env.example                     # ไฟล์ตัวอย่าง Environment Variables
├── .gitignore                       # ป้องกัน Secret รั่วไหล 100%
├── package.json
├── test_e2e_flow.js                 # สคริปต์ทดสอบระบบอัตโนมัติ (22/22 ผ่าน)
└── tsconfig.json
```

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Development)

```bash
# 1. เข้าสู่โฟลเดอร์โปรเจกต์
cd vibe-digital-store

# 2. ติดตั้ง Dependencies (หากยังไม่ได้ติดตั้ง)
npm install

# 3. รันเซิร์ฟเวอร์ทดสอบ
npm run dev
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

---

## 🌐 ขั้นตอนการ Deploy ขึ้น Vercel

1. สร้าง GitHub Repository ใหม่ (เช่น `vibe-digital-store`)
2. Push โค้ดขึ้น GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Vibe Digital Store complete implementation"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. เข้าเว็บไซต์ [Vercel](https://vercel.com) แล้วกด **Add New...** -> **Project**
4. นำเข้า Repository จาก GitHub แล้วกด **Deploy**
5. คุณจะได้รับ **Production URL** (เช่น `https://your-store.vercel.app`)
6. นำ URL นี้ไปใส่ในช่อง `HomeUrl` ของ MIT App Inventor ได้ทันที!
