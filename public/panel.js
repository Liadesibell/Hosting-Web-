// SHARED CHANNEL STATE: page shell, current route, and authenticated account.
const page = document.querySelector('#page-content');
const toast = document.querySelector('#toast');
const paymentDialog = document.querySelector('#payment-dialog');
const paymentBody = document.querySelector('#payment-body');
const paymentProductLabel = document.querySelector('#payment-product');
// CHANNEL LABELS: navigation and reusable interface copy.
const dictionary = {
  tr: { customerArea: 'MÜŞTERİ ALANI', overview: 'Genel Bakış', packages: 'Paketler', domains: 'Domain Sorgula', services: 'Hizmetler', support: 'Destek Talepleri', payments: 'Sipariş ve Ödeme', assistant: 'KökHost AI', admin: 'Yönetim', language: 'DİL / LANGUAGE', activeAccount: 'Aktif hesap', logout: 'Güvenli çıkış', portalLabel: 'KÖKHOST / MÜŞTERİ PANELİ', backToSite: 'Siteye dön ↗', welcome: 'Tekrar hoş geldiniz.', dashboardIntro: 'Hosting hizmetlerinizi ve destek taleplerinizi tek yerden yönetin.', orders: 'Son siparişler', tickets: 'Destek talepleri', pending: 'Bekleyen ödemeler', noOrders: 'Henüz paket siparişiniz yok.', noTickets: 'Açık destek talebiniz bulunmuyor.', explore: 'Paketleri keşfet', all: 'Tüm paketler', campaigns: 'Kampanyalar', buy: 'Paketi seç', domainIntro: 'Alan adının durumunu RDAP kayıtlarından sorgulayın.', search: 'Sorgula', supportIntro: 'Talebinizi oluşturun; size özel takip numarasıyla durumunu izleyin.', createTicket: 'Yeni destek talebi', subject: 'Konu', category: 'Kategori', description: 'Talebinizi açıklayın', send: 'Gönder', paymentIntro: 'Paket siparişlerinizi ve ödeme durumlarını takip edin.', assistantIntro: 'Hosting ve alan adı sorularınız için KökHost AI.', adminIntro: 'Destek taleplerini ve banka transferlerini yönetin.', read: 'E-posta açıldı', unread: 'E-posta henüz açılmadı', answered: 'Yanıtlandı', reply: 'Yanıt yazın', sendReply: 'Yanıtı gönder', user: 'Kullanıcı', status: 'Durum', amount: 'Tutar', date: 'Tarih', method: 'Yöntem', noPayments: 'Henüz bir ödeme kaydı yok.', pendingTransfer: 'Transfer bekliyor', markPaid: 'Havale geldi · onayla', checking: 'Sorgulanıyor…', available: 'Müsait görünüyor', registered: 'Kayıtlı', unknown: 'Durum doğrulanamadı', iban: 'IBAN ile havale / EFT', selectPayment: 'Ödeme yöntemini seçin', accountName: 'Kart sahibi / ad soyad', phone: 'Telefon', address: 'Fatura adresi', pay: 'Güvenli ödeme adımına geç', tryAgain: 'Yeniden dene' },
  en: { customerArea: 'CUSTOMER AREA', overview: 'Overview', packages: 'Packages', domains: 'Domain search', support: 'Support tickets', payments: 'Orders & payments', assistant: 'KökHost AI', admin: 'Administration', language: 'LANGUAGE', activeAccount: 'Active account', logout: 'Sign out securely', portalLabel: 'KÖKHOST / CUSTOMER PANEL', backToSite: 'Back to site ↗', welcome: 'Welcome back.', dashboardIntro: 'Manage hosting services and support requests in one place.', orders: 'Recent orders', tickets: 'Support tickets', pending: 'Pending payments', noOrders: 'You do not have any package orders yet.', noTickets: 'No support tickets yet.', explore: 'Explore packages', all: 'All packages', campaigns: 'Campaigns', buy: 'Choose package', domainIntro: 'Check domain status using RDAP registry data.', search: 'Search', supportIntro: 'Create a request and track it with your unique reference number.', createTicket: 'New support ticket', subject: 'Subject', category: 'Category', description: 'Describe your request', send: 'Submit', paymentIntro: 'Track package orders and payment status.', assistantIntro: 'Ask KökHost AI about hosting and domains.', adminIntro: 'Manage support requests and bank transfers.', read: 'Email opened', unread: 'Email not opened yet', answered: 'Answered', reply: 'Write a reply', sendReply: 'Send reply', user: 'Customer', status: 'Status', amount: 'Amount', date: 'Date', method: 'Method', noPayments: 'No payment records yet.', pendingTransfer: 'Transfer pending', markPaid: 'Transfer received · confirm', iban: 'Bank transfer via IBAN', selectPayment: 'Choose a payment method', accountName: 'Cardholder / full name', phone: 'Phone', address: 'Billing address', pay: 'Continue to secure payment', tryAgain: 'Try again' },
  de: { customerArea: 'KUNDENBEREICH', overview: 'Übersicht', packages: 'Pakete', domains: 'Domain suchen', support: 'Supportanfragen', payments: 'Bestellungen & Zahlungen', assistant: 'KökHost AI', admin: 'Verwaltung', language: 'SPRACHE', activeAccount: 'Aktives Konto', logout: 'Sicher abmelden', portalLabel: 'KÖKHOST / KUNDENPORTAL', backToSite: 'Zur Website ↗', welcome: 'Willkommen zurück.', dashboardIntro: 'Verwalten Sie Hosting und Support an einem Ort.', orders: 'Letzte Bestellungen', tickets: 'Supportanfragen', pending: 'Offene Zahlungen', noOrders: 'Noch keine Paketbestellungen.', noTickets: 'Noch keine Supportanfragen.', explore: 'Pakete entdecken', all: 'Alle Pakete', campaigns: 'Angebote', buy: 'Paket auswählen', domainIntro: 'Prüfen Sie Domains anhand von RDAP-Registrierungsdaten.', search: 'Suchen', supportIntro: 'Erstellen Sie eine Anfrage mit persönlicher Referenznummer.', createTicket: 'Neue Supportanfrage', subject: 'Betreff', category: 'Kategorie', description: 'Anfrage beschreiben', send: 'Senden', paymentIntro: 'Bestellungen und Zahlungsstatus verfolgen.', assistantIntro: 'Fragen Sie KökHost AI zu Hosting und Domains.', adminIntro: 'Supportanfragen und Überweisungen verwalten.', read: 'E-Mail geöffnet', unread: 'E-Mail noch nicht geöffnet', answered: 'Beantwortet', reply: 'Antwort schreiben', sendReply: 'Antwort senden', user: 'Kunde', status: 'Status', amount: 'Betrag', date: 'Datum', method: 'Methode', noPayments: 'Noch keine Zahlungen.', pendingTransfer: 'Überweisung ausstehend', markPaid: 'Überweisung erhalten · bestätigen', iban: 'Überweisung per IBAN', selectPayment: 'Zahlungsart wählen', accountName: 'Name des Karteninhabers', phone: 'Telefon', address: 'Rechnungsadresse', pay: 'Weiter zur sicheren Zahlung', tryAgain: 'Erneut versuchen' },
  ar: { customerArea: 'منطقة العملاء', overview: 'نظرة عامة', packages: 'الباقات', domains: 'بحث النطاقات', support: 'طلبات الدعم', payments: 'الطلبات والمدفوعات', assistant: 'مساعد كوك هوست', admin: 'الإدارة', language: 'اللغة', activeAccount: 'حساب نشط', logout: 'تسجيل خروج آمن', portalLabel: 'كوك هوست / لوحة العملاء', backToSite: 'العودة للموقع ↗', welcome: 'أهلاً بعودتك.', dashboardIntro: 'أدر خدمات الاستضافة وطلبات الدعم من مكان واحد.', orders: 'الطلبات الأخيرة', tickets: 'طلبات الدعم', pending: 'المدفوعات المعلقة', noOrders: 'لا توجد طلبات باقات بعد.', noTickets: 'لا توجد طلبات دعم بعد.', explore: 'استكشف الباقات', all: 'كل الباقات', campaigns: 'العروض', buy: 'اختر الباقة', domainIntro: 'تحقق من حالة النطاق عبر بيانات RDAP.', search: 'بحث', supportIntro: 'أنشئ طلباً وتابعه برقم مرجعي خاص.', createTicket: 'طلب دعم جديد', subject: 'الموضوع', category: 'الفئة', description: 'اشرح طلبك', send: 'إرسال', paymentIntro: 'تابع طلباتك وحالة الدفع.', assistantIntro: 'اسأل مساعد كوك هوست عن الاستضافة والنطاقات.', adminIntro: 'إدارة طلبات الدعم والتحويلات البنكية.', read: 'تم فتح البريد', unread: 'لم يُفتح البريد بعد', answered: 'تم الرد', reply: 'اكتب رداً', sendReply: 'إرسال الرد', user: 'العميل', status: 'الحالة', amount: 'المبلغ', date: 'التاريخ', method: 'الطريقة', noPayments: 'لا توجد سجلات دفع بعد.', pendingTransfer: 'التحويل قيد الانتظار', markPaid: 'تم استلام التحويل · تأكيد', iban: 'تحويل عبر IBAN', selectPayment: 'اختر طريقة الدفع', accountName: 'اسم حامل البطاقة', phone: 'الهاتف', address: 'عنوان الفاتورة', pay: 'متابعة إلى الدفع الآمن', tryAgain: 'حاول مجدداً' }
};

Object.assign(dictionary.en, { checking: 'Checking…', available: 'Looks available', registered: 'Registered', unknown: 'Could not verify status', rdapCaveat: 'RDAP results are indicative; verify availability with a registrar before purchase.' });
Object.assign(dictionary.de, { checking: 'Wird geprüft…', available: 'Voraussichtlich verfügbar', registered: 'Registriert', unknown: 'Status nicht bestätigt', rdapCaveat: 'RDAP-Ergebnisse sind unverbindlich. Prüfen Sie die Verfügbarkeit vor dem Kauf beim Registrar.' });
Object.assign(dictionary.ar, { checking: 'جارٍ التحقق…', available: 'يبدو متاحاً', registered: 'مسجل', unknown: 'تعذر التحقق من الحالة', rdapCaveat: 'نتائج RDAP إرشادية؛ تحقق من المسجل قبل الشراء.' });
Object.assign(dictionary.tr, { paid: 'Ödendi', paymentFailed: 'Başarısız', approvalReview: 'Yönetici onayı bekliyor', requestReceived: 'Talep alındı', newStatus: 'Yeni', readStatus: 'Okundu', bankTransfer: 'IBAN / EFT', cardPayment: 'Kart odemesi (eski kayit)', adminQueue: 'Destek kuyruğu', bankTransfers: 'IBAN transferleri', registeredMessage: 'Bu alan adı kayıtlı görünüyor.', availableMessage: 'Müsait görünüyor; kayıt kuruluşunda doğrulayın.', unknownMessage: 'Bu uzantı için kesin durum alınamadı.', rdapCaveat: 'RDAP sonuçları bilgilendirme amaçlıdır; satın almadan önce uygunluğu kayıt kuruluşundan doğrulayın.' });
Object.assign(dictionary.en, { paid: 'Paid', paymentFailed: 'Failed', requestReceived: 'Request received', newStatus: 'New', readStatus: 'Read', bankTransfer: 'IBAN / bank transfer', cardPayment: 'Kart odemesi (eski kayit)', adminQueue: 'Support queue', bankTransfers: 'Bank transfers', registeredMessage: 'This domain appears to be registered.', availableMessage: 'It may be available; confirm with a registrar.', unknownMessage: 'Could not confirm this domain suffix.' });
Object.assign(dictionary.de, { paid: 'Bezahlt', paymentFailed: 'Fehlgeschlagen', requestReceived: 'Anfrage erhalten', newStatus: 'Neu', readStatus: 'Gelesen', bankTransfer: 'IBAN / Überweisung', cardPayment: 'Kart odemesi (eski kayit)', adminQueue: 'Supportwarteschlange', bankTransfers: 'Banküberweisungen', registeredMessage: 'Diese Domain scheint registriert zu sein.', availableMessage: 'Möglicherweise verfügbar; beim Registrar bestätigen.', unknownMessage: 'Der Domainstatus konnte nicht bestätigt werden.' });
Object.assign(dictionary.ar, { paid: 'مدفوع', paymentFailed: 'فشل', requestReceived: 'تم استلام الطلب', newStatus: 'جديد', readStatus: 'مقروء', bankTransfer: 'تحويل بنكي / IBAN', cardPayment: 'Kart odemesi (eski kayit)', adminQueue: 'قائمة الدعم', bankTransfers: 'التحويلات البنكية', registeredMessage: 'يبدو أن هذا النطاق مسجل.', availableMessage: 'قد يكون متاحاً؛ تحقق من المسجل.', unknownMessage: 'تعذر تأكيد حالة النطاق.' });

const currentLanguage = 'tr';
let currentView = document.body.dataset.channel || 'dashboard';
const channelPages = {
  dashboard: '/panel.html',
  packages: '/packages.html',
  domains: '/domains.html',
  services: '/services.html',
  support: '/support.html',
  payments: '/payments.html',
  assistant: '/assistant.html',
  cart: '/cart.html',
  admin: '/admin.html'
};
let currentUser = null;
let isAdministrator = false;
let selectedProduct = null;
let selectedFilter = 'categories';
let customType = 'vps';
let toastTimer;
let paymentRefreshTimer;
const assistantTopics = [
  { question: 'Hangi hosting paketini seçmeliyim?', keywords: ['hangi paket', 'paket sec', 'hangi hizmet', 'hosting oner', 'ihtiyacim'], answer: 'Küçük bir site veya blog için Web Hosting Başlangıç; WordPress için WordPress Pro; mağaza için E-Ticaret Plus uygundur. Paketler kanalında özellikleri karşılaştırabilir, Hosting kategorisindeki 50 seçeneği tek sayfada inceleyebilirsiniz.' },
  { question: 'Web hosting paketlerinde neler var?', keywords: ['web hosting', 'hosting ozellik', 'nvme', 'ssl'], answer: 'Web Hosting paketleri NVMe depolama, site kapasitesi, SSL ve yedekleme özellikleri sunar. Her paketin disk, site ve destek limitlerini kartın özellikler bölümünde görebilirsiniz.' },
  { question: 'WordPress paketi ne içeriyor?', keywords: ['wordpress', 'wp paketi'], answer: 'WordPress Pro; WordPress için optimize edilmiş kaynak, önbellek, otomatik güncelleme, SSL ve günlük yedekleme içerir. Paketler > Hosting Paketleri bölümünde görüntüleyebilirsiniz.' },
  { question: 'E-ticaret sitesi için ne seçmeliyim?', keywords: ['eticaret', 'magaza', 'woocommerce', 'satis sitesi'], answer: 'E-Ticaret Plus, yoğun ziyaret alan mağazalar için önbellek, geniş depolama ve öncelikli destek sunar. Trafiğiniz veya uygulamanız büyüdüyse VDS/VPS paketlerini de karşılaştırabilirsiniz.' },
  { question: 'Kurumsal e-posta paketleri nasıl çalışır?', keywords: ['e posta', 'eposta', 'mail kutu', 'imap', 'smtp'], answer: 'E-posta Hosting kategorisinde hesap adedi ve posta kutusu kapasitesi farklı üç paket bulunur. Kendi alan adınız gerekir; IMAP, POP3 ve SMTP ile posta uygulamalarınıza bağlanabilirsiniz.' },
  { question: 'VDS ile VPS arasındaki fark nedir?', keywords: ['vds', 'vps', 'sanal sunucu', 'virtual server'], answer: 'VDS/VPS, fiziksel sunucunun sanallaştırılmış kaynaklarını ayrı bir işletim sistemiyle kullanmanızı sağlar. API, geliştirme ortamı, veritabanı veya oyun sunucusu gibi işler için uygundur. Paketler kanalındaki VDS/VPS bölümünde 50 kapasite seçeneği vardır.' },
  { question: 'Kendi sunucumu nasıl özelleştiririm?', keywords: ['ozellestir', 'ozel sunucu kur', 'cpu sec', 'ram sec', 'kaynak sec'], answer: 'Paketler > Kendi Paketini Oluştur bölümünden hizmet türünü, CPU, RAM, NVMe disk, işletim sistemi, kontrol paneli, site ve e-posta adedini seçebilirsiniz. Tahmini aylık fiyat seçimlerle birlikte güncellenir; sepet ve ödeme sırasında tutar sunucuda tekrar hesaplanır.' },
  { question: 'Windows Server seçeneği ücretli mi?', keywords: ['windows', 'isletim sistemi', 'ubuntu', 'debian', 'almalinux'], answer: 'Özelleştiricide Ubuntu Server, Debian, AlmaLinux ve Windows Server seçenekleri bulunur. Windows lisansı tahmini fiyata ek ücret ekler. Lisans ve gerçek sağlayıcı bedeli satın alma öncesinde ayrıca doğrulanmalıdır.' },
  { question: 'Paket fiyatı nasıl hesaplanıyor?', keywords: ['fiyat', 'ucret', 'aylik', 'ne kadar', 'maliyet'], answer: 'Hazır paketlerin fiyatı kartta aylık gösterilir. Özel sunucu fiyatı CPU, RAM, disk, işletim sistemi, kontrol paneli ve yedekleme tercihlerine göre hesaplanan tahmini tutardır; gerçek sağlayıcı teklifi değildir.' },
  { question: 'Kampanya fiyatı nasıl uygulanıyor?', keywords: ['kampanya', 'indirim', 'eski fiyat'], answer: 'İndirimli paketlerde güncel ve karşılaştırma amaçlı eski fiyat kartta birlikte görünür. Sepette ürünün güncel fiyatı kullanılır; kampanya koşulları satın alma öncesinde kontrol edilmelidir.' },
  { question: 'Alan adı müsait mi nasıl öğrenirim?', keywords: ['alan adi', 'domain', 'uzanti', 'tld'], answer: 'Alan Adı Sorgula kanalında tam adı yazın veya ad ve uzantıyı seçin. Sistem desteklenen uzantıları RDAP üzerinden sorgular. RDAP sonucu bilgilendirme amaçlıdır; satın almadan önce kayıt kuruluşundan doğrulayın.' },
  { question: '.tr veya .com.tr alan adı sorgusu kesin mi?', keywords: ['.tr', 'com.tr', 'turkiye domain'], answer: '.tr ve .com.tr için RDAP kaydı her zaman kesin sonuç vermeyebilir. Sistem doğrulayamadığında alan adını müsait diye işaretlemez; kayıt şartı ve müsaitlik için yetkili kayıt kuruluşunu kontrol edin.' },
  { question: 'Alan adını bu panelden satın alabilir miyim?', keywords: ['domain satin', 'alan adi satin', 'domain kaydet', 'alan adi kaydet'], answer: 'Bu panel şu anda alan adı durumunu sorgular; kayıt kuruluşundan otomatik satın alma bağlantısı yapılandırılmadı. Sorgu sonucu müsait görünse bile alan adını bir kayıt kuruluşunda ayrıca satın almanız gerekir.' },
  { question: 'DNS nedir, ne için kullanılır?', keywords: ['dns', 'nameserver', 'ns kaydi'], answer: 'DNS, alan adınızı web sunucusu, e-posta ve diğer hizmetlere yönlendirir. Yanlış DNS kayıtları site veya e-postayı erişilemez yapabilir; emin değilseniz mevcut değerleri değiştirmeden önce destek talebi açın.' },
  { question: 'Sepeti ve toplu alışverişi nasıl kullanırım?', keywords: ['sepet', 'toplu alisveris', 'birden fazla paket'], answer: 'Paket kartında Sepete ekle düğmesini kullanın. Üst menüdeki Sepet bağlantısından adet değiştirebilir veya ürünü çıkarabilirsiniz. Tüm ürünleri tek siparişte onaylayabilirsiniz; ödeme öncesi toplam sunucu tarafından doğrulanır.' },
  { question: 'IBAN ile nasıl ödeme yaparım?', keywords: ['iban', 'havale', 'eft', 'banka transfer'], answer: 'Sepette IBAN ile havale/EFT yöntemini seçip Alışverişi onayla düğmesine basın. Sistem sipariş açıklamasını ve IBAN bilgilerini gösterir. Ödeme, transfer hesaba ulaştıktan sonra yönetici tarafından elle doğrulanır.' },
  { question: 'Havale ile ödeme dışında seçenek var mı?', keywords: ['kart', 'kredi karti', 'odeme yontemi'], answer: 'Bu panelde şu anda yalnızca IBAN / EFT ile ödeme alınmaktadır. Tutar ve banka bilgileri sipariş sırasında gösterilir; transferi yaptıktan sonra ödeme bildirimi gönderip yönetici onayı bekleyin.' },
  { question: 'IBAN ile ödeme seçeneği çalışmıyor, neden?', keywords: ['odeme calismiyor', 'iban yok', 'odeme hata'], answer: 'IBAN ile ödeme için COMPANY_IBAN, BANK_NAME ve BANK_ACCOUNT_NAME ayarlarının sunucunun `.env` dosyasında tanımlanması gerekir. Ayarlar eksikse ödeme başlatılmaz. Gizli banka veya e-posta bilgilerini destek mesajında paylaşmayın.' },
  { question: 'Ödeme sonrası hizmet ne zaman açılır?', keywords: ['aktivasyon', 'ne zaman acilir', 'siparis onay', 'odeme sonrasi'], answer: 'Siparişler panelde kaydedilir. Havale, yönetici ödeme kaydını onayladıktan sonra işleme alınır. Hosting veya sunucu sağlayıcısına otomatik hizmet açma entegrasyonu henüz yapılandırılmadıysa hizmetin ayrıca elle etkinleştirilmesi gerekir.' },
  { question: 'Sipariş durumumu nereden görürüm?', keywords: ['siparis nerede', 'siparis durumu', 'odeme durumu'], answer: 'Genel Bakış bölümünde son siparişleriniz, Sipariş ve Ödeme kanalında ödeme geçmişiniz görünür. Bekleyen havale yönetici tarafından doğrulanana kadar beklemede kalır.' },
  { question: 'Destek talebi nasıl oluşturulur?', keywords: ['destek', 'sikayet', 'acik bul', 'guvenlik acigi', 'sorun bildir', 'talep olustur'], answer: 'Destek kanalında konu, kategori ve açıklamayı doldurun. Şikâyet, hata veya güvenlik açığı bildirimleri için de talep açabilirsiniz. Her talep benzersiz takip numarası alır ve yanıtlar aynı kanalda görünür.' },
  { question: 'Talebim okundu mu, yanıtlandı mı?', keywords: ['okundu', 'yanitlandi', 'cevap geldi', 'talep durumu'], answer: 'Talep durumunu Destek kanalındaki listeden izleyebilirsiniz. E-posta açılma bilgisi istemcinin izleme görselini yüklemesine bağlıdır; gizlilik araçları nedeniyle kesin okundu kanıtı değildir. Ekip yanıtı talep konuşmasında görünür.' },
  { question: 'Şifremi unuttum veya hesabıma giremiyorum.', keywords: ['sifre', 'giris yapamiyorum', 'hesap erisim', 'oturum'], answer: 'Girişte kayıt sırasında kullandığınız e-posta ve şifreyi deneyin. Bu uygulamada otomatik şifre sıfırlama e-postası henüz yapılandırılmadı; hesabınıza ulaşamıyorsanız kayıtlı adresinizle destek talebi oluşturun.' },
  { question: 'Sitemi veya e-postamı buraya taşıyabilir miyim?', keywords: ['tasima', 'migrasyon', 'site aktar', 'yedek yukle'], answer: 'Mevcut siteden dosya ve veritabanı aktarımını bu panel otomatik yapmaz. Taşıma gereksinimlerinizi bir destek talebinde belirtin; erişim şifrelerini talep mesajına yazmayın.' },
  { question: 'Yedekleme ne sıklıkta yapılıyor?', keywords: ['yedek', 'backup', 'geri yukle'], answer: 'Bazı hazır hosting paketlerinde günlük yedekleme özelliği listelenir. Özel yapılandırmada yedekleme seçeneği tahmini fiyata eklenir. Gerçek saklama süresi ve geri yükleme koşulları sağlayıcıya bağlıdır.' },
  { question: 'İptal veya iade talebi nasıl iletilir?', keywords: ['iptal', 'iade', 'para iadesi', 'abonelik bitir'], answer: 'İptal veya iade koşulları seçilen sağlayıcı ve hizmet türüne göre değişir; otomatik iade bu uygulamada yapılandırılmadı. Sipariş numaranızla Destek kanalından talep oluşturun.' },
  { question: 'Bu asistan ücretli bir AI API kullanıyor mu?', keywords: ['api key', 'api anahtari', 'yapay zeka api', 'ucretli ai', 'ucretli yapay zeka'], answer: 'Hayır. Bu asistan harici AI API çağrısı yapmaz ve API anahtarı istemez. Sorular, uygulama içinde bulunan hazır yanıtlarla yerel olarak eşleştirilir.' },
  { question: 'Yanıtı bulamazsan ne yapmalıyım?', keywords: ['canli destek', 'insanla gorus', 'baska soru', 'iletisim'], answer: 'Bu asistan yalnızca hazır ürün ve hizmet yanıtları verir. Yanıt sorununuzu çözmezse Destek kanalında konu ve açıklamayla yeni talep oluşturun; takip numaranızı saklayın.' },
  { question: 'Alan adımı başka sağlayıcıya nasıl transfer ederim?', keywords: ['domain transfer', 'alan adi transfer', 'auth code', 'epp kodu'], answer: 'Önce alan adının transfer kilidini mevcut kayıt kuruluşunda kaldırın, kayıt sahibinin e-posta adresinin çalıştığını doğrulayın ve EPP/Auth kodunu alın. Yeni kayıt kuruluşunda transfer başlatıp kodu girin; transfer tamamlanana kadar alan adını ve DNS kayıtlarını mevcut hizmette tutun. Transfer koşulları uzantıya ve kayıt kuruluşuna göre değişir; bu panel şu anda otomatik transfer yapmıyor.' },
  { question: 'Nameserver ayarını nasıl değiştiririm?', keywords: ['nameserver', 'ns kaydi', 'ns adresi'], answer: 'Nameserver, DNS kayıtlarını hangi sağlayıcının yöneteceğini belirler. Değişiklik alan adı kayıt kuruluşunun kontrol panelinde yapılır; yeni DNS bölgesinde A/AAAA, MX ve TXT kayıtlarını önceden hazırlayın. Yayılım çoğu zaman birkaç saat sürer, bazı ağlarda 24–48 saati bulabilir. Eski DNS hizmetini yayılım tamamlanana kadar kapatmayın.' },
  { question: 'A, AAAA ve CNAME DNS kayıtlarının farkı nedir?', keywords: ['a kaydi', 'aaaa', 'cname', 'dns kayit turleri'], answer: 'A kaydı bir adı IPv4 adresine, AAAA kaydı IPv6 adresine yönlendirir; CNAME başka bir alan adını takma ad olarak gösterir. Kök alan adında CNAME kullanımı DNS sağlayıcısına göre kısıtlı olabilir. Aynı isimde çakışan kayıtlar oluşturmayın; web ve e-posta için gereken kayıtları sağlayıcınızdan alın ve mevcut değerleri değiştirmeden önce dışa aktarın.' },
  { question: 'MX kaydı e-postayı nasıl yönlendirir?', keywords: ['mx kaydi', 'mail mx', 'eposta yonlendirme'], answer: 'MX kayıtları alan adınıza gelen e-postayı hangi posta sunucusunun alacağını ve sunucuların öncelik sırasını belirtir. Posta sağlayıcısının verdiği hedefi ve önceliği aynen kullanın; MX hedefi IP değil genellikle bir sunucu adıdır. Sağlayıcı değiştirirken eski posta kutularını hemen kapatmayın, DNS yayılımını ve yeni adrese gelen test postalarını doğrulayın.' },
  { question: 'SPF, DKIM ve DMARC kayıtlarını nasıl kurarım?', keywords: ['spf', 'dkim', 'dmarc', 'eposta kimlik dogrulama'], answer: 'SPF, alan adınız adına e-posta göndermeye yetkili sunucuları listeler; DKIM imzayla iletinin değiştirilmediğini doğrular; DMARC ise SPF/DKIM sonuçlarına göre alıcıların nasıl davranacağını bildirir. Kayıt değerlerini kullandığınız posta sağlayıcısından alın ve tek bir SPF kaydı içinde birleştirin. Önce DMARC politikasını raporlamayla izleyip geçerli göndericileri doğrulayın; doğrudan reddetme politikasına geçmek meşru postayı engelleyebilir.' },
  { question: 'SSL sertifikası nasıl etkinleştirilir ve yenilenir?', keywords: ['ssl sertifikasi', 'https', 'tls', 'sertifika yenileme'], answer: 'SSL/TLS sertifikası HTTPS bağlantısını şifreler ve alan adının kontrolünü doğrular. Sertifika sağlayıcısı alan adı sahipliğini DNS veya HTTP yöntemiyle doğrular; alan adının doğru sunucuya yönlendiğini ve 80/443 erişimini kontrol edin. Bu panelde sağlayıcıya otomatik sertifika kurulum entegrasyonu yoktur; sertifika durumu, yenileme ve zincir ayarlarını gerçek hosting panelinden doğrulayın.' },
  { question: 'PHP sürümünü nasıl değiştiririm?', keywords: ['php surumu', 'php version', 'php ayari'], answer: 'PHP sürümünü değiştirmeden önce sitenizin tema, eklenti ve uygulama gereksinimlerini kontrol edin; mümkünse yedek alıp önce test ortamında deneyin. Desteklenen sürümler hosting planına ve sağlayıcı paneline bağlıdır. Eski sürümler güvenlik güncellemesi almayabilir; en yeni sürüm de her eski uygulamayla uyumlu olmayabilir. Değişiklik sonrası hata günlüklerini ve kritik sayfaları kontrol edin.' },
  { question: '403 Forbidden hatasını nasıl çözerim?', keywords: ['403', 'forbidden', 'izin hatasi'], answer: '403 hatası sunucunun isteği anladığını ancak erişime izin vermediğini belirtir. Dosya sahipliği ve izinlerini, dizin içindeki index dosyasını, web sunucusu erişim kurallarını ve .htaccess yapılandırmasını kontrol edin. Her şeyi 777 yapmak güvenli değildir; izinleri en düşük gerekli seviyede tutun. Hata yakın zamanda başladıysa son yapılandırma değişikliklerini geri alın veya hata günlüğüyle destek talebi açın.' },
  { question: '404 Not Found hatası neden oluşur?', keywords: ['404', 'not found', 'sayfa bulunamadi'], answer: '404, istenen URL için içerik bulunamadığını gösterir. Alan adının doğru belge köküne yönlendiğini, dosya adının ve büyük-küçük harflerin eşleştiğini, uygulama yönlendirmelerini ve kalıcı bağlantı kurallarını kontrol edin. DNS değişikliğinden sonra eski IP önbelleği de yanlış sunucuya götürebilir. Ana sayfa çalışıp alt sayfalar çalışmıyorsa yönlendirme veya .htaccess kuralları özellikle incelenmelidir.' },
  { question: '500 Internal Server Error hatasını nasıl incelerim?', keywords: ['500', 'internal server error', 'sunucu hatasi'], answer: '500 genel bir sunucu veya uygulama hatasıdır; tek başına kök nedeni açıklamaz. Hatanın başladığı zamanı not edin, uygulama/PHP ve web sunucusu hata günlüklerini kontrol edin, son eklenti veya yapılandırma değişikliklerini gözden geçirin. Gizli anahtarları veya tam yapılandırma dosyalarını herkese açık yerde paylaşmayın. Günlükteki hata satırı ve etkilenen URL ile destek talebi açın.' },
  { question: '502, 503 veya 504 hataları ne anlama gelir?', keywords: ['502', '503', '504', 'gateway timeout', 'servis kullanilamiyor'], answer: '502 ağ geçidinin arka uçtan geçerli yanıt alamadığını, 503 hizmetin geçici olarak kullanılamadığını, 504 ise arka uç yanıtının zaman aşımına uğradığını anlatır. Sorunun tek sayfada mı tüm sitede mi olduğunu, durumun sürekliliğini ve varsa bakım duyurularını kontrol edin. Sık tekrarlanıyorsa kaynak kullanımı ve uygulama günlükleri incelenmelidir; sağlayıcı tarafındaki ağ arızasını müşteri paneli tek başına gideremez.' },
  { question: 'WordPress güncellemesini güvenli biçimde nasıl yaparım?', keywords: ['wordpress guncelleme', 'wp guncelle', 'wordpress update'], answer: 'Önce dosya ve veritabanı yedeğinin gerçekten alınabildiğini doğrulayın. WordPress çekirdeği, tema ve eklentileri güncel ve güvenilir kaynaktan yükleyin; mümkünse önce kopya/test ortamında uyumluluğu deneyin. Güncelleme sırasında bakım modunu ve PHP sürümü uyumluluğunu kontrol edin. Sonrasında yönetim paneline giriş, ana sayfa, formlar ve ödeme akışlarını test edin; sorun olursa yedek geri yükleme planınız hazır olsun.' },
  { question: 'WordPress eklentisi siteyi bozarsa ne yapmalıyım?', keywords: ['eklenti cakismasi', 'wordpress beyaz ekran', 'plugin hatasi'], answer: 'Önce hata saatini ve son etkinleştirdiğiniz eklentiyi belirleyin; dosya ve veritabanı yedeğini koruyun. Yönetim paneline erişilemiyorsa hosting dosya yöneticisi veya SFTP üzerinden ilgili eklenti klasörünü geçici olarak yeniden adlandırmak tanılama sağlayabilir, fakat canlı sitede dikkatli olun. Hata günlüğünü saklayın ve eklentiyi güncel/resmî kaynaktan doğrulayın. Erişim bilgilerinizin tamamını destek talebine yazmayın.' },
  { question: 'Veritabanı bağlantı hatasını nasıl çözerim?', keywords: ['database connection', 'veritabani baglanti', 'mysql hata'], answer: 'Uygulamadaki veritabanı adı, kullanıcı adı, parola ve sunucu/port değerlerini hosting panelindeki bilgilerle karşılaştırın. Kullanıcının doğru veritabanına gerekli izinleri olduğundan, sunucunun çalıştığından ve disk alanının dolmadığından emin olun. Parolayı değiştirirseniz uygulama yapılandırmasını da güncelleyin. Canlı veritabanı dosyasını veya parolayı destek mesajında paylaşmayın; hata metnini ve zaman bilgisini iletin.' },
  { question: 'Alan adıma e-posta hesabı nasıl kurarım?', keywords: ['kurumsal mail kurulum', 'eposta hesabi olustur', 'imap smtp ayarlari'], answer: 'Önce alan adının posta hizmeti sağlayıcısında tanımlı ve MX kayıtlarının doğru olduğundan emin olun. Posta kutusunu sağlayıcının panelinde oluşturun; istemci kurulumu için gelen sunucu, giden sunucu, kullanıcı adı ve şifre bilgilerini sağlayıcıdan alın. Şifreli bağlantı kullanın; yaygın yapılandırmalarda IMAP 993/SSL ve SMTP 587/STARTTLS görülür ancak kesin sunucu adlarını sağlayıcınız belirler. Parolanızı sohbet veya destek kaydında paylaşmayın.' },
  { question: 'Gönderdiğim e-postalar neden spam klasörüne düşüyor?', keywords: ['mail spam', 'eposta spam', 'posta teslim edilemiyor'], answer: 'Alıcı sağlayıcıları SPF, DKIM ve DMARC doğrulaması, gönderici itibarı, içerik ve IP geçmişini birlikte değerlendirir. DNS kimlik doğrulama kayıtlarını posta hizmetinizin verdiği değerlerle eşleştirin; geçersiz alıcı listelerini temizleyin ve toplu gönderimde izin/onay kurallarına uyun. DNS değişiklikleri hemen etkili olmayabilir. Tek bir sağlayıcıya teslim sorunu varsa hata kodunu (bounce) alın; teslimat garantisi verilemez.' },
  { question: 'E-posta kutum doldu, nasıl yer açarım?', keywords: ['mailbox dolu', 'posta kutusu doldu', 'mail alan temizle'], answer: 'Önce posta kutusu kullanım raporunda büyük ekleri ve kota sınırını doğrulayın. Gerekli iletileri çevrimdışı arşivleyip yedeğini kontrol ettikten sonra gereksiz klasörleri temizleyin; Çöp ve Spam klasörlerinin de kota tüketebileceğini unutmayın. Sunucudan kalıcı silme işlemi geri alınamayabilir. İş hesabıysa saklama politikası ve yasal gereksinimleri kontrol etmeden ileti silmeyin.' },
  { question: 'FTP ile SFTP arasındaki fark nedir?', keywords: ['ftp sftp', 'dosya aktarimi', 'sftp baglanti'], answer: 'FTP çoğu yapılandırmada kullanıcı bilgilerini şifrelemeden taşıyabilir; SFTP ise SSH üzerinden şifreli dosya aktarımı yapar ve genellikle tercih edilmelidir. SFTP için sağlayıcının verdiği sunucu adı, port, kullanıcı ve parola/SSH anahtarı gerekir; FTP portu ile SFTP portu aynı olmak zorunda değildir. Bağlantı bilgilerini yalnız kendi cihazınızda güvenli saklayın ve kullanılmayan hesapları kapatın.' },
  { question: 'SSH anahtarı nasıl oluşturulur ve güvenli tutulur?', keywords: ['ssh anahtari', 'public key', 'private key'], answer: 'SSH anahtar çifti yerel cihazınızda oluşturulur: açık anahtar sunucuya eklenir, özel anahtar cihazınızda kalır. Özel anahtarı kimseye göndermeyin, herkese açık depoya koymayın ve güçlü parola ile koruyun. Anahtar kaybolursa veya şüpheli erişim olursa sunucudaki ilgili açık anahtarı kaldırıp yenisini üretin. Sağlayıcıya göre SSH erişimi plan/konfigürasyon tarafından kapalı olabilir.' },
  { question: 'Güvenlik duvarında hangi portları açmalıyım?', keywords: ['firewall port', 'guvenlik duvari', 'port acma'], answer: 'Yalnızca gerçekten kullanılan hizmetlerin portlarını açın; örneğin web için çoğunlukla 80/443, uzaktan yönetim için sağlayıcıya ve işletim sistemine bağlı portlar gerekir. Yönetim portlarını tüm internete açmak yerine mümkünse IP kısıtlaması, VPN ve anahtar tabanlı erişim kullanın. Yanlış kural bağlantıyı kesebilir; değişiklikten önce mevcut kuralları yedekleyin ve sağlayıcının ağ güvenlik duvarını işletim sistemi güvenlik duvarından ayrı değerlendirin.' },
  { question: 'VDS yedeği nasıl alınır ve geri yüklenir?', keywords: ['vds yedek', 'snapshot', 'yedekten geri yukle'], answer: 'Yedek türü ve saklama süresi VDS sağlayıcısına bağlıdır; sanal makine snapshot’ı uygulama/veritabanı tutarlılığının yerini her zaman tutmaz. Önemli dosyaları ayrı bir konuma düzenli yedekleyin, yedeklerin şifreli ve erişilebilir olduğunu kontrol edin ve ara sıra geri yükleme testi yapın. Geri yükleme mevcut verileri üzerine yazabilir. İşleme başlamadan önce tarih, hedef disk ve kesinti etkisini doğrulayın.' },
  { question: 'DDoS saldırısı şüphesinde ne yapmalıyım?', keywords: ['ddos', 'trafik saldirisi', 'siteye erisilemiyor saldiri'], answer: 'Ani trafik artışı veya erişim kesintisi tek başına DDoS kanıtı değildir; sağlayıcı grafiklerini, web günlüklerini ve ağ ölçümlerini kontrol edin. Kaynak IP’leri ve zaman aralığını kaydedip barındırma sağlayıcısının acil destek kanalına iletin. Yönetim portlarını internete açık bırakmayın ve doğrulanmamış IP listelerini topluca engellemeyin. DDoS filtreleme/temizleme kapasitesi sağlayıcı altyapısına bağlıdır; bu panel şu anda ağ mitigasyonu uygulamıyor.' }
];

const assistantQuestionForms = [
  (topic, original) => original,
  (topic) => `${topic} hakkında ayrıntılı bilgi verir misin?`,
  (topic) => `${topic} nasıl yapılır?`,
  (topic) => `${topic} nasıl çalışır?`,
  (topic) => `${topic} için adımlar neler?`,
  (topic) => `${topic} adım adım anlatır mısın?`,
  (topic) => `${topic} nereden yapılır?`,
  (topic) => `${topic} işleminden önce ne hazırlamalıyım?`,
  (topic) => `${topic} işleminden sonra ne olur?`,
  (topic) => `${topic} ne kadar sürer?`,
  (topic) => `${topic} hangi durumlarda gerekir?`,
  (topic) => `${topic} sorununu nasıl çözerim?`,
  (topic) => `${topic} çalışmıyor, ne yapmalıyım?`,
  (topic) => `${topic} güvenliği nasıl sağlanır?`,
  (topic) => `${topic} konusunda nelere dikkat etmeliyim?`,
  (topic) => `${topic} maliyetini ve koşullarını nasıl öğrenirim?`,
  (topic) => `${topic} hesabımı veya hizmetimi nasıl etkiler?`,
  (topic) => `${topic} durumunu panelden nasıl takip ederim?`,
  (topic) => `${topic} için nasıl destek talebi açarım?`,
  (topic) => `${topic} hakkında bilmem gereken önemli ayrıntılar neler?`
];

const assistantFaqs = assistantTopics.flatMap((entry) => assistantQuestionForms.map((form, index) => {
  const topic = entry.question.replace(/[?!.]+$/, '');
  return { ...entry, question: form(topic, entry.question), topicIndex: assistantTopics.indexOf(entry), variantIndex: index };
}));

function normalizeAssistantText(value) {
  return String(value).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, ' ').trim();
}

function findPreparedAssistantAnswer(message) {
  const normalizedMessage = normalizeAssistantText(message);
  const stopWords = new Set(['acaba', 'ama', 'bana', 'ben', 'bir', 'bu', 'da', 'de', 'detayli', 'eder', 'hakkinda', 'icin', 'ile', 'mi', 'misin', 'mu', 'mı', 'ne', 'nasil', 'nedir', 've', 'verir']);
  const queryTokens = normalizedMessage.split(' ').filter((token) => token.length > 2 && !stopWords.has(token));
  let bestTopic = null;
  let bestScore = 0;

  for (const topic of assistantFaqs) {
    let score = 0;
    for (const keyword of topic.keywords) {
      const normalizedKeyword = normalizeAssistantText(keyword);
      const keywordTokens = normalizedKeyword.split(' ').filter((token) => token.length > 2);
      if (normalizedMessage.includes(normalizedKeyword)) score = Math.max(score, 100 + normalizedKeyword.length);
      const overlap = keywordTokens.filter((keywordToken) => queryTokens.some((queryToken) => queryToken === keywordToken || queryToken.startsWith(keywordToken) || keywordToken.startsWith(queryToken))).length;
      score = Math.max(score, overlap ? 10 + overlap * 8 + (overlap === keywordTokens.length ? 6 : 0) : 0);
    }
    const normalizedQuestion = normalizeAssistantText(topic.question);
    if (normalizedMessage.includes(normalizedQuestion)) score = Math.max(score, 100 + normalizedQuestion.length);
    const questionTokens = normalizedQuestion.split(' ').filter((token) => token.length > 3 && !stopWords.has(token));
    score += questionTokens.filter((token) => queryTokens.some((queryToken) => queryToken === token || queryToken.startsWith(token) || token.startsWith(queryToken))).length;
    if (score > bestScore) {
      bestTopic = topic;
      bestScore = score;
    }
  }

  return bestScore >= 10
    ? bestTopic.answer
    : 'Bu konuda hazır yanıt kataloğunda eşleşme bulamadım. Siparişin, hesabın veya teknik sorun için Destek kanalından takip numaralı talep oluşturabilirsin.';
}

function setupFloatingAssistant() {
  const launcher = document.querySelector('#assistant-float-button');
  const widget = document.querySelector('#assistant-widget');
  const closeButton = document.querySelector('#assistant-widget-close');
  const log = document.querySelector('#assistant-widget-log');
  const form = document.querySelector('#assistant-widget-form');
  if (!launcher || !widget || !closeButton || !log || !form) return;

  const storageKey = 'kokhost-assistant-chat';
  let history = [];
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) history = saved.filter((message) => typeof message?.text === 'string').slice(-40);
  } catch {}
  if (!history.length) history.push({ role: 'assistant', text: 'Merhaba! Hosting, alan adı, sipariş veya ödeme konusunda nasıl yardımcı olabilirim?' });

  const renderHistory = () => {
    log.replaceChildren();
    history.forEach((message) => {
      const bubble = document.createElement('div');
      bubble.className = `assistant-widget-message${message.role === 'user' ? ' customer' : ''}`;
      bubble.textContent = message.text;
      log.append(bubble);
    });
    log.scrollTop = log.scrollHeight;
    try { sessionStorage.setItem(storageKey, JSON.stringify(history.slice(-40))); } catch {}
  };
  const setOpen = (open) => {
    widget.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) form.elements.message.focus();
  };

  renderHistory();
  launcher.addEventListener('click', () => setOpen(widget.hidden));
  closeButton.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !widget.hidden) setOpen(false); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.elements.message;
    const message = input.value.trim();
    if (!message) return;
    history.push({ role: 'user', text: message });
    history.push({ role: 'assistant', text: findPreparedAssistantAnswer(message) });
    input.value = '';
    renderHistory();
    input.focus();
  });
}

// API ACCESS: authenticated requests shared by all channel pages.
async function api(url, options = {}) {
  const apiBase = window.location.port === '5500'
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : '';
  const response = await fetch(`${apiBase}${url}`, { ...options, credentials: 'include', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }, signal: options.signal || AbortSignal.timeout(4500) });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;
  if (!data) throw new Error(response.status === 404 ? 'İşlem sunucuda bulunamadı. Sunucuyu yeniden başlatıp tekrar deneyin.' : 'Sunucudan geçerli bir yanıt alınamadı.');
  if (!response.ok) throw new Error(data.error || 'İşlem tamamlanamadı.');
  return data;
}

// CART STATE: persisted cart lines are display data; checkout prices are verified by the API.
function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('kokhost-cart') || '[]');
    return Array.isArray(cart) ? cart : [];
  } catch { return []; }
}

function writeCart(cart) {
  localStorage.setItem('kokhost-cart', JSON.stringify(cart));
  document.querySelectorAll('[data-cart-count]').forEach((badge) => { badge.textContent = String(cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)); });
}

function addToCart(item) {
  const cart = readCart();
  cart.push({ ...item, cartId: `${Date.now()}-${Math.random().toString(36).slice(2)}`, quantity: 1 });
  writeCart(cart);
  showToast(`${item.name} sepete eklendi.`);
}

// CONFIGURATOR PRICING: keep the live estimate aligned with the server quote formula.
function customConfiguration(form) {
  return Object.fromEntries(new FormData(form));
}

function estimateCustomPrice(configuration) {
  const cpu = Number(configuration.cpu);
  const ram = Number(configuration.ram);
  const storage = Number(configuration.storage);
  const basePrice = configuration.type === 'web'
    ? 39 + storage * 5 + Number(configuration.websites) * 7 + Number(configuration.mailboxes) * 3
    : configuration.type === 'server'
      ? 650 + cpu * 90 + ram * 24 + Math.round(storage * 1.4)
      : 99 + cpu * 80 + ram * 35 + storage;
  return Math.round(basePrice + (configuration.operatingSystem === 'windows' ? 450 : 0) + (configuration.controlPanel === 'plesk' ? 300 : configuration.controlPanel === 'cpanel' ? 500 : 0) + (configuration.backups ? 120 : 0));
}

const t = (key) => dictionary[currentLanguage]?.[key] || dictionary.tr[key] || key;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const money = (value) => `${Number(value || 0).toLocaleString(currentLanguage === 'tr' ? 'tr-TR' : currentLanguage === 'de' ? 'de-DE' : 'en-US')} ₺`;
const dateText = (value) => value ? new Date(`${value.replace(' ', 'T')}Z`).toLocaleDateString(currentLanguage === 'tr' ? 'tr-TR' : currentLanguage === 'de' ? 'de-DE' : 'en-US') : '—';
const statusText = (status) => {
  const keys = { 'Ödendi': 'paid', paid: 'paid', 'Ödeme başlatılamadı': 'paymentFailed', 'Ödeme başarısız': 'paymentFailed', failed: 'paymentFailed', 'Ödeme bekleniyor': 'pendingTransfer', pending: 'pendingTransfer', review: 'approvalReview', 'Ödeme onayı bekliyor': 'approvalReview', 'Talep alındı': 'requestReceived', new: 'newStatus', read: 'readStatus', answered: 'answered' };
  return t(keys[status] || status);
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.body.classList.toggle('rtl', currentLanguage === 'ar');
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  updateTopbar();
}

function updateTopbar() {
  const nav = document.querySelector(`.nav-item[data-view="${currentView}"] span[data-i18n]`);
  document.querySelector('#topbar-title').textContent = nav ? t(nav.dataset.i18n) : t('overview');
}

// AUTH AND ROUTING: validate the session, highlight the current channel, and render its page.
async function load() {
  try {
    const session = await api('/api/auth/me');
    if (!session.user) {
      sessionStorage.setItem('kokhost-login-message', 'Paneli görüntülemek için giriş yapın.');
      window.location.replace('/');
      return;
    }
    currentUser = session.user;
    const accountName = currentUser.email.split('@')[0].split(/[._-]+/).filter(Boolean)
      .map((part) => part.charAt(0).toLocaleUpperCase('tr-TR') + part.slice(1)).join(' ') || currentUser.email;
    const profileName = document.querySelector('#profile-email');
    profileName.textContent = accountName;
    profileName.title = currentUser.email;
    document.querySelector('.avatar').textContent = Array.from(accountName)[0]?.toLocaleUpperCase('tr-TR') || 'K';
    const summary = await api('/api/panel/summary');
    isAdministrator = summary.admin;
    document.querySelector('.admin-nav').hidden = !isAdministrator;
    const { services } = await api('/api/services');
    document.querySelector('.nav-item[data-view="services"]').hidden = services.length === 0;
    if (currentView === 'services' && services.length === 0) currentView = 'dashboard';
    document.querySelectorAll('.nav-item[data-view]').forEach((link) => link.classList.toggle('active', link.dataset.view === currentView));
    if (isAdministrator) document.querySelector('.nav-label').textContent = t('customerArea');
    applyLanguage();
    const queryTicket = new URLSearchParams(location.search).get('ticket');
    if (queryTicket) return openTicket(queryTicket);
    if (location.pathname.endsWith('/service-detail.html')) {
      await renderServiceDetailPage();
      return;
    }
    await navigate(currentView);
    const paymentResult = new URLSearchParams(location.search).get('payment');
    if (paymentResult === 'success') writeCart([]);
    if (paymentResult) showToast(paymentResult === 'success' ? 'Ödeme sağlayıcı sonucu kontrol ediliyor.' : 'Ödeme tamamlanmadı; sepetiniz korundu.');
  } catch (error) {
    page.innerHTML = `<div class="notice warning">${escapeHtml(error.message)} <a href="/">Giriş sayfasına dön</a></div>`;
  }
}

async function navigate(view) {
  if (view === 'admin' && !isAdministrator) return navigate('dashboard');
  if (view !== 'payments' && paymentRefreshTimer) {
    clearInterval(paymentRefreshTimer);
    paymentRefreshTimer = null;
  }
  if (!channelPages[view]) return;
  if (location.pathname !== channelPages[view]) {
    window.location.assign(channelPages[view]);
    return;
  }
  currentView = view;
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  document.querySelector('#sidebar').classList.remove('open');
  document.querySelector('#mobile-menu').setAttribute('aria-expanded', 'false');
  updateTopbar();
  page.innerHTML = '<p class="loading-state">Yükleniyor…</p>';
  const views = { dashboard: renderDashboard, packages: renderPackages, domains: renderDomains, services: renderServices, support: renderSupport, payments: renderPayments, assistant: renderAssistant, cart: renderCart, admin: renderAdmin };
  try { await views[view](); } catch (error) { page.innerHTML = `<div class="notice warning">${escapeHtml(error.message)} <button class="soft-button" id="retry-view">${t('tryAgain')}</button></div>`; page.querySelector('#retry-view')?.addEventListener('click', () => navigate(view)); }
}

function pageHeader(eyebrow, title, description, action = '') {
  return `<div class="page-heading"><div><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${title}</h1><p class="page-description">${description}</p></div>${action}</div>`;
}

// OVERVIEW CHANNEL: account totals, support status, and service-use guidance.
async function renderDashboard() {
  const { orders, tickets, counts } = await api('/api/panel/summary');
  const orderRows = orders.length ? orders.map((order) => `<tr><td><strong>${escapeHtml(order.name)}</strong></td><td>${money(order.price)} / ay</td><td><span class="badge ${order.status.includes('başar') ? 'error' : order.status.includes('bek') ? 'pending' : ''}">${escapeHtml(statusText(order.status))}</span></td><td>${dateText(order.createdAt)}</td></tr>`).join('') : `<tr><td colspan="4">${t('noOrders')}</td></tr>`;
  const ticketRows = tickets.length ? tickets.map((ticket) => `<button class="ticket-row" type="button" data-open-ticket="${escapeHtml(ticket.publicId)}"><span class="ticket-main"><strong>${escapeHtml(ticket.subject)}</strong><small>${escapeHtml(ticket.publicId)} · ${dateText(ticket.createdAt)}</small></span><span class="badge ${ticket.status === 'new' ? 'pending' : ''}">${escapeHtml(statusText(ticket.status))}</span></button>`).join('') : `<div class="empty-state">${t('noTickets')}</div>`;
  page.innerHTML = `${pageHeader('KÖKHOST / GENEL BAKIŞ', t('welcome'), t('dashboardIntro'), `<button class="dark-button" type="button" data-go="packages">${t('explore')} ↗</button>`)}
    <div class="stats-grid"><div class="stat-block"><span class="stat-label">${t('orders')}</span><strong class="stat-value">${counts.orders}</strong></div><div class="stat-block"><span class="stat-label">${t('tickets')}</span><strong class="stat-value">${counts.tickets}</strong></div><div class="stat-block"><span class="stat-label">${t('pending')}</span><strong class="stat-value">${counts.pendingPayments}</strong></div></div>
    <section class="content-section"><div class="section-title-row"><h2>${t('orders')}</h2><button class="subtle-link" data-go="payments">Tümünü gör ↗</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>${t('packages')}</th><th>${t('amount')}</th><th>${t('status')}</th><th>${t('date')}</th></tr></thead><tbody>${orderRows}</tbody></table></div></section>
    <section class="content-section"><div class="section-title-row"><h2>${t('tickets')}</h2><button class="subtle-link" data-go="support">${t('createTicket')} ↗</button></div><div class="ticket-list">${ticketRows}</div></section>
    <section class="content-section"><div class="section-title-row"><h2>Müşteri memnuniyeti</h2><button class="subtle-link" data-go="support">Görüş veya sorun bildir ↗</button></div><p class="overview-note">Öneri, şikâyet veya güvenlik açığı bildiriminiz takip numarasıyla kaydedilir; ekibin yanıtını Destek kanalından izleyebilirsiniz.</p></section>
    <section class="content-section"><div class="section-title-row"><h2>Hangi hizmet size uygun?</h2><button class="subtle-link" data-go="packages">Paketleri karşılaştır ↗</button></div><div class="overview-grid"><article class="overview-card"><span class="product-badge">ALAN ADI</span><h3>Markanızın adresi</h3><p>Web sitesi ve kurumsal e-posta için alan adınızı bulun; DNS kayıtlarıyla hizmetlerinizi doğru sunucuya yönlendirin.</p><button class="soft-button" type="button" data-go="domains">Alan adı sorgula</button></article><article class="overview-card"><span class="product-badge">WEB HOSTING</span><h3>Site, blog ve mağaza</h3><p>Hosting, sitenizin dosyalarını ve veritabanını internete açık bir sunucuda çalıştırır. WordPress ve e-ticaret projeleri için uygun paketleri karşılaştırın.</p><button class="soft-button" type="button" data-go="packages">Hosting paketleri</button></article><article class="overview-card"><span class="product-badge">VDS / VPS</span><h3>Uygulama ve oyun sunucuları</h3><p>Sanal sunucu; özel uygulamalar, geliştirme ortamları, API servisleri ve oyun sunucuları için ayrılmış kaynak sağlar.</p><button class="soft-button" type="button" data-go="packages">Sanal sunucuları gör</button></article></div></section>`;
  page.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.go)));
  page.querySelectorAll('[data-open-ticket]').forEach((button) => button.addEventListener('click', () => openTicket(button.dataset.openTicket)));
}

// SERVICES CHANNEL: active customer services and their access details.
async function renderServices() {
  const { services } = await api('/api/services');
  const summaryCards = [
    { label: 'Toplam Hizmet', icon: '▣', count: services.length || 0, tone: 'soft' },
    { label: 'Aktif', icon: '✓', count: services.filter((service) => service.status === 'Aktif').length, tone: 'success' },
    { label: 'Yenileme Yaklaşıyor', icon: '◫', count: services.filter((service) => service.renewsSoon).length, tone: 'warning' }
  ];
  const rows = services.length
    ? services.map((service) => `
      <tr>
        <td>
          <div class="service-name-cell">
            <span class="service-icon">▣</span>
            <div>
              <strong>${escapeHtml(service.name)}</strong>
              <small>${escapeHtml(service.hostname || `Hizmet #${service.id}`)} · ${escapeHtml(service.location || 'Lokasyon atanmadı')}</small>
            </div>
          </div>
        </td>
        <td>${escapeHtml(service.planType || 'Sunucu')}</td>
        <td>${escapeHtml(service.ip || 'Atama bekliyor')}</td>
        <td><span class="badge ${service.status === 'Aktif' ? '' : 'pending'}">${escapeHtml(service.status)}</span></td>
        <td>${dateText(service.renewalDate)}</td>
        <td><button class="dark-button" type="button" data-open-service="${service.id}">Hizmete Gir</button></td>
      </tr>
    `).join('')
    : `<tr><td colspan="6"><div class="empty-state">Aktif bir hizmet bulunmuyor.</div></td></tr>`;

  page.innerHTML = `
    ${pageHeader('KÖKHOST / HİZMETLER', 'Hizmetlerim', 'Tüm hizmetlerinizi tek yerden yönetebilirsiniz.', '<button class="dark-button" type="button" data-go="packages">+ Yeni Sipariş</button>')}
    <div class="service-summary-grid">
      ${summaryCards.map((card) => `
        <div class="service-summary-card ${card.tone}">
          <div class="service-summary-icon">${card.icon}</div>
          <div>
            <small>${card.label}</small>
            <strong>${card.count}</strong>
          </div>
        </div>
      `).join('')}
    </div>
    <section class="content-section">
      <div class="table-wrap">
        <table class="data-table service-table">
          <thead>
            <tr>
              <th>Hizmet</th>
              <th>Tür</th>
              <th>IP Adresi</th>
              <th>Durum</th>
              <th>Yenileme</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  page.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.go)));
  page.querySelectorAll('[data-open-service]').forEach((button) => button.addEventListener('click', () => {
    window.location.assign(`/service-detail.html?service=${encodeURIComponent(button.dataset.openService)}`);
  }));
}

async function renderServiceDetailPage() {
  const serviceId = new URLSearchParams(location.search).get('service');
  if (!serviceId) {
    page.innerHTML = `<div class="notice warning">Hizmet seçilmedi.</div>`;
    return;
  }

  try {
    const { service } = await api(`/api/services/${encodeURIComponent(serviceId)}`);
    const uptimeDays = Math.floor((service.uptimeSeconds || 0) / 86400);
    const uptimeHours = Math.floor(((service.uptimeSeconds || 0) % 86400) / 3600);
    const uptimeMinutes = Math.floor(((service.uptimeSeconds || 0) % 3600) / 60);
    const uptimeText = service.uptimeSeconds ? `${uptimeDays} gün ${uptimeHours} sa ${uptimeMinutes} dk` : 'Ölçüm yok';
    const powerIsOn = service.powerStatus === 'running';
    const powerButtonText = service.powerStatus ? (powerIsOn ? 'VDS’yi Kapat' : 'VDS’yi Başlat') : 'Güç Kontrolü API Bekleniyor';
    const operatingSystems = ['Ubuntu 24.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 12', 'AlmaLinux 9', 'Windows Server 2022 64 Bit'];
    page.innerHTML = `
      ${pageHeader('KÖKHOST / HİZMET', escapeHtml(service.name), 'Sunucu detayları ve hizmet işlemleri.', '<div class="detail-actions"><button class="soft-button" type="button" data-go="services">← Hizmetler</button></div>')}
      <section class="service-detail-shell">
        <div class="service-detail-topbar">
          <div class="service-status-line"><span class="status-dot active"></span><strong>${escapeHtml(service.status)}</strong> · ${escapeHtml(service.hostname || `Hizmet #${service.id}`)} · ${escapeHtml(service.location || 'Lokasyon atanmadı')}</div>
          <div class="service-action-group">
            <button class="soft-button" type="button" data-service-action="upgrade">Yükseltme Talebi</button>
            <button class="dark-button" type="button" data-service-action="cancel">İptal Talebi</button>
          </div>
        </div>
        <div class="service-card-grid">
          <article class="service-info-box"><span>Kayıt Tarihi</span><strong>${dateText(service.createdAt)}</strong></article>
          <article class="service-info-box"><span>Yenileme Tarihi</span><strong>${dateText(service.renewalDate)}</strong></article>
          <article class="service-info-box"><span>Fiyat</span><strong>${money(service.price)} / ay</strong></article>
          <article class="service-info-box highlight"><span>Ödeme</span><strong>${escapeHtml(service.paymentStatus)}</strong></article>
        </div>

        ${service.isVds ? `
          <section class="service-hardware">
            <div class="service-section-header">DONANIM · SUNUCU KAYNAK ÖZELLİKLERİ</div>
            <div class="service-hardware-grid">
              <article><span>İŞLEMCİ</span><strong>${escapeHtml(service.cpu || 'Paket bilgisi yok')}</strong><small>${escapeHtml(service.cpuSpeed || '')}</small></article>
              <article><span>RAM</span><strong>${escapeHtml(service.ram || 'Paket bilgisi yok')}</strong></article>
              <article><span>DİSK</span><strong>${escapeHtml(service.disk || 'Paket bilgisi yok')}</strong></article>
              <article><span>LOKASYON</span><strong>${escapeHtml(service.location || 'Atanmadı')}</strong></article>
            </div>
          </section>
          ${service.ip || service.username || service.password || service.accessCode ? '' : '<div class="notice warning">Bu VDS için özel IP ve erişim bilgisi henüz tanımlanmamış.</div>'}
          <div class="service-panel-layout">
            <div class="service-panel-primary">
              <div class="service-section-header">Sunucu Bilgileri</div>
              <div class="service-detail-list">
                <div class="detail-row"><span>Kullanıcı Adı</span><strong>${escapeHtml(service.username || 'Atanmadı')}</strong></div>
                <div class="detail-row"><span>Şifre</span><strong>${escapeHtml(service.password || 'Atanmadı')}</strong></div>
                <div class="detail-row"><span>IP Adresi</span><strong>${escapeHtml(service.ip || 'Atanmadı')}</strong></div>
                <div class="detail-row"><span>Uzaktan Bağlantı</span><strong>${escapeHtml(service.accessCode || (service.operatingSystem.startsWith('Windows') ? 'RDP · IP + kullanıcı adı + şifre' : 'SSH · IP + kullanıcı adı + şifre'))}</strong></div>
                <div class="detail-row"><span>İşletim Sistemi</span><strong>${escapeHtml(service.operatingSystem || 'Atanmadı')}</strong></div>
                <div class="detail-row"><span>Lokasyon</span><strong>${escapeHtml(service.location || 'Atanmadı')}</strong></div>
              </div>
            </div>
            <div class="service-panel-side">
              <div class="service-section-header">Sunucu Kontrolü</div>
              <div class="service-control-box">
                <div class="control-row"><span>Hizmet durumu</span><strong class="status-good">${escapeHtml(service.status)}</strong></div>
                <div class="control-row"><span>Sunucu durumu</span><strong class="${powerIsOn ? 'status-good' : ''}">${powerIsOn ? 'Çalışıyor' : 'Doğrulanamıyor'}</strong></div>
                <div class="control-row"><span>Çalışma süresi</span><strong>${uptimeText}</strong></div>
                <div class="control-row"><span>Bağlantı</span><strong>${service.ip ? 'RDP / SSH' : 'Atanmadı'}</strong></div>
                <div class="control-row"><span>Yedekleme</span><strong>Pakete göre yapılandırılacak</strong></div>
              </div>
              <button class="dark-button power-toggle" type="button" disabled title="Gerçek güç kontrolü için VDS sağlayıcısının API bağlantısı gerekiyor.">${powerButtonText}</button>
              <p class="ticket-audit">Tek tuşla güç kontrolü, sağlayıcı API bağlantısı yapılandırıldığında etkinleşir.</p>
              <label class="form-field" for="service-os-select">Kurulacak işletim sistemi<select class="form-control" id="service-os-select">${operatingSystems.map((operatingSystem) => `<option ${operatingSystem === service.operatingSystem ? 'selected' : ''}>${escapeHtml(operatingSystem)}</option>`).join('')}</select></label>
              <div class="service-action-group vertical">
                <button class="soft-button" type="button" data-service-action="reinstall">Yeniden Kurulum Talebi</button>
                <button class="soft-button" type="button" data-service-action="change-os">Başka Sistem Kurulum Talebi</button>
                <button class="dark-button" type="button" data-service-action="connect">Bağlantı Bilgilerini İste</button>
              </div>
            </div>
          </div>
        ` : '<div class="notice">Bu hizmet türünde VDS donanım ve güç kontrol ekranı bulunmuyor.</div>'}
      </section>
    `;
    page.querySelector('[data-go]').addEventListener('click', () => navigate('services'));
    page.querySelectorAll('[data-service-action]').forEach((button) => button.addEventListener('click', async () => {
      const action = button.dataset.serviceAction;
      const selectedOs = page.querySelector('#service-os-select')?.value;
      const actionNames = { upgrade: 'Hizmet yükseltme', cancel: 'Hizmet iptal', reinstall: `Sunucuyu yeniden kurma (${selectedOs})`, 'change-os': `İşletim sistemi kurulumu (${selectedOs})`, connect: 'Sunucu erişim bilgileri' };
      const title = actionNames[action];
      button.disabled = true;
      try {
        await api('/api/support/tickets', {
          method: 'POST',
          body: JSON.stringify({
            subject: `${title} · Hizmet #${service.id}`,
            category: 'Sunucu Yönetimi',
            body: `Hizmet: ${service.name} (sipariş #${service.id})\nTalep: ${title}\nİşlem öncesi müşteri onayı alınmalıdır. Bu talep sunucuda otomatik işlem başlatmaz.`
          })
        });
        showToast('Talebiniz destek ekibine iletildi. Sunucuda otomatik işlem yapılmadı.');
      } catch (error) {
        showToast(error.message);
        button.disabled = false;
      }
    }));
  } catch (error) {
    page.innerHTML = `<div class="notice warning">${escapeHtml(error.message)}</div>`;
  }
}

// PACKAGE CHANNEL: categorized web, mail, domain, and server products.
async function renderPackages() {
  const { products } = await api('/api/catalog');
  const hostingCount = products.filter((product) => ['web', 'wordpress', 'business', 'email'].includes(product.category)).length;
  const categoryChoices = [
    { id: 'hosting', title: 'Hosting Paketleri', count: hostingCount, image: '/images/server-room.jpg', description: 'Web sitesi, WordPress, e-ticaret ve kurumsal e-posta çözümleri.' },
    { id: 'vps', title: 'VDS / VPS', count: products.filter((product) => product.category === 'vps').length, image: '/images/server-detail.jpg', description: '50 sanal sunucu paketi; CPU, RAM ve NVMe seçeneklerini karşılaştırın.' },
    { id: 'server', title: 'Özel Sunucular', count: products.filter((product) => product.category === 'server').length, image: '/images/server-room.jpg', description: 'Oyun, uygulama ve yüksek kaynaklı işler için 50 seçenek.' },
    { id: 'domain', title: 'Domain / Alan Adı', count: 3, image: '/images/server-detail.jpg', description: 'Uzantıları inceleyin ve kayıt durumunu RDAP ile sorgulayın.' },
    { id: 'campaign', title: 'Kampanyalar', count: products.filter((product) => product.originalPrice).length, image: '/images/server-room.jpg', description: 'İndirimli paket seçenekleri.' },
    { id: 'custom', title: 'Kendi Paketini Oluştur', count: null, image: '/images/server-detail.jpg', description: 'CPU, RAM, disk ve işletim sistemini kendin seç; fiyatı anında gör.' }
  ];
  if (selectedFilter === 'categories') {
    page.innerHTML = `${pageHeader('KÖKHOST / PAKETLER', 'Hizmet kategorileri', 'İhtiyacın olan hizmeti seç; o gruptaki paketleri ve özelliklerini incele.') }<div class="package-category-grid">${categoryChoices.map((category) => `<button class="package-category-card" type="button" data-package-category="${category.id}"><img src="${category.image}" alt="" loading="lazy"><span class="product-badge">${category.count === null ? 'ÖZELLEŞTİRİLEBİLİR' : `${category.count} SEÇENEK`}</span><h2>${category.title}</h2><p>${category.description}</p><span class="category-card-action">${category.id === 'custom' ? 'Yapılandırmaya başla' : 'Paketleri görüntüle'} ↗</span></button>`).join('')}</div>`;
    page.querySelectorAll('[data-package-category]').forEach((button) => button.addEventListener('click', () => { selectedFilter = button.dataset.packageCategory; renderPackages(); }));
    return;
  }
  const domainOffers = [
    { suffix: '.com', image: '/images/server-room.jpg', description: 'Küresel ziyaretçilere açık marka ve işletme siteleri için.', features: ['Dünya genelinde yaygın uzantı', 'RDAP ile kayıt durumu sorgusu', 'Yıllık kayıt ve yenileme'] },
    { suffix: '.com.tr', image: '/images/server-detail.jpg', description: 'Türkiye odaklı markalar ve yerel işletmeler için.', features: ['Türkiye pazarına uygun uzantı', 'RDAP uygunluk kontrolü', 'Kayıt şartları sağlayıcıya göre değişir'] },
    { suffix: '.net', image: '/images/server-room.jpg', description: 'Ağ hizmetleri, teknoloji ve çevrimiçi topluluklar için.', features: ['Teknoloji projelerine uygun', 'RDAP ile kayıt durumu sorgusu', 'Yıllık kayıt ve yenileme'] }
  ];
  const sections = [
    { key: 'web', eyebrow: 'WEB HOSTING', title: 'Hosting Paketleri', description: 'Kişisel sitelerden yoğun ziyaret alan projelere kadar 50 kapasite seçeneği.', products: products.filter((product) => product.category === 'web') },
    { key: 'wordpress', eyebrow: 'WORDPRESS', title: 'WordPress Hosting', description: 'WordPress siteleri için optimize edilmiş yönetilen hosting.', products: products.filter((product) => product.category === 'wordpress') },
    { key: 'business', eyebrow: 'E-TİCARET', title: 'Kurumsal ve E-Ticaret Hosting', description: 'Mağazalar ve işletme projeleri için kaynak paketleri.', products: products.filter((product) => product.category === 'business') },
    { key: 'email', eyebrow: 'E-POSTA', title: 'Kurumsal E-posta Hosting', description: 'Alan adınıza bağlı profesyonel posta kutuları.', products: products.filter((product) => product.category === 'email') },
    { key: 'vps', eyebrow: 'SANAL SUNUCU', title: 'VDS / VPS Paketleri', description: '1’den 50’ye farklı CPU, RAM ve NVMe kapasitesi.', products: products.filter((product) => product.category === 'vps') },
    { key: 'server', eyebrow: 'ÖZEL SUNUCU', title: 'Özel ve Uygulama Sunucuları', description: 'Oyun, API ve yüksek kaynak isteyen servisler için 50 seçenek.', products: products.filter((product) => product.category === 'server') },
    { key: 'domain', eyebrow: 'ALAN ADI', title: 'Domain ve Alan Adı Hizmetleri', description: 'Uzantı seçin, RDAP ile kayıt durumunu sorgulayın.', offers: domainOffers }
  ];
  const renderProductCard = (product) => `<article class="product-card ${product.originalPrice ? 'campaign' : ''}"><img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt)}" loading="lazy"><div class="product-card-body"><div class="product-top"><span class="product-badge">${escapeHtml(product.badge || product.category)}</span>${product.originalPrice ? '<span class="badge">Kampanya</span>' : ''}</div><h3>${escapeHtml(product.name)}</h3><p class="product-description">${escapeHtml(product.description)}</p><p class="product-price">${money(product.price)}<small>/ ay</small></p><p class="old-price">${product.originalPrice ? `${money(product.originalPrice)} / ay` : '&nbsp;'}</p><ul class="product-features">${product.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul><button class="dark-button" type="button" data-add-cart="${escapeHtml(product.id)}">Sepete ekle +</button></div></article>`;
  const renderDomainCard = (offer) => `<article class="product-card"><img class="product-image" src="${offer.image}" alt="Alan adı hizmeti için sunucu altyapısı" loading="lazy"><div class="product-card-body"><div class="product-top"><span class="product-badge">ALAN ADI</span></div><h3>${offer.suffix} alan adı</h3><p class="product-description">${offer.description}</p><p class="domain-price-note">Kayıt ücreti uzantıya ve kayıt kuruluşuna göre değişir.</p><ul class="product-features">${offer.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul><button class="dark-button" type="button" data-go="domains">Uygunluğu sorgula ↗</button></div></article>`;
  let visibleSections;
  if (selectedFilter === 'hosting') visibleSections = sections.filter((section) => ['web', 'wordpress', 'business', 'email'].includes(section.key));
  else if (selectedFilter === 'campaign') visibleSections = [{ key: 'campaign', eyebrow: 'KAMPANYA', title: 'Kampanyalı Paketler', description: 'Kampanyalı fiyatı olan paketler.', products: products.filter((product) => product.originalPrice) }];
  else if (selectedFilter === 'custom') visibleSections = [];
  else visibleSections = sections.filter((section) => section.key === selectedFilter);
  const sectionMarkup = visibleSections.map((section) => {
    const cards = section.offers ? section.offers.map(renderDomainCard) : section.products.map(renderProductCard);
    if (!cards.length) return '';
    return `<section class="product-section"><header class="product-section-heading"><div><p class="eyebrow">${escapeHtml(section.eyebrow)}</p><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.description)}</p></div><span>${section.offers ? section.offers.length : section.products.length} seçenek</span></header><div class="product-grid">${cards.join('')}</div></section>`;
  }).join('');
  const customBuilder = selectedFilter === 'custom' ? `<form class="custom-builder" id="custom-server-form"><div class="custom-builder-heading"><div><p class="eyebrow">KENDİ SUNUCUNU KUR</p><h2>Kaynaklarını seç</h2><p>Özellikleri değiştir; tahmini aylık tutar anında güncellensin.</p></div><span class="custom-price" id="custom-price">—</span></div><div class="form-grid"><label class="form-field">Hizmet türü<select class="form-control" name="type"><option value="web">Web Hosting</option><option value="vps" selected>VDS / VPS</option><option value="server">Özel sunucu</option></select></label><label class="form-field">İşlemci<select class="form-control" name="cpu">${[1, 2, 4, 8, 16, 32, 48, 64].map((value) => `<option value="${value}" ${value === 2 ? 'selected' : ''}>${value} vCPU</option>`).join('')}</select></label><label class="form-field">Bellek<select class="form-control" name="ram">${[2, 4, 8, 16, 32, 64, 128, 256, 512].map((value) => `<option value="${value}" ${value === 4 ? 'selected' : ''}>${value} GB RAM</option>`).join('')}</select></label><label class="form-field">NVMe disk<select class="form-control" name="storage">${[40, 80, 120, 250, 500, 1000, 2000, 4000, 8000].map((value) => `<option value="${value}" ${value === 80 ? 'selected' : ''}>${value} GB</option>`).join('')}</select></label><label class="form-field">İşletim sistemi<select class="form-control" name="operatingSystem"><option value="ubuntu">Ubuntu Server</option><option value="debian">Debian</option><option value="alma">AlmaLinux</option><option value="windows">Windows Server · ek ücret</option></select></label><label class="form-field">Kontrol paneli<select class="form-control" name="controlPanel"><option value="none">Panel yok</option><option value="plesk">Plesk · ek ücret</option><option value="cpanel">cPanel · ek ücret</option></select></label><label class="form-field">Web sitesi sayısı<select class="form-control" name="websites">${[1, 5, 10, 25, 50, 100].map((value) => `<option value="${value}" ${value === 1 ? 'selected' : ''}>${value} site</option>`).join('')}</select></label><label class="form-field">E-posta kutusu<select class="form-control" name="mailboxes">${[0, 5, 10, 25, 50, 100, 250].map((value) => `<option value="${value}" ${value === 5 ? 'selected' : ''}>${value} kutu</option>`).join('')}</select></label></div><label class="builder-check"><input type="checkbox" name="backups" checked><span>Günlük yedekleme ekle · 120 ₺ / ay</span></label><p class="ticket-audit">Gösterilen tutar kaynak seçimine göre hesaplanan tahmini aylık fiyattır; hizmet ve lisans koşullarını satın almadan önce doğrulayın.</p><button class="dark-button" type="submit">Özel yapılandırmayı sepete ekle +</button></form>` : '';
  const currentCategory = categoryChoices.find((category) => category.id === selectedFilter);
  const categoryAction = `<button class="soft-button" type="button" data-package-category="categories">← Kategorilere dön</button>${['hosting', 'vps', 'server'].includes(selectedFilter) ? '<button class="dark-button" type="button" data-package-category="custom">Paketi özelleştir</button>' : ''}`;
  page.innerHTML = `${pageHeader('KÖKHOST / PAKETLER', currentCategory?.title || 'Paketler', currentCategory?.description || 'İhtiyacına uygun paketleri incele.', categoryAction)}${customBuilder}${selectedFilter === 'custom' ? '' : sectionMarkup || '<div class="empty-state">Bu kategoride paket bulunamadı.</div>'}`;
  page.querySelectorAll('[data-package-category]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.packageCategory === 'custom') customType = selectedFilter === 'hosting' ? 'web' : selectedFilter === 'server' ? 'server' : 'vps';
    selectedFilter = button.dataset.packageCategory;
    renderPackages();
  }));
  page.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.go)));
  page.querySelectorAll('[data-add-cart]').forEach((button) => button.addEventListener('click', () => {
    const product = products.find((item) => item.id === button.dataset.addCart);
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
  }));
  const builder = page.querySelector('#custom-server-form');
  if (builder) {
    builder.elements.type.value = customType;
    const updateEstimate = () => { page.querySelector('#custom-price').textContent = `${money(estimateCustomPrice(customConfiguration(builder)))} / ay`; };
    builder.addEventListener('input', updateEstimate);
    builder.addEventListener('change', updateEstimate);
    updateEstimate();
    builder.addEventListener('submit', (event) => {
      event.preventDefault();
      const configuration = customConfiguration(builder);
      const typeName = { web: 'Özel Web Hosting', vps: 'Özel VDS / VPS', server: 'Özel Sunucu' }[configuration.type];
      addToCart({ productId: 'custom-server', name: `${typeName} · ${configuration.cpu} CPU · ${configuration.ram} GB RAM · ${configuration.storage} GB NVMe`, price: estimateCustomPrice(configuration), category: configuration.type, configuration, image: '/images/server-detail.jpg' });
    });
  }
}

// CART CHANNEL: line items, quantities, server estimate, and one checkout confirmation.
async function renderCart() {
  const cart = readCart();
  let quote = null;
  let quoteError = '';
  if (cart.length) {
    try {
      quote = await api('/api/payments/cart/quote', { method: 'POST', body: JSON.stringify({ items: cart.map(({ productId, quantity, configuration }) => ({ productId, quantity, configuration })) }) });
    } catch (error) { quoteError = error.message; }
  }
  const cartItems = quote ? cart.map((item, index) => ({ ...item, ...quote.items[index] })) : cart;
  const quantityTotal = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const total = quote?.total ?? cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  if (!cart.length) {
    page.innerHTML = `${pageHeader('KÖKHOST / SEPET', 'Sepetiniz', 'Eklediğiniz paketleri burada inceleyip birlikte onaylayabilirsiniz.')}<div class="empty-state cart-empty"><p>Sepetiniz şu an boş.</p><button class="dark-button" type="button" data-go="packages">Paketleri incele</button></div>`;
    page.querySelector('[data-go]').addEventListener('click', () => navigate('packages'));
    return;
  }

  page.innerHTML = `${pageHeader('KÖKHOST / SEPET', '🛒 Sepetiniz', `${quantityTotal} ürün · Tahmini aylık toplam ${money(total)}`, '<button class="soft-button" type="button" data-go="packages">Paket ekle +</button>')}<div class="cart-layout"><section class="cart-lines" aria-label="Sepet ürünleri">${cartItems.map((item, index) => `<article class="cart-line"><img src="${escapeHtml(item.image || '/images/server-detail.jpg')}" alt="${escapeHtml(item.name)}"><div class="cart-line-copy"><span class="product-badge">${escapeHtml(item.category || 'Paket')}</span><h2>${escapeHtml(item.name)}</h2>${item.configuration ? `<p>${escapeHtml(item.configuration.operatingSystem)} · ${escapeHtml(item.configuration.controlPanel)} · ${item.configuration.backups === 'true' || item.configuration.backups === true || item.configuration.backups === 'on' ? 'Yedekleme açık' : 'Yedekleme kapalı'}</p>` : ''}<strong>${money(item.price)} / ay</strong></div><label class="cart-quantity">Adet<select class="form-control" data-cart-quantity="${index}">${Array.from({ length: 10 }, (_, quantity) => `<option value="${quantity + 1}" ${Number(item.quantity) === quantity + 1 ? 'selected' : ''}>${quantity + 1}</option>`).join('')}</select></label><button class="remove-cart-item" type="button" data-remove-cart="${index}" aria-label="${escapeHtml(item.name)} ürününü sil" title="Ürünü sepetten çıkar">×</button></article>`).join('')}</section><aside class="cart-summary"><h2>Ödeme bilgileri</h2><div class="cart-total-row"><span>${quantityTotal} ürün · aylık</span><strong>${money(total)}</strong></div><p>Ödeme onaylanınca siparişiniz hesabınıza kaydedilir. Sunucu yapılandırma tutarı sunucu tarafından tekrar hesaplanır.</p><form id="cart-checkout-form"><fieldset class="cart-methods"><legend>Ödeme yöntemi</legend><label class="method-option"><input type="radio" name="method" value="iban" checked>${t('iban')}</label></fieldset><p class="form-error" id="cart-error" aria-live="polite">${escapeHtml(quoteError)}</p><button class="dark-button cart-confirm" type="submit" ${quoteError ? 'disabled' : ''}>Alışverişi onayla · ${money(total)}</button></form></aside></div>`;

  page.querySelector('[data-go]')?.addEventListener('click', () => navigate('packages'));
  page.querySelectorAll('[data-remove-cart]').forEach((button) => button.addEventListener('click', () => {
    const updated = readCart();
    updated.splice(Number(button.dataset.removeCart), 1);
    writeCart(updated);
    renderCart();
  }));
  page.querySelectorAll('[data-cart-quantity]').forEach((select) => select.addEventListener('change', () => {
    const updated = readCart();
    updated[Number(select.dataset.cartQuantity)].quantity = Number(select.value);
    writeCart(updated);
    renderCart();
  }));
  const form = page.querySelector('#cart-checkout-form');
  form.addEventListener('submit', submitCartCheckout);
}

async function submitCartCheckout(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('[type="submit"]');
  const error = page.querySelector('#cart-error');
  const values = Object.fromEntries(new FormData(form));
  button.disabled = true;
  error.textContent = '';
  try {
    const result = await api('/api/payments/cart', {
      method: 'POST',
      body: JSON.stringify({ ...values, items: readCart().map(({ productId, quantity, configuration }) => ({ productId, quantity, configuration })) })
    });
    writeCart([]);
    const bank = result.bank;
    page.innerHTML = `${pageHeader('KÖKHOST / ÖDEME', 'Siparişiniz alındı', `Sipariş #${result.payment.orderId} · Aylık toplam ${money(result.payment.amount)}`)}<section class="bank-details cart-bank-details"><h2>Havale / EFT bilgileri</h2><div class="bank-row"><small>Banka</small><strong>${escapeHtml(bank.name || '—')}</strong></div><div class="bank-row"><small>Hesap sahibi</small><strong>${escapeHtml(bank.accountName || '—')}</strong></div><div class="bank-row"><small>IBAN</small><strong>${escapeHtml(bank.iban)}</strong></div><div class="bank-row"><small>Açıklama</small><strong>KökHost sipariş #${result.payment.orderId}</strong></div><p>Ödemeyi yaptıktan sonra aşağıdaki butona basarak hesabınıza düştüğünü bildirirsiniz.</p><div class="stacked-actions"><button class="dark-button" type="button" id="confirm-transfer-paid">Hesabımda ödeme düştü mü?</button><button class="soft-button" type="button" data-go="payments">Siparişlerime git</button></div></section>`;
    page.querySelector('#confirm-transfer-paid')?.addEventListener('click', async () => {
      const button = page.querySelector('#confirm-transfer-paid');
      button.disabled = true;
      try {
        const response = await api(`/api/payments/${result.payment.id}/confirm-transfer`, { method: 'POST' });
        showToast(response.message || 'Ödeme bildirimi gönderildi.');
        button.textContent = 'Ödeme bildirimi gönderildi';
      } catch (error) {
        showToast(error.message);
        button.disabled = false;
      }
    });
    page.querySelector('[data-go]').addEventListener('click', () => navigate('payments'));
  } catch (checkoutError) {
    error.textContent = checkoutError.message;
    button.disabled = false;
  }
}

function showPaymentDialog(product) {
  paymentProductLabel.textContent = `${product.name} · ${money(product.price)} / ay`;
  paymentBody.innerHTML = `<form id="checkout-form"><input type="hidden" name="method" value="iban"><p class="eyebrow">${t('iban')}</p><p class="form-error" id="payment-error" aria-live="polite"></p><button class="dark-button" type="submit" style="width:100%">${t('pay')} · ${money(product.price)} ↗</button></form><div id="bank-result"></div>`;
  paymentDialog.showModal();
  const form = paymentBody.querySelector('#checkout-form');
  form.addEventListener('submit', submitCheckout);
}

async function submitCheckout(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const error = paymentBody.querySelector('#payment-error');
  const button = form.querySelector('[type="submit"]');
  const values = Object.fromEntries(new FormData(form));
  button.disabled = true;
  error.textContent = '';
  try {
    const result = await api('/api/payments/checkout', { method: 'POST', body: JSON.stringify({ ...values, productId: selectedProduct.id }) });
    const bank = result.bank;
    paymentBody.querySelector('#bank-result').innerHTML = bank?.iban ? `<div class="bank-details"><h3>Havale / EFT bilgileri</h3><div class="bank-row"><small>Banka</small><strong>${escapeHtml(bank.name || '—')}</strong></div><div class="bank-row"><small>Hesap sahibi</small><strong>${escapeHtml(bank.accountName || '—')}</strong></div><div class="bank-row"><small>IBAN</small><strong id="iban-value">${escapeHtml(bank.iban)}</strong></div><div class="bank-row"><small>Açıklama</small><strong>KökHost sipariş #${result.payment.orderId}</strong></div><button type="button" class="soft-button copy-iban" id="copy-iban">IBAN'ı kopyala</button><p class="ticket-audit">Transferiniz yönetici tarafından doğrulandıktan sonra siparişiniz etkinleştirilir.</p></div>` : `<div class="notice warning">IBAN henüz tanımlanmamış. Lütfen destek talebi açın.</div>`;
    paymentBody.querySelector('#copy-iban')?.addEventListener('click', async () => { await navigator.clipboard.writeText(bank.iban); showToast('IBAN kopyalandı.'); });
    button.disabled = false;
  } catch (errorValue) {
    error.textContent = errorValue.message;
    button.disabled = false;
  }
}

// DOMAIN CHANNEL: extension selection and individual RDAP lookups.
async function renderDomains() {
  page.innerHTML = `${pageHeader('KÖKHOST / DOMAIN', t('domains'), t('domainIntro'))}<form class="domain-form" id="domain-form"><label class="domain-field domain-name-field">Alan adı<input class="text-input" name="domain" required maxlength="253" placeholder="ornek veya ornek.com"></label><label class="domain-field domain-tld-field">Uzantı<input class="text-input" name="tld" list="domain-tld-list" placeholder=".com" autocomplete="off"></label><datalist id="domain-tld-list"></datalist><button class="dark-button" type="submit">${t('search')} ↗</button></form><div class="domain-suffixes">${['.com', '.net', '.org', '.com.tr', '.tr', '.io', '.co.uk', '.de', '.fr', '.xyz'].map((suffix) => `<button class="suffix-chip" type="button" data-suffix="${suffix}">${suffix}</button>`).join('')}</div><p class="ticket-audit">${t('rdapCaveat')}</p><div class="domain-results" id="domain-results"></div>`;
  const form = page.querySelector('#domain-form');
  const suffixList = page.querySelector('#domain-tld-list');
  api('/api/domains/tlds')
    .then(({ suffixes }) => { if (suffixList.isConnected) suffixList.innerHTML = suffixes.map((suffix) => `<option value=".${escapeHtml(suffix)}"></option>`).join(''); })
    .catch(() => {});
  page.querySelectorAll('[data-suffix]').forEach((button) => button.addEventListener('click', () => {
    form.elements.tld.value = button.dataset.suffix;
    form.elements.tld.focus();
  }));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = form.elements.domain;
    const results = page.querySelector('#domain-results');
    const base = input.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const selectedTld = form.elements.tld.value.trim().toLowerCase().replace(/^\.+/, '');
    const domain = /\.[a-z0-9-]+$/i.test(base) ? base : selectedTld ? `${base}.${selectedTld}` : base;
    const domains = [domain];
    results.innerHTML = domains.map((domain) => `<div class="domain-result" id="domain-${escapeHtml(domain.replace(/[^a-z0-9]/gi, '-'))}"><strong>${escapeHtml(domain)}</strong><span class="badge pending">${t('checking')}</span></div>`).join('');
    await Promise.all(domains.map(async (domain) => {
      const row = page.querySelector(`#domain-${CSS.escape(domain.replace(/[^a-z0-9]/gi, '-'))}`);
      try {
        const result = await api(`/api/domains/check?name=${encodeURIComponent(domain)}`);
        const state = result.status;
        row.innerHTML = `<strong>${escapeHtml(result.domain)}</strong><span class="badge ${state === 'registered' ? 'error' : state === 'unknown' ? 'pending' : ''}">${state === 'registered' ? t('registered') : state === 'available' ? t('available') : t('unknown')}</span>`;
        row.title = t(state === 'registered' ? 'registeredMessage' : state === 'available' ? 'availableMessage' : 'unknownMessage');
      } catch (errorValue) { row.innerHTML = `<strong>${escapeHtml(domain)}</strong><span class="badge error">${escapeHtml(errorValue.message)}</span>`; }
    }));
  });
}

// SUPPORT CHANNEL: create, list, and follow tracked customer requests.
async function renderSupport() {
  const { tickets } = await api('/api/support/tickets');
  page.innerHTML = `${pageHeader('KÖKHOST / DESTEK', t('support'), t('supportIntro'))}<form class="form-layout" id="ticket-form"><div class="form-grid"><label class="form-field">${t('subject')}<input class="form-control" name="subject" required minlength="4" maxlength="120" placeholder="Örn. SSL kurulumu hakkında"></label><label class="form-field">${t('category')}<select class="form-control" name="category"><option>Hosting</option><option>Domain</option><option>Ödeme</option><option>Teknik destek</option><option>Diğer</option></select></label></div><label class="form-field">${t('description')}<textarea class="form-area" name="body" required minlength="10" maxlength="5000" placeholder="Size nasıl yardımcı olabiliriz?"></textarea></label><p class="form-error" id="ticket-error"></p><button class="dark-button" type="submit">${t('send')} ↗</button></form><section class="content-section"><div class="section-title-row"><h2>${t('tickets')}</h2></div><div class="ticket-list">${tickets.length ? tickets.map(ticketRow).join('') : `<div class="empty-state">${t('noTickets')}</div>`}</div></section>`;
  page.querySelector('#ticket-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = page.querySelector('#ticket-error');
    try {
      const ticket = await api('/api/support/tickets', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      showToast(`Talebiniz oluşturuldu: ${ticket.ticket.publicId}${ticket.emailConfigured ? '' : ' · e-posta SMTP ayarı bekleniyor'}`);
      await openTicket(ticket.ticket.publicId);
    } catch (errorValue) { error.textContent = errorValue.message; }
  });
  bindTicketRows();
}

function ticketRow(ticket) {
  const status = statusText(ticket.status);
  const read = ticket.companyEmailOpenedAt ? t('read') : t('unread');
  return `<button class="ticket-row" type="button" data-open-ticket="${escapeHtml(ticket.publicId)}"><span class="ticket-main"><strong>${escapeHtml(ticket.subject)}</strong><small>${escapeHtml(ticket.publicId)} · ${escapeHtml(ticket.category)} · ${dateText(ticket.updatedAt || ticket.createdAt)}</small></span><span class="badge ${ticket.status === 'new' ? 'pending' : ''}">${status}</span><span class="ticket-audit">${read}</span></button>`;
}

function bindTicketRows() { page.querySelectorAll('[data-open-ticket]').forEach((button) => button.addEventListener('click', () => openTicket(button.dataset.openTicket))); }

async function openTicket(publicId) {
  try {
    const { ticket, messages, admin } = await api(`/api/support/tickets/${encodeURIComponent(publicId)}`);
    const destination = admin ? 'admin' : 'support';
    if (currentView !== destination) {
      window.location.assign(`${channelPages[destination]}?ticket=${encodeURIComponent(publicId)}`);
      return;
    }
    currentView = destination;
    document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === 'support'));
    updateTopbar();
    page.innerHTML = `${pageHeader(`DESTEK / ${escapeHtml(ticket.publicId)}`, escapeHtml(ticket.subject), `${escapeHtml(ticket.category)} · ${t('status')}: ${statusText(ticket.status)}`, '<button class="soft-button" id="back-to-tickets">← Taleplere dön</button>')}<div class="ticket-detail"><div class="ticket-detail-top"><div><span class="badge ${ticket.status === 'answered' ? '' : 'pending'}">${statusText(ticket.status)}</span></div>${admin ? `<span class="ticket-audit">${escapeHtml(ticket.email)} · ${ticket.companyEmailOpenedAt ? t('read') : t('unread')}</span>` : ''}</div><div class="message-thread">${messages.map((message) => `<article class="message ${message.authorType === 'staff' ? 'staff' : ''}"><div class="message-meta"><span>${message.authorType === 'staff' ? 'KökHost Destek' : message.authorType === 'system' ? 'Sistem' : escapeHtml(ticket.email)}</span><span>${dateText(message.createdAt)}${admin && message.emailOpenedAt ? ` · ${t('read')}` : ''}</span></div><p class="message-body">${escapeHtml(message.body)}</p></article>`).join('')}</div><form class="form-layout" id="reply-form"><label class="form-field">${t('reply')}<textarea class="form-area" name="body" required minlength="2" maxlength="5000"></textarea></label><p class="form-error" id="reply-error"></p><button class="dark-button" type="submit">${t('sendReply')} ↗</button></form></div>`;
    page.querySelector('#back-to-tickets').addEventListener('click', () => navigate(admin ? 'admin' : 'support'));
    page.querySelector('#reply-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const error = page.querySelector('#reply-error');
      try {
        const result = await api(`/api/support/tickets/${encodeURIComponent(publicId)}/messages`, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
        showToast(result.emailConfigured ? 'Yanıtınız kaydedildi ve e-posta gönderildi.' : 'Yanıtınız kaydedildi. E-posta ayarı yapılmamış.');
        await openTicket(publicId);
      } catch (errorValue) { error.textContent = errorValue.message; }
    });
  } catch (error) { showToast(error.message); }
}

// PAYMENT CHANNEL: order and payment history.
async function renderPayments() {
  if (paymentRefreshTimer) {
    clearInterval(paymentRefreshTimer);
    paymentRefreshTimer = null;
  }
  const { payments } = await api('/api/payments');
  page.innerHTML = `${pageHeader('KÖKHOST / ÖDEME', t('payments'), t('paymentIntro'), `<button class="dark-button" type="button" data-go="packages">${t('explore')} ↗</button>`)}${payments.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>${t('packages')}</th><th>${t('method')}</th><th>${t('amount')}</th><th>${t('status')}</th><th>${t('date')}</th></tr></thead><tbody>${payments.map((payment) => `<tr><td>${escapeHtml(payment.planName)}</td><td>${payment.method === 'iban' ? t('bankTransfer') : t('cardPayment')}</td><td>${money(payment.amountKurus / 100)}</td><td><div class="status-stack"><span class="badge ${payment.status === 'pending' ? 'pending' : payment.status === 'failed' ? 'error' : ''}">${statusText(payment.status)}</span>${payment.method === 'iban' && payment.status === 'pending' ? `<button class="soft-button transfer-confirm-button" type="button" data-confirm-transfer="${payment.id}">Hesabımda ödeme düştü mü?</button>` : ''}</div></td><td>${dateText(payment.createdAt)}</td></tr>`).join('')}</tbody></table></div>` : `<div class="empty-state">${t('noPayments')}</div>`}`;
  page.querySelector('[data-go]')?.addEventListener('click', () => navigate('packages'));
  page.querySelectorAll('[data-confirm-transfer]').forEach((button) => button.addEventListener('click', async () => {
    const target = button.closest('[data-confirm-transfer]');
    if (!target) return;
    target.disabled = true;
    target.textContent = 'Gönderiliyor…';
    try {
      const result = await api(`/api/payments/${target.dataset.confirmTransfer}/confirm-transfer`, { method: 'POST' });
      showToast(result.message || 'Ödeme bildirimi gönderildi.');
      await renderPayments();
    } catch (error) {
      showToast(error.message);
      target.disabled = false;
      target.textContent = 'Hesabımda ödeme düştü mü?';
    }
  }));
  if (payments.some((payment) => payment.method === 'iban' && payment.status === 'review')) {
    paymentRefreshTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && currentView === 'payments') renderPayments().catch(() => {});
    }, 5000);
  }
}

// ASSISTANT CHANNEL: prepared product answers and optional AI chat.
async function renderAssistant() {
  page.innerHTML = `${pageHeader('KÖKHOST / YARDIM ASİSTANI', 'KökHost Yardım Asistanı', 'Hosting, sunucu, alan adı, ödeme ve destek konularında Türkçe yanıtlar.') }<section class="assistant-shell"><header class="assistant-head"><span class="assistant-mark">✦</span><span><strong>KökHost Hazır Yanıt Asistanı</strong><small>${assistantTopics.length} ana konu · ${assistantFaqs.length.toLocaleString('tr-TR')} soru-cevap · Harici API kullanılmaz</small></span></header><details class="assistant-faq"><summary>Soru-cevap kataloğunu ara (${assistantTopics.length} konu)</summary><div class="assistant-faq-browser"><input class="text-input" id="assistant-topic-search" type="search" placeholder="1000 soru-cevap içinde konu ara…" aria-label="Soru-cevap kataloğunda ara"><div class="assistant-faq-list" id="assistant-faq-list"></div></div></details><div class="chat-log" id="chat-log"><div class="chat-bubble">Merhaba! Hosting, sunucu, alan adı, ödeme veya destek sorunuzu yazabilir ya da 1000 soru-cevap kataloğunda arama yapabilirsiniz.</div></div><form class="chat-form" id="chat-form"><input class="text-input" name="message" required maxlength="2000" placeholder="Sorunuzu yazın…"><button class="dark-button" type="submit" aria-label="Yanıtı bul">Yanıtı bul</button></form></section>`;
  const form = page.querySelector('#chat-form');
  const log = page.querySelector('#chat-log');
  const topicSearch = page.querySelector('#assistant-topic-search');
  const topicList = page.querySelector('#assistant-faq-list');
  const renderTopics = () => {
    const query = normalizeAssistantText(topicSearch.value);
    const visibleTopics = assistantTopics.map((topic, index) => ({ topic, index })).filter(({ topic }) => {
      const searchableText = normalizeAssistantText(`${topic.question} ${topic.keywords.join(' ')}`);
      return !query || searchableText.includes(query);
    });
    topicList.innerHTML = visibleTopics.length
      ? visibleTopics.map(({ topic, index }) => `<button class="faq-question" type="button" data-faq="${index}">${escapeHtml(topic.question)}</button>`).join('')
      : '<p class="ticket-audit">Bu aramayla eşleşen konu bulunamadı.</p>';
  };
  renderTopics();
  topicSearch.addEventListener('input', renderTopics);
  topicList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-faq]');
    if (!button) return;
    const faq = assistantTopics[Number(button.dataset.faq)];
    for (const [message, className] of [[faq.question, 'chat-bubble user'], [faq.answer, 'chat-bubble']]) {
      const bubble = document.createElement('div');
      bubble.className = className;
      bubble.textContent = message;
      log.append(bubble);
    }
    log.scrollTop = log.scrollHeight;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.elements.message;
    const message = input.value.trim();
    if (!message) return;
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = message;
    log.append(userBubble);
    input.value = '';
    const waiting = document.createElement('div');
    waiting.className = 'chat-bubble';
    waiting.textContent = 'Yanıt hazırlanıyor…';
    log.append(waiting);
    log.scrollTop = log.scrollHeight;
    waiting.textContent = findPreparedAssistantAnswer(message);
    log.scrollTop = log.scrollHeight;
  });
}

// ADMIN CHANNEL: support queue and manual bank-transfer approval.
async function renderAdmin() {
  const [{ tickets }, paymentResult] = await Promise.all([api('/api/admin/tickets'), api('/api/admin/payments')]);
  page.innerHTML = `${pageHeader('KÖKHOST / ADMIN', t('admin'), t('adminIntro'))}<section class="content-section"><div class="section-title-row"><h2>${t('adminQueue')}</h2></div><div class="ticket-list">${tickets.length ? tickets.map((ticket) => `<button class="ticket-row" type="button" data-open-ticket="${escapeHtml(ticket.publicId)}"><span class="ticket-main"><strong>${escapeHtml(ticket.subject)}</strong><small>${escapeHtml(ticket.publicId)} · ${escapeHtml(ticket.email)} · ${dateText(ticket.createdAt)}</small></span><span class="ticket-audit">${ticket.companyEmailOpenedAt ? t('read') : t('unread')}</span><span class="badge ${ticket.status === 'new' ? 'pending' : ''}">${statusText(ticket.status)}</span></button>`).join('') : '<div class="empty-state">Bekleyen destek talebi yok.</div>'}</div></section><section class="content-section"><div class="section-title-row"><h2>${t('bankTransfers')}</h2></div><div class="ticket-list">${paymentResult.payments.length ? paymentResult.payments.map((payment) => `<div class="payment-card"><div class="payment-info"><strong>${escapeHtml(payment.planName)} · ${money(payment.amountKurus / 100)}</strong><small>${escapeHtml(payment.email)} · ${escapeHtml(payment.providerRef || 'IBAN')} · ${dateText(payment.createdAt)}</small></div><button class="lime-button" type="button" data-confirm-payment="${payment.id}">${t('markPaid')}</button></div>`).join('') : '<div class="empty-state">Onay bekleyen transfer yok.</div>'}</div></section>`;
  page.querySelectorAll('[data-open-ticket]').forEach((button) => button.addEventListener('click', () => openTicket(button.dataset.openTicket)));
  page.querySelectorAll('[data-confirm-payment]').forEach((button) => button.addEventListener('click', async () => {
    button.disabled = true;
    try { await api(`/api/admin/payments/${button.dataset.confirmPayment}/confirm`, { method: 'POST' }); showToast('Transfer onaylandı.'); await renderAdmin(); }
    catch (error) { showToast(error.message); button.disabled = false; }
  }));
}

// SHARED SHELL CONTROLS: sign-out, mobile navigation, and payment dialog.
document.querySelector('#logout-button').addEventListener('click', async () => {
  try { await api('/api/auth/logout', { method: 'POST' }); } finally { window.location.replace('/'); }
});
document.querySelector('#mobile-menu').addEventListener('click', (event) => {
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('#sidebar').classList.toggle('open', !expanded);
});
document.querySelector('.modal-close').addEventListener('click', () => paymentDialog.close());
paymentDialog.addEventListener('click', (event) => { if (event.target === paymentDialog) paymentDialog.close(); });

document.querySelector('#mobile-menu').setAttribute('aria-label', 'Menüyü aç');
setupFloatingAssistant();
load();