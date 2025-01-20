export const cities = [
    { id: 'amman', en: 'Amman', ar: 'عمان', areas: [
        'ابو السوس', 'ابو النعير', 'ابو علندا', 'ابو نصير', 'ارينبه الشرقية', 'ارينبه الغربية',
        'الأمير حمزة', 'الايمان', 'البحاث', 'البصة', 'البقعه', 'البنيات', 'البيادر', 'البيضاء', 
        'الجاردنز', 'الجبل الأخضر', 'الجبيهة', 'الجميل', 'الجندويل', 'الجويدة', 'الجيزة', 'الحرّيّة', 
        'الحسنية', 'الحمر', 'الحمرانية', 'الخريم', 'الخزنة', 'الخشافية', 'الخضراء', 'الدمينا', 'الدمينه', 
        'الدوار الأول', 'الدوار الثاني', 'الدوار الثالث', 'الدوار الرابع', 'الدوار الخامس', 'الدوار السادس', 
        'الدوار السابع', 'الدوار الثامن', 'الديار', 'الذراع', 'الذهيبة', 'الذهيبه الشرقيه', 'الذهيبة الغربيه', 
        'الرابية', 'الربوة', 'الرجوم', 'الرجيب', 'الرجيلة', 'الرضوان', 'الرقيم', 'الروابي', 'الرونق', 
        'الزعفران', 'الزميلة', 'الزهراء', 'الزيتونة', 'السرو', 'السهل', 'الصناعة', 'الصويفية', 'الضياء', 
        'الطنيب', 'الظهير', 'العال', 'العبدلي', 'العبدلية', 'العدلية', 'العروبة', 'العودة', 'الفحيص', 
        'الفروسية', 'الفيصل', 'القسطل', 'القصبات', 'القصور', 'القنيطره', 'القويسمة', 'الكتيفه', 'الكرسي', 
        'الكمالية', 'الكوم الشرقي', 'الكوم الغربي', 'اللبّن', 'الماضونة', 'المحطة', 'المدينة الرياضية', 
        'المرقب', 'المستندة', 'المشتى', 'المشقر', 'المعادي', 'المغيرات', 'المقابلين', 'المناره', 'المنصور', 
        'الموقر', 'النقيرة', 'النهارية', 'الهاشمي الجنوبي', 'الهاشمي الشمالي', 'الوحدات', 'اليادودة', 'الياسمين', 
        'اليرموك', 'ام اذينة', 'ام اذينة الشرقي', 'ام اذينة الغربي', 'أم الأسود', 'ام البساتين', 'ام الدنانير', 
        'ام الرصاص', 'ام السماق', 'أم العمد', 'أم الكندم', 'ام بطمه', 'أم رمانة', 'ام زويتينة', 'أم شطيرات', 
        'أم قصير', 'ام نوارة', 'بدر', 'بدر الجديدة', 'بسمان', 'بلال', 'بيرين', 'تلاع العلي', 'تلاع العلي الشرقي', 
        'تلاع العلي الشمالي', 'جاوا', 'جبل الأشرفية', 'جبل التاج', 'جبل الجوفة', 'جبل الحسين', 'جبل الزهور', 
        'جبل اللويبدة', 'جبل المريخ', 'جبل النزهة', 'جبل النصر', 'جبل النظيف', 'جبل عمان', 'جلول', 'حجار النوابلسة', 
        'حسبان', 'حطين', 'حوارة', 'حي البركة', 'حي الخالدين', 'حي الرحمانية', 'حي الصالحين', 'حي الصحابة', 
        'حي عدن', 'حي نزال', 'خان الزبيب', 'خربة السوق', 'خلدا', 'دابوق', 'دير غبار', 'راس العين', 'رجم الشامي', 
        'رجم الشوف', 'رجم عميش', 'زبود', 'زملة العليا', 'زويزا', 'زينات الربوع', 'زينب', 'سالم', 'سحاب', 'شارع الأردن', 
        'شارع الجامعة', 'شارع المدينة', 'شارع المية', 'شارع مكة', 'شفا بدران', 'شميساني', 'صافوط', 'صالحية العابد', 
        'صوفا', 'صويلح', 'ضاحية الاستقلال', 'ضاحية الاقصى', 'ضاحية الامير حسن', 'ضاحية الامير راشد', 'ضاحية الأمير علي', 
        'ضاحية الحاج حسن', 'ضاحية الحسين', 'ضاحية الرشيد', 'ضاحية الروضة', 'ضاحية النخيل', 'ضبعه', 'طبربور', 'طريق المطار', 
        'طريق المطار - جسر ديونز', 'طريق المطار - جسر مادبا', 'طلوع المصدار', 'عبدون', 'عبدون الجنوبي', 'عبدون الشمالي', 
        'عراق الامير', 'عرجان', 'عين رباط', 'عيون الذيب', 'قعفور', 'ماحص', 'ماركا', 'ماركا الجنوبية', 'ماركا الشمالية', 
        'مرج الحمام', 'مرج الفرس', 'موبص', 'ناعور', 'وادي الحدادة', 'وادي السرور', 'وادي السير', 'وادي الطي', 'وادي العش', 
        'وادي صقرة', 'وسط البلد', 'ياجوز','اخرى'
      ] },
      { id: 'irbid', en: 'Irbid', ar: 'إربد', areas: [
        'ابان', 'أبو سيدو', 'اربد مول', 'ارحابا', 'اسكان الأطباء', 'اسكان الضباط', 
        'اسكان العاملين', 'اسكان المهندسين', 'اشارة الاسكان', 'اشارة الدراوشة', 'اشارة الملكة نور',
        'الأشرفية', 'الأندلس', 'البارحة', 'الباقورة', 'البلد', 'التل', 'الحسبة المركزية', 'الحصن', 
        'الحي الجنوبي', 'الحي الشرقي', 'الحي الغربي', 'الخراج', 'الرابية', 'الراهبات الوردية', 
        'الروضة', 'الزمالية', 'السنبلة', 'السوق', 'الشجرة', 'الشونة الشمالية', 'الشيخ حسين', 
        'الصريح', 'العدسية', 'المخيبة التحتة', 'المدرسة الشاملة', 'المدينة الصناعية', 'المزار الشمالي', 
        'المشارع', 'المطلع', 'المغير', 'الملعب البلدي', 'المنشية', 'النزهة', 'النعيمة', 'ام الجدايل', 
        'ام قيس', 'ايدون', 'برشتا', 'بشرى', 'بصيلة', 'بيت أديس', 'بيت راس', 'بيت يافا', 'تبنه', 'تقبل', 
        'جامعة العلوم والتكنولوجيا', 'ججين', 'جحفية', 'جديتا', 'جمحا', 'جيفين', 'حبراص', 'حبكا', 
        'حدائق الملك عبدالله', 'حرثا', 'حريما', 'حكما', 'حنينا', 'حوارة', 'حور', 'حوفا', 'حي الأبرار', 
        'حي الأفراح', 'حي التركمان', 'حي التلول', 'حي الزهور', 'حي القصيلة', 'حي المنارة', 'حي الورود', 
        'حي طوال', 'حي عالية', 'خربة البرز', 'خربة قاسم', 'خرجا', 'خلف السيفوي', 'دوار البياضة', 
        'دوار الثقافة', 'دوار الدرة', 'دوار العيادات', 'دوار القبة', 'دوار اللوازم', 'دوار النسيم', 
        'دوار سال', 'دوار شركة الكهرباء', 'دوار صحارى', 'دوقرا', 'دير أبي سعيد', 'دير السعنة', 'دير يوسف', 
        'زبدة', 'زهر', 'زوبيا', 'سال', 'سحم', 'سما الروسان', 'سمر', 'سموع', 'سوم', 'سيل الحمة', 
        'شارع البارحة', 'شارع البتراء', 'شارع الثلاثين', 'شارع الجامعة', 'شارع الحصن', 'شارع القدس', 
        'شارع الهاشمي', 'شارع حكما', 'شارع فلسطين', 'شارع فوعرة', 'شطنا', 'صالة الشرق', 'صما', 'صمد', 
        'صيدور', 'ضاحية الأمير راشد', 'ضاحية الحسين', 'طبقة فحل', 'علعال', 'عنبة', 'غرفة التجارة', 'فوعرا', 
        'قراقوش', 'قرية حاتم', 'قرية صمد', 'قم', 'قميم', 'كتم', 'كريمة', 'كفر ابيل', 'كفر أسد', 'كفر الماء', 
        'كفر جايز', 'كفر راكب', 'كفر سوم', 'كفر يوبا', 'كفرعوان', 'كلية بنات اربد', 'لواء الطيبة', 
        'مجمع الأغوار الجديد', 'مجمع الشمال', 'مجمع الشيخ خليل', 'مجمع عمان الجديد', 'مخربا', 'مرو', 
        'مستشفى الأميرة بسمة', 'مستشفى الملك عبدالله', 'مستشفى ايدون العسكري', 'مسجد حسن التل', 'ملكا', 
        'مندح', 'ناطفه', 'هام', 'وادي الريان', 'وقاص', 'يبلا', 'أخرى'
      ] },
      { id: 'zarqa', en: 'Zarqa', ar: 'الزرقاء', areas: [
        'حي الأمير عبدالله', 'أبو الزيغان', 'اتوستراد', 'اسكان البتراوي', 'اسكان طلال-الرصيفة', 'الأزرق',
        'البستان', 'التطوير الحضري', 'التطوير الحضري-الرصيفة', 'الثوره العربية الكبرى', 'الحاووز', 'الرحيل',
        'الرصيفة', 'الرصيفة الجنوبي', 'الزرقاء الجديدة', 'الزواهرة', 'السخنة', 'السوق', 'الضليل', 'العالوك',
        'الغباوي', 'الغويرية', 'القادسية-الرصيفة', 'القنية', 'الكمشة', 'المشيرفة', 'المنطقة الحرة', 'النصر',
        'الهاشمية', 'أم رمانة', 'أم صليح', 'بيرين', 'جامعة الزرقاء الخاصة', 'جبل الأبيض', 'جبل الأمير حسن',
        'جبل الأمير حمزة', 'جبل الأمير فيصل', 'جبل الاميرة رحمة', 'جبل الشمالي-الرصيفة', 'جبل المغير',
        'جبل طارق', 'جريبا', 'جناعة', 'حي الاسكان', 'حي الأمير محمد', 'حي الجندي', 'حي الحسين', 'حي الرشيد-الرصيفة',
        'حي النزهة', 'حي جعفر الطيار', 'حي رمزي', 'حي شاكر', 'حي معصوم', 'خو', 'دوقرة', 'رجم الشوك', 'شارع الجيش',
        'شارع السعادة', 'شارع المصفاة', 'شومر', 'صروت', 'ضاحية الأميرة هيا', 'ضاحية المدينة المنورة', 
        'ضاحية مكة المكرمة', 'عوجان', 'غريسا', 'قصر الحلابات الشرقي', 'قصر الحلابات الغربي', 'مخيم حطين', 
        'مدينة الشرق', 'وادي الحجر', 'وادي العش', 'أخرى'
      ] },
      {
        id: 'salt',
        en: 'Salt',
        ar: 'السلط',
        areas: [
          'البلقاء', 'الجادور', 'الجدعة', 'الخضر', 'الخندق', 'الرميمين', 'الزهور', 'السرو', 'السلالم',
          'السليحي', 'الشونه الجنوبيه', 'الصبيحي', 'الصوارفة', 'العيزرية', 'القلعة', 'المغاريب', 'المنشية',
          'الميدان', 'النقب', 'أم الدنانير', 'أم جوزة', 'جلعد', 'حي الخرابشة', 'دير علا', 'زي', 'سويمة',
          'سيحان', 'شفا العامرية', 'علان', 'عيرا', 'عين الباشا', 'قرية أبو نصير', 'كفرهودا', 'نقب الدبور',
          'وادي شعيب', 'يرقا', 'أخر'
        ]
      },
]