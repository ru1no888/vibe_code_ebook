# คู่มือการสร้างและตั้งค่า Mobile App (MIT App Inventor)

เอกสารนี้จัดทำตามข้อกำหนดใน **"ใบงานฉบับกระชับ: Vibe Coding: E-book Shop" (หน้า 5 และหน้า 6)** เพื่อสร้าง Android Mobile Wrapper ด้วย **MIT App Inventor**

---

## 1. ข้อมูลสำคัญในการตั้งค่า Designer

| คอมโพเนนต์ (Component) | คุณสมบัติ (Property) | ค่าที่ต้องกำหนด (Setting Value) | เหตุผล / ข้อกำหนด |
| :--- | :--- | :--- | :--- |
| **Screen1** | `AppName` | `VibeStore` | ชื่อแอปที่แสดงบนหน้าจอมือถือ |
| **Screen1** | `Title` | `Vibe Digital Store` | ชื่อแถบ Title Bar ตามชื่อร้าน |
| **Screen1** | `Sizing` | `Responsive` | ให้ UI ขยายตามขนาดหน้าจอทุกรุ่น |
| **Screen1** | `Icon` | `icon.png` | ไอคอนแอปพลิเคชัน |
| **WebViewer1** | `Width` | `Fill parent...` (-2) | ขยายเต็มความกว้างหน้าจอ |
| **WebViewer1** | `Height` | `Fill parent...` (-2) | ขยายเต็มความสูงหน้าจอ |
| **WebViewer1** | `HomeUrl` | `https://vibe-digital-store.vercel.app` (หรือ Production URL ของคุณ) | URL ของเว็บที่ Deploy บน Vercel เท่านั้น (ห้ามใช้ localhost) |
| **WebViewer1** | `FollowLinks` | `True` (ติ๊กถูก) | อนุญาตให้คลิกลิงก์ภายในเว็บได้ต่อเนื่อง |
| **WebViewer1** | `IgnoreSslErrors` | `False` (ห้ามติ๊ก) | **ข้อห้ามเด็ดขาด (หน้า 5):** ห้ามตั้งเป็น true เพื่อความปลอดภัยของข้อมูล |
| **WebViewer1** | `UsesLocation` | `False` (ไม่ติ๊ก) | ไม่เรียกขอสิทธิ์ GPS พิกัดตำแหน่ง |

---

## 2. การต่อบล็อกคำสั่ง (Blocks Programming)

### ปัญหาที่พบบ่อย (Common Bug):
หากไม่ดักจับปุ่ม Back บนมือถือ เมื่อผู้ใช้เปิดหน้าสินค้าแล้วกดปุ่ม "ย้อนกลับ" ของมือถือ Android ตัวแอปจะปิดตัวเองทันทีแทนที่จะย้อนกลับไปหน้าก่อนหน้าในเว็บเบราว์เซอร์

### บล็อกคำสั่งที่ถูกต้อง (ตามข้อกำหนดหน้า 5):
```
when Screen1.BackPressed do
    if call WebViewer1.CanGoBack then
        call WebViewer1.GoBack
    else
        close application
```

### คำอธิบายการทำงาน:
1. เมื่อผู้ใช้กดปุ่ม Back บนอุปกรณ์ Android (`Screen1.BackPressed`)
2. ระบบจะตรวจสอบก่อนว่า `WebViewer1` มีประวัติหน้าก่อนหน้าให้ย้อนกลับหรือไม่ (`WebViewer1.CanGoBack`)
3. ถ้า **มี** (`True`): สั่งให้ WebViewer ย้อนกลับไปหน้าก่อนหน้า (`call WebViewer1.GoBack`)
4. ถ้า **ไม่มี** (`False`): ผู้ใช้อยู่ที่หน้าแรกสุดแล้ว จึงอนุญาตให้ออกจากแอปพลิเคชัน (`close application`)

---

## 3. ขั้นตอนการนำเข้าไฟล์โปรเจกต์ (.aia) ใน 1 นาที

ทีมงานได้สร้างไฟล์สำเร็จรูปไว้ให้แล้วที่:
`mobile_app/VibeEBookShop_Wrapper.aia`

### วิธีใช้งาน:
1. เข้าเว็บไซต์ [MIT App Inventor](http://ai2.appinventor.mit.edu/)
2. เข้าสู่ระบบด้วย Google Account
3. ไปที่เมนู **Projects** -> **Import project (.aia) from my computer...**
4. เลือกไฟล์ `VibeEBookShop_Wrapper.aia` จากเครื่อง
5. ในหน้า Designer ให้คลิกที่ `WebViewer1` แล้วเปลี่ยน `HomeUrl` เป็น Production URL ของคุณที่ Deploy บน Vercel
6. ทดสอบผ่านแอป **MIT AI2 Companion** บนมือถือ หรือกดเมนู **Build** -> **Android App (.apk)** เพื่อดาวน์โหลดไฟล์ไปติดตั้งบนโทรศัพท์จริง
