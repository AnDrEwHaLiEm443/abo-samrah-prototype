// Shared prototype "backend": everything lives in localStorage so the shop and dashboard stay in sync (same origin).
const KEY = 'abosamra_db_v1';
const today = () => new Date().toISOString().slice(0, 10);
const addDays = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const uid = p => p + Math.random().toString(36).slice(2, 8).toUpperCase();
const egp = n => Math.round(n * 100) / 100 + ' ج.م';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const CHEESE = { n: 'جبنة موتزاريلا', p: 10 }, NO = [{ n: 'بدون ثومية', p: 0 }, { n: 'بدون مخلل', p: 0 }, { n: 'سبايسي', p: 0 }];
function seed() {
  const it = (cat, name, img, sizes, extras = [], desc = '', badge = '') => ({ id: uid('I'), cat, name, img: 'img/' + img + '.jpg', desc, badge, sizes, extras, active: true });
  const sm = (m, l) => [{ n: 'وسط', p: m }, { n: 'كبير', p: l }];
  return {
    settings: { shop: [29.9935, 31.159], vat: 14, freeOver: 500, minOrder: 60, pointsPer: 10, pointValue: 0.1, minRedeem: 100,
      zones: [{ km: 2, fee: 10 }, { km: 4, fee: 20 }, { km: 6, fee: 30 }], open: true },
    cats: ['شاورما', 'سوري', 'فتات', 'وجبات', 'مشويات', 'بوكسات', 'لحوم', 'حواوشي', 'بطاطس ومقبلات'],
    items: [
      it('شاورما', 'شاورما دجاج', 'shawarma', sm(70, 80), [CHEESE, ...NO], 'شاورما فراخ على الفحم بالثومية والمخلل', 'الأكثر طلباً'),
      it('شاورما', 'شاورما دجاج ماروخ', 'shawarma', [{ n: 'عادي', p: 100 }], [{ n: 'جبنة', p: 15 }, ...NO], 'عيش ماروخ محمص'),
      it('شاورما', 'شاورما ماريا دجاج ماج', 'wraps', [{ n: 'عادي', p: 150 }], [CHEESE, ...NO], 'الماريا الأصلية بالجبنة', 'جديد'),
      it('شاورما', 'شاورما عيش شامي', 'fries_wrap', [{ n: 'عادي', p: 45 }], NO),
      it('شاورما', 'شاورما كايزر', 'syrian', [{ n: 'عادي', p: 40 }], NO),
      ...['مكسيكان حار', 'شيش طاووق', 'زنجر حار', 'كرسبي'].map(n => it('سوري', n, 'syrian', [{ n: 'سوري', p: 90 }, { n: 'فرنساوي', p: 100 }], [CHEESE, ...NO])),
      it('سوري', 'شاورما فرنساوي', 'syrian', [{ n: 'فرنساوي', p: 100 }], [CHEESE, ...NO]),
      it('فتات', 'فتة شاورما', 'fatta', [{ n: 'صغير', p: 90 }, { n: 'وسط', p: 125 }, { n: 'كبير', p: 145 }], [CHEESE], 'تقدم مع بطاطس', 'الأكثر طلباً'),
      it('فتات', 'فتة زنجر', 'fatta', [{ n: 'صغير', p: 110 }, { n: 'وسط', p: 140 }, { n: 'كبير', p: 170 }], [CHEESE]),
      it('فتات', 'فتة كرسبي', 'fatta', [{ n: 'صغير', p: 110 }, { n: 'وسط', p: 140 }, { n: 'كبير', p: 170 }], [CHEESE]),
      ...['كريسبي', 'زنجر', 'شيش طاووق', 'ميكسيكانو حار', 'فاهيتا دجاج'].map(n => it('وجبات', 'وجبة ' + n, 'meal', [{ n: 'عادي', p: 215 }], [CHEESE], 'مع أرز + مخلل + بطاطس + عيش')),
      it('وجبات', 'وجبة مكس أبو سمرة', 'platter', [{ n: 'عادي', p: 260 }], [CHEESE], 'مع أرز + مخلل + بطاطس + عيش', 'مميز'),
      it('وجبات', 'وجبة دجاج عربي', 'wraps', [{ n: 'سنجل', p: 110 }, { n: 'دبل', p: 210 }, { n: 'عائلي', p: 350 }], [{ n: 'بالجبنة (سنجل)', p: 15 }]),
      it('مشويات', 'فرخة مشوية', 'chicken', [{ n: 'ربع ورك', p: 95 }, { n: 'ربع صدر', p: 125 }, { n: 'نص فرخة', p: 200 }, { n: 'فرخة كاملة', p: 370 }], [{ n: 'طبق رز', p: 35 }, { n: 'علبة ثومية', p: 30 }], 'على الفحم مع رز'),
      it('مشويات', 'دجاج مسحب', 'chicken', [{ n: 'ربع ورك', p: 105 }, { n: 'ربع صدر', p: 130 }, { n: 'نص', p: 200 }, { n: 'كامل', p: 380 }], [{ n: 'طبق رز', p: 35 }]),
      it('بوكسات', 'بوكس السداد', 'platter', [{ n: 'عادي', p: 200 }], [], 'ربع ورك + 2 قطعة كريسبي'),
      it('بوكسات', 'بوكس الأكيل', 'platter', [{ n: 'عادي', p: 170 }], [], '6 قطع شاورما دجاج + 2 قطعة كريسبي'),
      it('بوكسات', 'بوكس الأدرينالين', 'platter', [{ n: 'عادي', p: 270 }], [], '12 قطعة شاورما + 3 قطع كريسبي', 'عرض'),
      ...[['مكس فراخ', 100], ['كفتة', 90], ['فاهيتا فراخ', 90], ['بانيه', 90]].map(([n, p]) => it('لحوم', n, n == 'كفتة' ? 'meat' : 'kofta', [{ n: 'عادي', p }], [CHEESE])),
      it('حواوشي', 'حواوشي سوري', 'hawawshi', [{ n: 'عادي', p: 90 }], [{ n: 'جبنة', p: 10 }]),
      it('حواوشي', 'تريند الشيبسي', 'trend', [{ n: 'عادي', p: 70 }, { n: 'علبة فاهيتا', p: 120 }], [{ n: 'جبنة', p: 15 }], '', 'ترند'),
      it('بطاطس ومقبلات', 'بطاطس سوري', 'fries_wrap', [{ n: 'سادة', p: 25 }, { n: 'جبنة', p: 50 }, { n: 'بالبانيه', p: 60 }, { n: 'بالكرسبي', p: 60 }]),
      it('بطاطس ومقبلات', 'طبق بطاطس شيدر', 'fries', [{ n: 'عادي', p: 65 }, { n: 'شاورما شيدر', p: 85 }]),
      it('بطاطس ومقبلات', 'علبة ثومية', 'fries', [{ n: 'صغيرة', p: 30 }, { n: 'كبيرة', p: 40 }]),
    ],
    offers: [
      { id: uid('O'), title: 'خصم 20% على الفتات', sub: 'استخدم كود FATTA20', img: 'img/fatta.jpg', color: '#E85319', from: today(), to: addDays(14), active: true },
      { id: uid('O'), title: '2 شاورما كبير + هدية', sub: 'بـ 185 ج فقط', img: 'img/shawarma.jpg', color: '#1b120d', from: today(), to: addDays(30), active: true },
      { id: uid('O'), title: 'توصيل مجاني', sub: 'للطلبات فوق 500 ج', img: 'img/platter.jpg', color: '#c2410c', from: today(), to: addDays(60), active: true },
    ],
    coupons: [
      { code: 'FATTA20', type: 'pct', value: 20, min: 100, max: 60, from: today(), to: addDays(14), active: true },
      { code: 'WELCOME', type: 'fixed', value: 30, min: 150, max: 0, from: today(), to: addDays(90), active: true },
    ],
    users: [], orders: [], chats: {},
    employees: [
      { id: 'E1', name: 'المدير العام', user: 'admin', pass: '1234', role: 'admin' },
      { id: 'E2', name: 'أحمد - مدير فرع', user: 'manager', pass: '1234', role: 'manager' },
      { id: 'E3', name: 'محمد - كاشير', user: 'cashier', pass: '1234', role: 'cashier' },
      { id: 'E4', name: 'شيف حسن', user: 'kitchen', pass: '1234', role: 'kitchen' },
      { id: 'E5', name: 'سارة - خدمة عملاء', user: 'support', pass: '1234', role: 'support' },
      { id: 'E6', name: 'كريم - طيار', user: 'driver', pass: '1234', role: 'driver' },
    ],
  };
}
const DB = {
  get() { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) return d; } catch {} const d = seed(); this.set(d); return d; },
  set(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { alert('مساحة التخزين ممتلئة — استخدم صور أصغر'); } },
  edit(fn) { const d = this.get(); const r = fn(d); this.set(d); return r; },
  reset() { localStorage.removeItem(KEY); location.reload(); },
};
const onDB = fn => addEventListener('storage', e => e.key === KEY && fn());

const STATUS = { new: 'تم الاستلام', accepted: 'تم التأكيد', preparing: 'جاري التحضير', ready: 'جاهز', on_way: 'في الطريق', delivered: 'تم التوصيل', cancelled: 'ملغي' };
const FLOW = ['new', 'accepted', 'preparing', 'ready', 'on_way', 'delivered'];
const PREFS = { call: '📞 اتصل عند الوصول', bell: '🔔 اضغط الجرس', nobell: '🤫 لا تضغط الجرس (أطفال نائمين)', door: '🚪 اترك الطلب عند الباب' };
const LABELS = { home: '🏠 المنزل', work: '💼 العمل', office: '🏢 المكتب', family: '👨‍👩‍👧 العائلة', other: '📍 أخرى' };

const inRange = (o, d = today()) => o.active && (!o.from || o.from <= d) && (!o.to || o.to >= d);
const linePrice = l => (l.size.p + l.extras.reduce((a, e) => a + e.p, 0)) * l.qty;
function distKm([a, b], [c, d]) {
  const r = x => x * Math.PI / 180, R = 6371, dl = r(c - a), dn = r(d - b);
  return 2 * R * Math.asin(Math.sqrt(Math.sin(dl / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(dn / 2) ** 2));
}
function deliveryFee(db, ll, sub) {
  if (!ll) return null;
  const km = distKm(db.settings.shop, ll), z = db.settings.zones.find(z => km <= z.km);
  if (!z) return { km, fee: null };
  return { km, fee: sub >= db.settings.freeOver ? 0 : z.fee };
}
function checkCoupon(db, code, sub) {
  const c = db.coupons.find(c => c.code.toUpperCase() === String(code).trim().toUpperCase());
  if (!c || !inRange(c)) return { err: 'الكود غير صالح أو منتهي' };
  if (sub < c.min) return { err: `الحد الأدنى للطلب ${c.min} ج` };
  let v = c.type === 'pct' ? sub * c.value / 100 : c.value;
  if (c.max) v = Math.min(v, c.max);
  return { c, v: Math.min(v, sub) };
}
// Egyptian VAT (14%) is already included in menu prices; we only show the included portion.
function totals(db, cart, { ll, coupon, usePoints, points = 0 } = {}) {
  const sub = cart.reduce((a, l) => a + linePrice(l), 0);
  const cp = coupon ? checkCoupon(db, coupon, sub) : null, disc = cp && !cp.err ? cp.v : 0;
  const s = db.settings, ptsUse = usePoints && points >= s.minRedeem ? Math.min(points, Math.floor((sub - disc) / s.pointValue)) : 0;
  const ptsDisc = ptsUse * s.pointValue, d = deliveryFee(db, ll, sub - disc);
  const total = Math.max(0, sub - disc - ptsDisc + (d?.fee || 0));
  return { sub, cp, disc, ptsUse, ptsDisc, d, total, vat: total * s.vat / (100 + s.vat), earn: Math.floor((sub - disc) / s.pointsPer) };
}
