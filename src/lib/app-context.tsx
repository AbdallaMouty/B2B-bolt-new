import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Lang = 'en' | 'ar';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const AppContext = createContext<AppContextType | null>(null);

const translations: Record<string, { en: string; ar: string }> = {
  // Nav
  'nav.products': { en: 'Products', ar: 'المنتجات' },
  'nav.companies': { en: 'Companies', ar: 'الشركات' },
  'nav.joinSupplier': { en: 'Join as Supplier', ar: 'انضم كمورد' },
  'nav.signIn': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'nav.signUp': { en: 'Sign Up', ar: 'إنشاء حساب' },
  'nav.signOut': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.createProfile': { en: 'Create Company Profile', ar: 'إنشاء ملف شركة' },
  'nav.searchPlaceholder': { en: 'Search products, machinery, companies...', ar: 'ابحث عن المنتجات، الآلات، الشركات...' },
  'nav.search': { en: 'Search', ar: 'بحث' },

  // Home
  'home.badge': { en: 'Iraq\'s #1 Industrial B2B Marketplace', ar: 'المنصة الصناعية الأولى في العراق' },
  'home.title': { en: 'Connect with Iraq\'s Leading Manufacturers & Suppliers', ar: 'تواصل مع كبار المصنعين والموردين في العراق' },
  'home.subtitle': { en: 'Source industrial machinery, construction materials, food processing equipment, and more from verified suppliers across Iraq.', ar: 'احصل على الآلات الصناعية ومواد البناء ومعدات معالجة الأغذية والمزيد من موردين موثقين في جميع أنحاء العراق.' },
  'home.popular': { en: 'Popular:', ar: 'شائع:' },
  'home.stats.products': { en: 'Products Listed', ar: 'منتجات مدرجة' },
  'home.stats.suppliers': { en: 'Verified Suppliers', ar: 'موردون موثقون' },
  'home.stats.categories': { en: 'Categories', ar: 'الفئات' },
  'home.stats.inquiries': { en: 'Inquiries Sent', ar: 'استفسارات مرسلة' },
  'home.browseCategories': { en: 'Browse by Category', ar: 'تصفح حسب الفئة' },
  'home.browseCategoriesSub': { en: 'Explore products across industrial sectors', ar: 'استكشف المنتجات عبر القطاعات الصناعية' },
  'home.featured': { en: 'Featured Products', ar: 'منتجات مميزة' },
  'home.featuredSub': { en: 'Top-viewed industrial products', ar: 'المنتجات الصناعية الأكثر مشاهدة' },
  'home.popularSuppliers': { en: 'Featured Suppliers', ar: 'موردون مميزون' },
  'home.popularSuppliersSub': { en: 'Trusted manufacturing companies', ar: 'شركات تصنيع موثوقة' },
  'home.recent': { en: 'Recently Added', ar: 'مضافة حديثاً' },
  'home.ctaTitle': { en: 'Grow Your Business with Sanadiq', ar: 'نمّ أعمالك مع صناديق' },
  'home.ctaBody': { en: 'Join Iraq\'s leading B2B industrial marketplace. Create your company profile, list your products, and connect with thousands of buyers across the country.', ar: 'انضم إلى المنصة الصناعية الرائدة في العراق. أنشئ ملف شركتك، أدرج منتجاتك، وتواصل مع آلاف المشترين في جميع أنحاء البلاد.' },
  'home.ctaJoin': { en: 'Become a Supplier', ar: 'كن موردًا' },
  'home.ctaBrowse': { en: 'Browse Products', ar: 'تصفح المنتجات' },
  'home.viewAll': { en: 'View All', ar: 'عرض الكل' },
  'home.trust.title': { en: 'Why Choose Sanadiq?', ar: 'لماذا تختار صناديق؟' },
  'home.trust.verified': { en: 'Verified Suppliers', ar: 'موردون موثقون' },
  'home.trust.verifiedDesc': { en: 'Every company is verified before listing', ar: 'كل شركة يتم التحقق منها قبل الإدراج' },
  'home.trust.rfq': { en: 'Request Quotes', ar: 'اطلب عروض أسعار' },
  'home.trust.rfqDesc': { en: 'Send inquiries directly to suppliers', ar: 'أرسل الاستفسارات مباشرة إلى الموردين' },
  'home.trust.local': { en: 'Built for Iraq', ar: 'مصمم للعراق' },
  'home.trust.localDesc': { en: 'Localized for Iraqi businesses', ar: 'مخصص للأعمال العراقية' },
  'home.trust.support': { en: 'Dedicated Support', ar: 'دعم مخصص' },
  'home.trust.supportDesc': { en: 'Our team helps you every step', ar: 'فريقنا يساعدك في كل خطوة' },
  'home.howItWorks': { en: 'How It Works', ar: 'كيف يعمل' },
  'home.how.search': { en: 'Search & Discover', ar: 'ابحث واكتشف' },
  'home.how.searchDesc': { en: 'Browse thousands of industrial products from verified suppliers across Iraq.', ar: 'تصفح آلاف المنتجات الصناعية من موردين موثقين في جميع أنحاء العراق.' },
  'home.how.contact': { en: 'Contact Suppliers', ar: 'تواصل مع الموردين' },
  'home.how.contactDesc': { en: 'Send quote requests and inquiries directly to the manufacturers.', ar: 'أرسل طلبات عروض الأسعار والاستفسارات مباشرة إلى المصنعين.' },
  'home.how.source': { en: 'Source & Grow', ar: 'اشترِ ونمّ' },
  'home.how.sourceDesc': { en: 'Get the best deals and build lasting business relationships.', ar: 'احصل على أفضل الصفقات وبني علاقات تجارية دائمة.' },

  // Products
  'products.allProducts': { en: 'All Products', ar: 'جميع المنتجات' },
  'products.results': { en: 'products found', ar: 'منتجات موجودة' },
  'products.productFound': { en: 'product found', ar: 'منتج موجود' },
  'products.searching': { en: 'Searching...', ar: 'جاري البحث...' },
  'products.filters': { en: 'Filters', ar: 'الفلاتر' },
  'products.clearAll': { en: 'Clear All', ar: 'مسح الكل' },
  'products.category': { en: 'Category', ar: 'الفئة' },
  'products.allCategories': { en: 'All Categories', ar: 'جميع الفئات' },
  'products.location': { en: 'Location', ar: 'الموقع' },
  'products.allLocations': { en: 'All Locations', ar: 'جميع المواقع' },
  'products.sortBy': { en: 'Sort by:', ar: 'ترتيب حسب:' },
  'products.sort.relevance': { en: 'Relevance', ar: 'الصلة' },
  'products.sort.newest': { en: 'Newest First', ar: 'الأحدث أولاً' },
  'products.sort.popular': { en: 'Most Viewed', ar: 'الأكثر مشاهدة' },
  'products.sort.name': { en: 'Name (A-Z)', ar: 'الاسم (أ-ي)' },
  'products.noResults': { en: 'No products found', ar: 'لم يتم العثور على منتجات' },
  'products.noResultsDesc': { en: 'Try adjusting your filters or search terms.', ar: 'حاول تعديل الفلاتر أو مصطلحات البحث.' },
  'products.clearFilters': { en: 'Clear Filters', ar: 'مسح الفلاتر' },
  'products.loading': { en: 'Loading products...', ar: 'جاري تحميل المنتجات...' },

  // Product Detail
  'product.description': { en: 'Product Description', ar: 'وصف المنتج' },
  'product.specs': { en: 'Technical Specifications', ar: 'المواصفات الفنية' },
  'product.tags': { en: 'Tags', ar: 'العلامات' },
  'product.requestQuote': { en: 'Request a Quote', ar: 'اطلب عرض سعر' },
  'product.contactSupplier': { en: 'Contact Supplier', ar: 'تواصل مع المورد' },
  'product.supplier': { en: 'Supplier', ar: 'المورد' },
  'product.viewCompany': { en: 'View Company', ar: 'عرض الشركة' },
  'product.moreFromSupplier': { en: 'More Products from this Supplier', ar: 'المزيد من منتجات هذا المورد' },
  'product.similarProducts': { en: 'Similar Products', ar: 'منتجات مشابهة' },
  'product.otherSuppliers': { en: 'Other Suppliers Offering Similar Products', ar: 'موردون آخرون يقدمون منتجات مشابهة' },
  'product.notFound': { en: 'Product Not Found', ar: 'المنتج غير موجود' },
  'product.notFoundDesc': { en: 'This product may have been removed or doesn\'t exist.', ar: 'قد يكون هذا المنتج قد تمت إزالته أو غير موجود.' },
  'product.browseProducts': { en: 'Browse Products', ar: 'تصفح المنتجات' },
  'product.loading': { en: 'Loading product...', ar: 'جاري تحميل المنتج...' },
  'product.minOrder': { en: 'Min. Order', ar: 'الحد الأدنى للطلب' },
  'product.views': { en: 'Views', ar: 'المشاهدات' },
  'product.inStock': { en: 'In Stock', ar: 'متوفر' },
  'product.madeToOrder': { en: 'Made to Order', ar: 'حسب الطلب' },
  'product.outOfStock': { en: 'Out of Stock', ar: 'غير متوفر' },

  // Quote Modal
  'quote.title': { en: 'Request a Quote', ar: 'اطلب عرض سعر' },
  'quote.quantity': { en: 'Quantity Needed', ar: 'الكمية المطلوبة' },
  'quote.quantityPlaceholder': { en: 'e.g. 5 units, 100 pieces', ar: 'مثال: 5 وحدات، 100 قطعة' },
  'quote.name': { en: 'Your Name', ar: 'اسمك' },
  'quote.company': { en: 'Company', ar: 'الشركة' },
  'quote.phone': { en: 'Phone', ar: 'الهاتف' },
  'quote.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'quote.message': { en: 'Message', ar: 'الرسالة' },
  'quote.messagePlaceholder': { en: 'Describe your requirements, delivery location, timeline...', ar: 'صف متطلباتك، موقع التسليم، الجدول الزمني...' },
  'quote.send': { en: 'Send Request', ar: 'إرسال الطلب' },
  'quote.sending': { en: 'Sending...', ar: 'جاري الإرسال...' },
  'quote.success': { en: 'Request Sent!', ar: 'تم إرسال الطلب!' },
  'quote.successMsg': { en: 'Your quote request has been sent. They will contact you at the phone number or email you provided.', ar: 'تم إرسال طلب عرض السعر. سيتواصلون معك على رقم الهاتف أو البريد الإلكتروني الذي قدمته.' },
  'quote.done': { en: 'Done', ar: 'تم' },
  'quote.product': { en: 'Product', ar: 'المنتج' },
  'quote.fullName': { en: 'Full name', ar: 'الاسم الكامل' },
  'quote.companyName': { en: 'Your company name', ar: 'اسم شركتك' },
  'quote.phonePlaceholder': { en: '+964 750 000 0000', ar: '+964 750 000 0000' },
  'quote.emailPlaceholder': { en: 'you@company.com', ar: 'you@company.com' },
  'quote.sharedWith': { en: 'Your contact information will be shared with the supplier', ar: 'سيتم مشاركة معلومات الاتصال الخاصة بك مع المورد' },
  'quote.failed': { en: 'Failed to send request. Please try again.', ar: 'فشل إرسال الطلب. حاول مرة أخرى.' },

  // Company
  'company.products': { en: 'Products', ar: 'المنتجات' },
  'company.established': { en: 'Established', ar: 'تأسست' },
  'company.employees': { en: 'employees', ar: 'موظف' },
  'company.notFound': { en: 'Company Not Found', ar: 'الشركة غير موجودة' },
  'company.notFoundDesc': { en: 'This company profile may not exist.', ar: 'قد لا يكون ملف الشركة هذا موجوداً.' },
  'company.browseCompanies': { en: 'Browse Companies', ar: 'تصفح الشركات' },
  'company.loading': { en: 'Loading company profile...', ar: 'جاري تحميل ملف الشركة...' },
  'company.searchProducts': { en: 'Search products...', ar: 'ابحث عن المنتجات...' },
  'company.allProducts': { en: 'All Products', ar: 'جميع المنتجات' },

  // Companies
  'companies.allCompanies': { en: 'All Companies', ar: 'جميع الشركات' },
  'companies.companiesFound': { en: 'companies found', ar: 'شركات موجودة' },
  'companies.companyFound': { en: 'company found', ar: 'شركة موجودة' },
  'companies.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'companies.verification': { en: 'Verification', ar: 'التحقق' },
  'companies.verifiedOnly': { en: 'Verified companies only', ar: 'الشركات الموثقة فقط' },
  'companies.noResults': { en: 'No companies found', ar: 'لم يتم العثور على شركات' },
  'companies.noResultsDesc': { en: 'Try adjusting your filters or search terms.', ar: 'حاول تعديل الفلاتر أو مصطلحات البحث.' },
  'companies.loadingCompanies': { en: 'Loading companies...', ar: 'جاري تحميل الشركات...' },

  // Auth
  'auth.welcomeBack': { en: 'Welcome Back', ar: 'مرحباً بعودتك' },
  'auth.createAccount': { en: 'Create Your Account', ar: 'أنشئ حسابك' },
  'auth.signInSub': { en: 'Sign in to manage your supplier account', ar: 'سجل الدخول لإدارة حساب المورد' },
  'auth.signUpSub': { en: 'Sign up to start listing your products', ar: 'سجل لبدء إدراج منتجاتك' },
  'auth.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'auth.password': { en: 'Password', ar: 'كلمة المرور' },
  'auth.passwordPlaceholder': { en: 'At least 6 characters', ar: '6 أحرف على الأقل' },
  'auth.pleaseWait': { en: 'Please wait...', ar: 'يرجى الانتظار...' },
  'auth.noAccount': { en: "Don't have an account?", ar: 'ليس لديك حساب؟' },
  'auth.haveAccount': { en: 'Already have an account?', ar: 'لديك حساب بالفعل؟' },

  // Supplier Register
  'register.title': { en: 'Create Company Profile', ar: 'إنشاء ملف الشركة' },
  'register.subtitle': { en: 'Fill in your company details to start listing products on Sanadiq.', ar: 'املأ تفاصيل شركتك لبدء إدراج المنتجات على صناديق.' },
  'register.companyName': { en: 'Company Name', ar: 'اسم الشركة' },
  'register.description': { en: 'Description', ar: 'الوصف' },
  'register.logoUrl': { en: 'Logo URL', ar: 'رابط الشعار' },
  'register.country': { en: 'Country', ar: 'البلد' },
  'register.city': { en: 'City', ar: 'المدينة' },
  'register.address': { en: 'Address', ar: 'العنوان' },
  'register.phone': { en: 'Phone', ar: 'الهاتف' },
  'register.website': { en: 'Website', ar: 'الموقع الإلكتروني' },
  'register.businessCategory': { en: 'Business Category', ar: 'فئة الأعمال' },
  'register.yearEstablished': { en: 'Year Established', ar: 'سنة التأسيس' },
  'register.companySize': { en: 'Company Size', ar: 'حجم الشركة' },
  'register.create': { en: 'Create Company Profile', ar: 'إنشاء ملف الشركة' },
  'register.creating': { en: 'Creating...', ar: 'جاري الإنشاء...' },
  'register.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'register.signUpFirst': { en: 'Create Your Supplier Account', ar: 'أنشئ حساب المورد' },
  'register.signUpFirstDesc': { en: 'Sign up first, then create your company profile to start listing products.', ar: 'سجل أولاً، ثم أنشئ ملف شركتك لبدء إدراج المنتجات.' },
  'register.selectCategory': { en: 'Select category...', ar: 'اختر فئة...' },
  'register.selectSize': { en: 'Select size...', ar: 'اختر الحجم...' },

  // Dashboard
  'dash.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'dash.welcome': { en: 'Welcome back! Here\'s what\'s happening with your business.', ar: 'مرحباً بعودتك! إليك ما يحدث مع عملك.' },
  'dash.productViews': { en: 'Product Views', ar: 'مشاهدات المنتج' },
  'dash.quoteRequests': { en: 'Quote Requests', ar: 'طلبات عرض السعر' },
  'dash.productsPublished': { en: 'Products Published', ar: 'منتجات منشورة' },
  'dash.pendingInquiries': { en: 'Pending Inquiries', ar: 'استفسارات معلقة' },
  'dash.recentActivity': { en: 'Recent Activity', ar: 'النشاط الأخير' },
  'dash.noActivity': { en: 'No recent activity yet. Once you start receiving quote requests, they\'ll appear here.', ar: 'لا يوجد نشاط حالياً. بمجرد أن تبدأ في تلقي طلبات عرض السعر، ستظهر هنا.' },
  'dash.quickActions': { en: 'Quick Actions', ar: 'إجراءات سريعة' },
  'dash.addProduct': { en: 'Add Product', ar: 'إضافة منتج' },
  'dash.editProfile': { en: 'Edit Profile', ar: 'تعديل الملف' },
  'dash.viewPublic': { en: 'View Public Profile', ar: 'عرض الملف العام' },
  'dash.products': { en: 'Products', ar: 'المنتجات' },
  'dash.productsCount': { en: 'products published', ar: 'منتجات منشورة' },
  'dash.noProducts': { en: 'No products yet', ar: 'لا توجد منتجات بعد' },
  'dash.noProductsDesc': { en: 'Add your first product to start receiving inquiries from buyers.', ar: 'أضف منتجك الأول لبدء تلقي الاستفسارات من المشترين.' },
  'dash.companyProfile': { en: 'Company Profile', ar: 'ملف الشركة' },
  'dash.updateCompanyInfo': { en: 'Update your company information visible to buyers.', ar: 'حدث معلومات شركتك المرئية للمشترين.' },
  'dash.saveChanges': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'dash.saving': { en: 'Saving...', ar: 'جاري الحفظ...' },
  'dash.saved': { en: 'Saved!', ar: 'تم الحفظ!' },
  'dash.addProductTitle': { en: 'Add Product', ar: 'إضافة منتج' },
  'dash.addProductSub': { en: 'Fill in the details below to publish a new product.', ar: 'املأ التفاصيل أدناه لنشر منتج جديد.' },
  'dash.productName': { en: 'Product Name', ar: 'اسم المنتج' },
  'dash.publishProduct': { en: 'Publish Product', ar: 'نشر المنتج' },
  'dash.publishing': { en: 'Publishing...', ar: 'جاري النشر...' },
  'dash.quoteRequestsTitle': { en: 'Quote Requests', ar: 'طلبات عرض السعر' },
  'dash.totalRequests': { en: 'total requests', ar: 'إجمالي الطلبات' },
  'dash.messages': { en: 'Messages', ar: 'الرسائل' },
  'dash.directMessages': { en: 'Direct messages from buyers', ar: 'رسائل مباشرة من المشترين' },
  'dash.noMessages': { en: 'No messages yet', ar: 'لا توجد رسائل بعد' },
  'dash.noMessagesDesc': { en: 'When buyers send you messages, your conversations will appear here.', ar: 'عندما يرسل المشترين رسائل، ستظهر محادثاتك هنا.' },
  'dash.analytics': { en: 'Analytics', ar: 'التحليلات' },
  'dash.analyticsSub': { en: 'Track your product performance', ar: 'تتبع أداء منتجك' },
  'dash.totalViews': { en: 'Total Product Views', ar: 'إجمالي مشاهدات المنتج' },
  'dash.avgViews': { en: 'Avg. Views / Product', ar: 'متوسط المشاهدات / منتج' },
  'dash.topProducts': { en: 'Top Products by Views', ar: 'أفضل المنتجات حسب المشاهدات' },
  'dash.settings': { en: 'Settings', ar: 'الإعدادات' },
  'dash.accountSettings': { en: 'Manage your account settings', ar: 'إدارة إعدادات حسابك' },
  'dash.account': { en: 'Account', ar: 'الحساب' },
  'dash.dangerZone': { en: 'Danger Zone', ar: 'منطقة الخطر' },
  'dash.deleteCompany': { en: 'Delete Company', ar: 'حذف الشركة' },
  'dash.deleteCompanyDesc': { en: 'Deleting your company will remove all your products and data. This cannot be undone.', ar: 'حذف شركتك سيؤدي إلى إزالة جميع منتجاتك وبياناتك. لا يمكن التراجع عن هذا.' },
  'dash.markResponded': { en: 'Mark as Responded', ar: 'وضع علامة تم الرد' },
  'dash.close': { en: 'Close', ar: 'إغلاق' },
  'dash.createProfileFirst': { en: 'Create Your Company Profile', ar: 'أنشئ ملف شركتك' },
  'dash.createProfileFirstDesc': { en: 'You need a company profile before you can list products and receive inquiries.', ar: 'تحتاج إلى ملف شركة قبل أن تتمكن من إدراج المنتجات وتلقي الاستفسارات.' },
  'dash.noProductsToAnalyze': { en: 'No products to analyze yet.', ar: 'لا توجد منتجات لتحليلها بعد.' },
  'dash.noQuoteRequests': { en: 'No quote requests', ar: 'لا توجد طلبات عرض سعر' },
  'dash.noQuoteRequestsDesc': { en: 'When buyers request quotes on your products, they\'ll appear here.', ar: 'عندما يطلب المشترين عروض أسعار على منتجاتك، ستظهر هنا.' },

  // Verification
  'verify.verified': { en: 'Verified Company', ar: 'شركة موثقة' },
  'verify.pending': { en: 'Pending Verification', ar: 'بانتظار التحقق' },

  // Footer
  'footer.desc': { en: 'The B2B manufacturing marketplace for Iraq. Find suppliers, discover products, and grow your business.', ar: 'سوق B2B للتصنيع في العراق. اعثر على الموردين، اكتشف المنتجات، ووسّع عملك.' },
  'footer.discover': { en: 'Discover', ar: 'اكتشف' },
  'footer.browseProducts': { en: 'Browse Products', ar: 'تصفح المنتجات' },
  'footer.browseCompanies': { en: 'Browse Companies', ar: 'تصفح الشركات' },
  'footer.forSuppliers': { en: 'For Suppliers', ar: 'للموردين' },
  'footer.joinSupplier': { en: 'Join as Supplier', ar: 'انضم كمورد' },
  'footer.supplierLogin': { en: 'Supplier Login', ar: 'دخول المورد' },
  'footer.contact': { en: 'Contact', ar: 'اتصل بنا' },
  'footer.serving': { en: 'Currently serving: Iraq | Kurdistan Region', ar: 'يخدم حالياً: العراق | إقليم كردستان' },
  'footer.rights': { en: '2024 Sanadiq. B2B Manufacturing Marketplace.', ar: '2024 صناديق. سوق B2B للتصنيع.' },

  // Common
  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'common.loadingMarketplace': { en: 'Loading marketplace...', ar: 'جاري تحميل السوق...' },
  'common.products': { en: 'products', ar: 'منتجات' },
  'common.uncategorized': { en: 'Uncategorized', ar: 'غير مصنف' },
  'common.iraq': { en: 'Iraq', ar: 'العراق' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sanadiq-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sanadiq-lang');
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'en';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('sanadiq-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem('sanadiq-lang', lang);
  }, [lang, dir]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const toggleLang = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang];
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t, dir }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
