import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, customerName, orderId, downloadUrl, items, totalAmount } = body;

    if (!to || !orderId) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลอีเมลหรือหมายเลขคำสั่งซื้อไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    // If Resend API Key is configured in environment, dispatch actual email!
    if (resendApiKey) {
      const itemsListHtml = Array.isArray(items)
        ? items
            .map(
              (i: any) =>
                '<li><strong>' +
                (i.title || '') +
                '</strong> - ' +
                (i.price || '') +
                ' บาท (' +
                (i.fileFormat || 'PDF') +
                ')</li>'
            )
            .join('')
        : '';
      const emailHtml =
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">' +
        '<h2 style="color: #102a2f; margin-top: 0;">คำสั่งซื้อ #' +
        orderId +
        ' ชำระเงินสำเร็จ</h2>' +
        '<p>เรียนคุณ <strong>' +
        (customerName || 'ผู้มีอุปการคุณ') +
        '</strong>,</p>' +
        '<p>ขอบคุณสำหรับการสั่งซื้อ E-Book จาก <strong>Vibe Coding Digital Store</strong></p>' +
        '<div style="background-color: #f4efe5; padding: 15px; border-radius: 6px; margin: 20px 0;">' +
        '<h4 style="margin-top: 0; color: #a54727;">รายการสินค้าดิจิทัลที่สั่งซื้อ:</h4>' +
        '<ul>' +
        itemsListHtml +
        '</ul>' +
        '<p style="margin-bottom: 0;"><strong>ยอดรวมทั้งสิ้น:</strong> ' +
        totalAmount +
        ' บาท</p>' +
        '</div>' +
        '<div style="text-align: center; margin: 30px 0;">' +
        '<a href="' +
        downloadUrl +
        '" style="background-color: #c85f35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">' +
        'ดาวน์โหลดไฟล์ E-Book ของคุณ' +
        '</a>' +
        '</div>' +
        '<p style="font-size: 12px; color: #666;">' +
        '* ลิงก์ดาวน์โหลดมีความปลอดภัยและมีอายุการใช้งาน 48 ชั่วโมง<br/>' +
        '* หากพบปัญหา สามารถนำ Order ID (' +
        orderId +
        ') และอีเมล (' +
        to +
        ') ไปตรวจสอบที่หน้า "ติดตามคำสั่งซื้อ" ได้ตลอดเวลา' +
        '</p>' +
        '<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />' +
        '<p style="font-size: 11px; color: #999; text-align: center;">Vibe Coding Digital Store — E-Books from Real Projects</p>' +
        '</div>';

      let fromAddress = process.env.EMAIL_FROM || 'Vibe Store <onboarding@resend.dev>';

      let response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + resendApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject: '[Vibe Store] ยืนยันการชำระเงินและลิงก์ดาวน์โหลด E-Book (#' + orderId + ')',
          html: emailHtml,
        }),
      });

      // If domain verification is still in progress and custom domain fails, fallback to onboarding@resend.dev
      if (!response.ok && !fromAddress.includes('onboarding@resend.dev')) {
        const errorText = await response.text();
        console.warn('Custom domain send failed, falling back to onboarding@resend.dev. Error was:', errorText);
        response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + resendApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Vibe Store <onboarding@resend.dev>',
            to: [to],
            subject: '[Vibe Store] ยืนยันการชำระเงินและลิงก์ดาวน์โหลด E-Book (#' + orderId + ')',
            html: emailHtml,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.text();
        console.warn('Resend API response error:', errorData);
        return NextResponse.json({
          success: true,
          realEmailSent: false,
          simulated: true,
          message: 'บันทึกในกล่องอีเมลจำลอง (Resend API ตอบกลับข้อผิดพลาด)',
        });
      }

      const resData = await response.json();
      return NextResponse.json({
        success: true,
        realEmailSent: true,
        messageId: resData.id,
        message: 'ส่งอีเมลจริงไปยัง ' + to + ' สำเร็จเรียบร้อยแล้ว',
      });
    }

    // Default Fallback: Simulated Email Confirmation
    return NextResponse.json({
      success: true,
      realEmailSent: false,
      simulated: true,
      message: 'จำลองการส่งข้อมูลเข้าอีเมล ' + to + ' เรียบร้อย (สามารถดูฉบับเต็มได้ในกล่องอีเมลจำลอง)',
    });
  } catch (error: any) {
    console.error('Error in send-email route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}
