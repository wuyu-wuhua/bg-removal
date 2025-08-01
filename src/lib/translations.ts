export type Language = 'zh' | 'en'

export interface Translations {
  // 网站标题和元数据
  metadata: {
    title: string
    description: string
    pageTitle: string
  }

  // Logo
  logo: {
    alt: string
    text: string
  }
  
  // 通用
  common: {
    startUsing: string
    viewPricing: string
    login: string
    about: string
    home: string
    pricing: string
    backToHome: string
    contactUs: string
    sendEmail: string
    freeTrial: string
    noRegistration: string
    instantProcessing: string
    professionalQuality: string
    startNow: string
    readyToExperience: string
    joinThousands: string
    noCreditCard: string
    noDownload: string
    startJourney: string
  }

  // 导航栏
  navbar: {
    home: string
    pricing: string
    aboutUs: string
    login: string
    startUsing: string
  }

  // 首页
  home: {
    hero: {
      title: string
      subtitle: string
      description: string
      ctaPrimary: string
      ctaSecondary: string
      badge: string
      mainTitle: string
      subTitle: string
      features: {
        title: string
        trial: string
        formats: string
        algorithm: string
        batch: string
      }
    }
    stats: {
      title: string
      subtitle: string
      cards: Array<{
        title: string
        value: string
        subtitle?: string
        description: string
        trend?: string
        trendValue?: string
      }>
    }
    steps: {
      title: string
      subtitle: string
      description: string
      items: Array<{
        number: string
        title: string
        description: string
        features: string[]
      }>
    }
    features: {
      title: string
      subtitle: string
      description: string
      intelligentCutout: {
        title: string
        description: string
        features: string[]
      }
      imageEnhancement: {
        title: string
        description: string
        features: string[]
      }
      batchProcessing: {
        title: string
        description: string
        features: string[]
      }
      step1: {
        title: string
        description: string
        features: string[]
      }
      step2: {
        title: string
        description: string
        features: string[]
      }
      step3: {
        title: string
        description: string
        features: string[]
      }
      step4: {
        title: string
        description: string
        features: string[]
        button: string
      }
    }
    caseStudy: {
      title: string
      subtitle: string
      description: string
      viewAll: string
    }
    testimonials: {
      title: string
      subtitle: string
      rating: string
      reviews: Array<{
        name: string
        username: string
        location: string
        role: string
        body: string
      }>
    }
    faq: {
      title: string
      subtitle: string
      description: string
      questions: Array<{
        question: string
        answer: string
      }>
    }
  }

  // 定价页面
  pricing: {
    title: string
    subtitle: string
    plans: {
      basic: {
        name: string
        description: string
        originalPrice: string
        currentPrice: string
        credits: string
        features: string[]
        button: string
      }
      standard: {
        name: string
        description: string
        originalPrice: string
        currentPrice: string
        savings: string
        credits: string
        features: string[]
        button: string
        popular: string
      }
      premium: {
        name: string
        description: string
        originalPrice: string
        currentPrice: string
        savings: string
        credits: string
        features: string[]
        button: string
      }
    }
    howToUse: {
      title: string
      creditRate: string
      steps: string[]
    }
    faq: {
      title: string
      questions: Array<{
        question: string
        answer: string
      }>
    }
  }

  // 案例页面
  cases: {
    title: string
    subtitle: string
    description: string
    stats: {
      processedImages: string
      avgProcessingTime: string
      qualityImprovement: string
    }
    cta: {
      title: string
      description: string
      startUsing: string
      viewPricing: string
    }
    cases: Array<{
      id: number
      title: string
      description: string
      category: string
      rating: number
      views: string
    }>
  }

  // 关于我们页面
  about: {
    title: string
    subtitle: string
    description: string
    badge: string
    heroStats: {
      users: string
      countries: string
      satisfaction: string
    }
    mission: {
      title: string
      description: string
      features: string[]
    }
    vision: {
      title: string
      description: string
      coreValues: {
        title: string
        userFirst: string
        innovation: string
        security: string
        globalService: string
      }
    }
    story: {
      title: string
      subtitle: string
      timeline: Array<{
        year: string
        title: string
        description: string
        items: string[]
      }>
    }
    team: {
      title: string
      subtitle: string
      departments: Array<{
        title: string
        subtitle: string
        description: string
      }>
    }
    stats: {
      title: string
      subtitle: string
      cards: Array<{
        value: string
        label: string
        description: string
        trend?: string
      }>
    }
    cta: {
      title: string
      description: string
      startUsing: string
      contactUs: string
    }
    backToHome: string
  }

  // 登录页面
  login: {
    title: string
    subtitle: string
    googleLogin: string
    terms: string
    privacy: string
  }

  // 上传页面
  upload: {
    title: string
    subtitle: string
    backToHome: string
    uploadArea: {
      title: string
      subtitle: string
      dragDrop: string
      or: string
      paste: string
      url: string
      examples: string
      exampleTitle: string
      exampleLabel: string
      clickToUse: string
      exampleImages: string[]
    }
          editor: {
        createAIScene: string
        download: string
        background: string
        backgroundNew: string
        eraser: string
        effects: string
        createDesign: string
        tools: {
          zoom: string
          rotate: string
          reset: string
          fullscreen: string
          eraser: string
          palette: string
        }
        rating: string
        thumbnail: string
        originalImage: string
        processedImage: string
        processing: string
        processingComplete: string
        processingFailed: string
        showEffect: string
        uploadAndProcess: string
        removeBackground: string
        reprocess: string
        downloadResult: string
      }
    footer: {
      termsAgreement: string
      termsLink: string
      privacyInfo: string
      privacyLink: string
    }
  }

  // 帮助页面
  help: {
    title: string
    subtitle: string
    search: string
    backToHome: string
    badge: string
    description: string
    searchPlaceholder: string
    views: string
    categories: {
      title: string
      subtitle: string
      gettingStarted: {
        title: string
        description: string
        items: string[]
      }
      features: {
        title: string
        description: string
        items: string[]
      }
      security: {
        title: string
        description: string
        items: string[]
      }
      billing: {
        title: string
        description: string
        items: string[]
      }
    }
    popularArticles: {
      title: string
      subtitle: string
      articles: Array<{
        title: string
        category: string
        views: string
        rating: number
      }>
    }
    contactSupport: {
      title: string
      subtitle: string
      description: string
      methods: Array<{
        title: string
        description: string
        button: string
      }>
    }
  }

  // 联系我们页面
  contact: {
    title: string
    subtitle: string
    description: string
    methods: Array<{
      title: string
      contact: string
      description: string
    }>
  }

  // 个人空间页面
      dashboard: {
      title: string
      subtitle: string
      welcome: string
      loading: string
      credits: string
    creditOverview: {
      title: string
      currentCredits: string
      totalEarned: string
      totalConsumed: string
      buyCredits: string
    }
    recentTransactions: {
      title: string
      noTransactions: string
      refresh: string
      tableHeaders: {
        type: string
        description: string
        amount: string
        date: string
        status: string
      }
      type: {
        recharge: string
        consumption: string
        rollback: string
        refund: string
        unknown: string
        other: string
      }
      status: {
        success: string
        failed: string
        pending: string
      }
    }
          generations: {
        title: string
        noGenerations: string
        view: string
        image: string
        generatedResult: string
        tableHeaders: {
          type: string
          status: string
          result: string
          created: string
          action: string
        }
      }
    creditPackages: {
      title: string
      description: string
      recommended: string
      buyCredits: string
      basic: {
        name: string
        price: string
        credits: string
        description: string
      }
      standard: {
        name: string
        price: string
        credits: string
        description: string
        recommended: string
      }
      premium: {
        name: string
        price: string
        credits: string
        description: string
      }
    }
    paymentModal: {
      title: string
      processing: string
      success: string
      error: string
      unauthorized: string
      paymentSuccess: string
      securePayment: string
      purchase: string
      getCredits: string
      price: string
      creditCardInfo: string
      cancel: string
      pay: string
      loginFirst: string
      paymentInitFailed: string
      createPaymentFailed: string
      paymentFormNotLoaded: string
      paymentFailed: string
      paymentProcessFailed: string
    }
  }

  // 政策页面
  policies: {
    refund: {
      title: string
      content: string
      contact: string
      backToHome: string
      email: string
      phone: string
      badge: string
      heroStats: {
        days: string
        fullRefund: string
        fastProcess: string
      }
      overview: {
        title: string
        description: string
        features: Array<{
          title: string
          description: string
        }>
      }
      process: {
        title: string
        description: string
        steps: Array<{
          title: string
          description: string
        }>
      }
      conditions: {
        title: string
        description: string
        eligible: Array<string>
        notEligible: Array<string>
      }
      contactInfo: {
        title: string
        description: string
        methods: Array<{
          title: string
          description: string
          action: string
        }>
      }
      sidebar: {
        quickInfo: {
          title: string
          items: Array<{
            text: string
          }>
        }
        faq: {
          title: string
          questions: Array<{
            question: string
            answer: string
          }>
        }
        cta: {
          title: string
          description: string
        }
      }
      notEligibleTitle: string
    }
    service: {
      title: string
      content: string
      contact: string
      backToHome: string
      freeTrial: string
      badge: string
      description: string
      heroStats: {
        availability: string
        support: string
        security: string
      }
      overview: {
        title: string
        description: string
        features: Array<{
          title: string
          description: string
        }>
      }
      terms: {
        title: string
        scope: {
          title: string
          items: string[]
        }
        guidelines: {
          title: string
          items: string[]
        }
      }
      sla: {
        title: string
        availability: {
          title: string
          value: string
          description: string
        }
        responseTime: {
          title: string
          value: string
          description: string
        }
        support: {
          title: string
          value: string
          description: string
        }
      }
      security: {
        title: string
        encryption: {
          title: string
          subtitle: string
          description: string
        }
        privacy: {
          title: string
          subtitle: string
          description: string
        }
      }
      sidebar: {
        features: {
          title: string
          items: string[]
        }
        support: {
          title: string
          email: string
          phone: string
          responseTime: string
        }
        cta: {
          title: string
          description: string
          button: string
        }
      }
    }
    privacy: {
      title: string
      content: string
      contact: string
      backToHome: string
      email: string
      phone: string
      badge: string
      description: string
      heroStats: {
        dataEncryption: string
        privacyProtection: string
        securityReliable: string
      }
      overview: {
        title: string
        description: string
        features: Array<{
          title: string
          description: string
        }>
      }
      informationCollection: {
        title: string
        weCollect: {
          title: string
          items: Array<string>
        }
        weDontCollect: {
          title: string
          items: Array<string>
        }
      }
      informationUsage: {
        title: string
        purposes: Array<{
          number: string
          title: string
          description: string
        }>
      }
      dataProtection: {
        title: string
        methods: Array<{
          title: string
          subtitle: string
          description: string
        }>
      }
      sidebar: {
        privacyHighlights: {
          title: string
          items: Array<{
            title: string
          }>
        }
        faq: {
          title: string
          questions: Array<{
            question: string
            answer: string
          }>
        }
        contact: {
          title: string
          description: string
          sendEmail: string
        }
      }
    }
    terms: {
      title: string
      content: string
      contact: string
      backToHome: string
      email: string
      phone: string
      badge: string
      heroStats: {
        legalProtection: string
        rightsProtection: string
        userFriendly: string
      }
      overview: {
        title: string
        description: string
        features: Array<{
          title: string
          description: string
        }>
      }
      serviceDescription: {
        title: string
        content: {
          title: string
          services: Array<string>
        }
        scope: {
          title: string
          items: Array<string>
        }
      }
      userRights: {
        title: string
        rights: {
          title: string
          items: Array<string>
        }
        obligations: {
          title: string
          items: Array<string>
        }
      }
      prohibitedActivities: {
        title: string
        activities: Array<{
          title: string
          subtitle: string
          description: string
        }>
      }
      sidebar: {
        keyPoints: {
          title: string
          items: Array<{
            text: string
          }>
        }
        faq: {
          title: string
          questions: Array<{
            question: string
            answer: string
          }>
        }
        contact: {
          title: string
          description: string
          sendEmail: string
        }
      }
    }
  }

  // 图片对比组件
  imageComparison: {
    dragToCompare: string
    originalImage: string
    resultImage: string
  }

  // 页脚
  footer: {
    description: string
    quickLinks: string
    support: string
    aboutUs: string
    contactUs: string
    refund: string
    service: string
    helpCenter: string
    faq: string
    terms: string
    privacy: string
    cookie: string
    copyright: string
    allRightsReserved: string
  }
}

export const translations: Record<Language, Translations> = {
  zh: {
    metadata: {
      title: 'BgRemoval - 专业的AI图像处理平台',
      description: '专业的AI图像处理平台，为您提供精准的背景移除、物体分割和图像增强服务。',
      pageTitle: 'BgRemoval - 专业的AI图像处理平台'
    },
    logo: {
      alt: 'BgRemoval',
      text: 'BgRemoval'
    },
    common: {
      startUsing: '开始使用',
      viewPricing: '查看定价',
      login: '登录',
      about: '关于我们',
      home: '首页',
      pricing: '定价',
      backToHome: '返回首页',
      contactUs: '联系我们',
      sendEmail: '发送邮件',
      freeTrial: '免费试用',
      noRegistration: '无需注册',
      instantProcessing: '即时处理',
      professionalQuality: '专业品质',
      startNow: '立即开始',
      readyToExperience: '准备好体验AI的魅力了吗？',
      joinThousands: '加入数万名用户的选择',
      noCreditCard: '无需信用卡，无需下载软件，立即开始您的AI图像处理之旅。',
      noDownload: '无需下载软件',
      startJourney: '立即开始您的AI图像处理之旅'
    },
    navbar: {
      home: '首页',
      pricing: '定价',
      aboutUs: '关于我们',
      login: '登录',
      startUsing: '开始使用'
    },
    home: {
      hero: {
        title: '准备好体验AI的魅力了吗？',
        subtitle: '加入数万名用户的选择',
        description: '无需信用卡，无需下载软件，立即开始您的AI图像处理之旅。',
        ctaPrimary: '免费开始使用',
        ctaSecondary: '查看案例',
        badge: 'AI驱动的图像处理平台',
        mainTitle: '背景移除',
        subTitle: '精准抠图，智能处理',
        features: {
          title: '功能特色',
          trial: '注册即可试用',
          formats: '支持多种图片格式',
          algorithm: '高精度AI算法',
          batch: '批量处理'
        }
      },
      stats: {
        title: '数据说话,实力见证',
        subtitle: '全球用户的信赖选择',
        cards: [
          {
            title: '活跃用户',
            value: '50K+',
            description: '来自全球的专业用户',
            trend: '增长',
            trendValue: '+15%'
          },
          {
            title: '行业领先',
            value: '1M+',
            subtitle: '图片处理量',
            description: '每月处理超过100万张图片'
          },
          {
            title: '准确率',
            value: '99.9%',
            description: 'AI算法的准确率'
          },
          {
            title: '用户满意度',
            value: '99.9%',
            description: '客户满意度评分',
            trend: '增长',
            trendValue: '+12%'
          }
        ]
      },
      steps: {
        title: '三步完成,简单高效',
        subtitle: '无需专业技能,人人都能使用',
        description: '简化的工作流程,让图像处理变得前所未有的简单',
        items: [
          {
            number: '1',
            title: '开始',
            description: '上传图片',
            features: ['支持多种格式', '拖拽上传', '批量处理']
          },
          {
            number: '2',
            title: '处理',
            description: 'AI智能处理',
            features: ['智能识别', '自动优化', '实时预览']
          },
          {
            number: '3',
            title: '完成',
            description: '下载结果',
            features: ['高清输出', '多种格式', '一键下载']
          },
          {
            number: '4',
            title: '完成',
            description: '完成处理',
            features: ['质量保证', '快速处理', '满意结果']
          }
        ]
      },
      features: {
        title: '强大功能，简单易用',
        subtitle: '一站式图像处理解决方案',
        description: '从背景移除到图像增强，我们提供全方位的AI图像处理服务',
        intelligentCutout: {
          title: '智能抠图',
          description: '使用深度学习算法，精确识别并分离前景与背景，支持复杂场景和细节处理。',
          features: ['毫秒级处理速度', '99%+准确率', '支持复杂背景']
        },
        imageEnhancement: {
          title: '图像增强',
          description: '自动化优化图像质量，提升清晰度，对比度和色彩饱和度，让您的图片更加出色。',
          features: ['自动色彩校正', '降噪处理', '细节增强']
        },
        batchProcessing: {
          title: '批量处理',
          description: '支持同时处理多张图片，大幅提升工作效率，适合电商、设计等批量需求。',
          features: ['支持100+张同时处理', '保持一致质量', '自动命名']
        },
        step1: {
          title: '上传图片',
          description: '支持多种格式，拖拽上传更便捷',
          features: ['支持JPG、PNG、WebP', '拖拽上传', '批量处理', '云端存储']
        },
        step2: {
          title: 'AI智能处理',
          description: '先进的AI算法，自动识别并处理',
          features: ['智能识别', '自动优化', '实时预览', '一键处理']
        },
        step3: {
          title: '下载结果',
          description: '高质量输出，多种格式选择',
          features: ['高清输出', '多种格式', '批量下载', '云端同步']
        },
        step4: {
          title: '享受成果',
          description: '与朋友和同事分享您的精彩成果',
          features: ['一键分享', '社交媒体', '专业用途'],
          button: '完成'
        }
      },
      caseStudy: {
        title: '案例展示',
        subtitle: '见证AI的无限可能',
        description: '探索我们AI图像处理技术的真实案例，感受专业级的处理效果',
        viewAll: '查看全部案例'
      },
      testimonials: {
        title: '用户评价',
        subtitle: '加入成千上万信任 CutoutMaster 满足其图像编辑需求的满意用户的行列',
        rating: '基于10,000+条评价',
        reviews: [
          {
            name: 'Xiaoya Li',
            username: '@xiaoya',
            location: 'CN China',
            role: 'E-commerce Designer',
            body: 'CutoutMaster 的背景去除太棒了！它可以在几秒钟内完美去除背景，甚至比专业工具更精确。'
          },
          {
            name: 'David Chen',
            username: '@davidc',
            location: 'US United States',
            role: 'Professional Photographer',
            body: '作为摄影师，我每天处理数百张照片。CutoutMaster的批量处理为我节省了80%的时间！'
          },
          {
            name: 'Misaki Tanaka',
            username: '@misaki',
            location: 'JP Japan',
            role: 'Graphic Designer',
            body: '终于找到了完美的抠图工具！就连发丝也处理得如此精细，这绝对是太棒了。'
          },
          {
            name: 'Max Weber',
            username: '@maxw',
            location: 'DE Germany',
            role: 'Product Manager',
            body: 'AI技术真正改变了我的工作流程。创建产品图片现在变得如此简单高效。'
          },
          {
            name: 'Sophie Martin',
            username: '@sophie',
            location: 'FR France',
            role: 'Creative Director',
            body: '对其处理复杂背景的能力印象深刻，即使是透明玻璃和反光材料也能完美处理。'
          },
          {
            name: 'Ryan Thompson',
            username: '@ryant',
            location: 'CA Canada',
            role: 'Social Media Manager',
            body: '移动端体验也很棒，我可以随时随地处理图片。真正的生产力工具！'
          },
          {
            name: 'Isabella Brown',
            username: '@bella',
            location: 'AU Australia',
            role: 'E-commerce Manager',
            body: '批量处理太有用了！一次处理100张图片的同时保持一致的品质。'
          },
          {
            name: 'Arjun Patel',
            username: '@arjun',
            location: 'IN India',
            role: 'Digital Marketing Expert',
            body: '从试用用户到付费用户，CutoutMaster不断改进。期待更多AI功能！'
          },
          {
            name: 'Emma Wilson',
            username: '@emma',
            location: 'GB United Kingdom',
            role: 'Freelancer',
            body: '免费版本已经很强大，付费功能更是令人惊喜。物超所值！'
          },
          {
            name: 'Jihoon Park',
            username: '@jihoon',
            location: 'KR South Korea',
            role: 'Content Creator',
            body: '界面简洁易用，初学者可以快速上手。客户支持响应很快。'
          },
          {
            name: 'Ana Silva',
            username: '@anas',
            location: 'BR Brazil',
            role: 'Blogger',
            body: '增强功能将我的图片质量提升到了新水平，细节更加生动清晰。'
          },
          {
            name: 'Carlos Rodriguez',
            username: '@carlos',
            location: 'ES Spain',
            role: 'Enterprise User',
            body: '安全措施很棒，图片处理完成后会自动删除。完全不用担心隐私问题。'
          }
        ]
      },
      faq: {
        title: '常见问题解答',
        subtitle: '快速了解我们的服务',
        description: '如果您有其他问题，请随时联系客户团队',
        questions: [
          {
            question: 'CutoutMaster支持哪些图片格式？',
            answer: '我们支持JPG、PNG、WebP、BMP等主流图片格式，最大文件大小为10MB。'
          },
          {
            question: '处理一张图片需要多长时间？',
            answer: '通常情况下，处理一张图片只需要2-5秒，具体时间取决于图片大小和复杂度。'
          },
          {
            question: '免费用户有什么限制？',
            answer: '免费用户每天可以处理10张图片，升级到付费计划可以享受无限制处理。'
          },
          {
            question: '如何保证图片的隐私安全？',
            answer: '我们采用端到端加密技术，处理完成后会自动删除您的图片，绝不保存或分享。'
          },
          {
            question: '可以批量处理图片吗？',
            answer: '是的，付费用户可以同时上传并处理多张图片，大大提升工作效率。'
          },
          {
            question: '如何注册账户？',
            answer: '点击右上角的注册按钮，使用邮箱或第三方账户即可快速注册。'
          }
        ]
      }
    },
    pricing: {
      title: '选择您的积分套餐',
      subtitle: '为您的图像处理需求选择完美的方案',
      plans: {
        basic: {
          name: '基础版',
          description: '完美适合开始使用AI图像生成',
          originalPrice: '$10.00',
          currentPrice: '$9.99',
          credits: '100 积分',
          features: [
            '100 AI图像积分',
            '基础支持',
            '标准质量',
            '个人使用许可'
          ],
          button: '选择套餐'
        },
        standard: {
          name: '标准版',
          description: '适合需要更多积分的常规用户',
          originalPrice: '$55.00',
          currentPrice: '$29.99',
          savings: '节省 55%',
          credits: '500 积分',
          features: [
            '500 AI图像积分',
            '优先支持',
            '高质量',
            '商业使用许可'
          ],
          button: '选择套餐',
          popular: '最受欢迎'
        },
        premium: {
          name: '热门版',
          description: '最受高级用户欢迎的选择',
          originalPrice: '$120.00',
          currentPrice: '$49.99',
          savings: '节省 58%',
          credits: '1000 积分',
          features: [
            '1000 AI图像积分',
            '高级支持',
            '高级质量',
            '商业使用许可',
            '高级功能'
          ],
          button: '选择套餐'
        }
      },
      howToUse: {
        title: '如何使用积分',
        creditRate: '1积分 = 处理1张图片',
        steps: [
          '上传图片并选择处理类型',
          '处理完成后自动扣除积分',
          '在仪表板中查看积分余额'
        ]
      },
      faq: {
        title: '常见问题',
        questions: [
          {
            question: '积分如何使用?',
            answer: '每次使用AI功能处理图片时会消耗相应积分。不同功能消耗的积分数量不同，图像上色通常消耗4-6积分，图像超分消耗3-5积分。'
          },
          {
            question: '积分有有效期吗?',
            answer: '是的，积分自购买之日起12个月内有效。我们建议您根据实际使用频率选择合适的套餐。'
          },
          {
            question: '支持哪些支付方式?',
            answer: '我们支持信用卡、借记卡等多种支付方式，所有支付都通过Stripe安全处理，确保您的支付信息安全。'
          },
          {
            question: '如何获得免费积分?',
            answer: '我们提供每日登录奖励系统，用户每天登录可自动获得5个积分。登录后会在消息中心收到奖励通知。这是我们奖励用户并鼓励持续使用我们服务的方式。您也可以点击右上角的礼物图标手动领取奖励。'
          }
        ]
      }
    },
    cases: {
      title: '效果展示',
      subtitle: '查看我们 AI 技术的真实处理效果',
      description: '探索我们AI图像处理技术的真实案例，感受专业级的处理效果。每个案例都展示了我们技术的精准性和可靠性。',
      stats: {
        processedImages: '已处理图片',
        avgProcessingTime: '平均处理时间',
        qualityImprovement: '平均质量提升'
      },
      cta: {
        title: '准备体验 AI 图像处理？',
        description: '立即开始，让您的图片焕然一新',
        startUsing: '免费试用',
        viewPricing: '查看价格'
      },
      cases: [
        {
          id: 1,
          title: '人像背景移除',
          description: '完美处理复杂人像，包括发丝细节',
          category: '人像处理',
          rating: 4.9,
          views: '2.3k'
        },
        {
          id: 2,
          title: '动物图像处理',
          description: '精确识别动物轮廓，保持自然效果',
          category: '动物处理',
          rating: 4.8,
          views: '1.8k'
        },
        {
          id: 3,
          title: '产品展示优化',
          description: '专业级产品图片背景移除',
          category: '产品处理',
          rating: 4.9,
          views: '3.1k'
        },
        {
          id: 4,
          title: '汽车背景移除',
          description: '复杂背景下的车辆精确提取',
          category: '车辆处理',
          rating: 4.7,
          views: '1.5k'
        },
        {
          id: 5,
          title: '宠物照片处理',
          description: '可爱宠物的专业级背景移除',
          category: '宠物处理',
          rating: 4.8,
          views: '2.1k'
        },
        {
          id: 6,
          title: '建筑摄影优化',
          description: '建筑摄影的专业背景处理',
          category: '建筑处理',
          rating: 4.6,
          views: '1.2k'
        }
      ]
    },
    about: {
      title: '关于我们',
      subtitle: '了解我们的使命和愿景',
      description: '我们致力于通过先进的AI技术，为用户提供专业、高效、易用的图像处理解决方案。',
      badge: '关于背景移除',
      heroStats: {
        users: '50K+ 用户',
        countries: '100+ 国家',
        satisfaction: '99.9% 满意度'
      },
      mission: {
        title: '我们的使命',
        description: '通过先进的AI技术，为用户提供专业、高效、易用的图像处理解决方案，让每个人都能轻松实现专业的图像编辑效果。',
        features: ['降低图像处理的技术门槛', '提供高效精准的AI解决方案', '持续创新，引领行业发展']
      },
      vision: {
        title: '我们的愿景',
        description: '成为全球领先的AI图像处理平台，通过技术创新推动创意产业的发展，让AI技术真正服务于人类的创造力和生产力。',
        coreValues: {
          title: '核心价值',
          userFirst: '用户至上',
          innovation: '技术创新',
          security: '安全可靠',
          globalService: '全球服务'
        }
      },
      story: {
        title: '我们的故事',
        subtitle: '从创意到现实的旅程',
        timeline: [
          {
            year: '2022',
            title: '创立之初',
            description: '由一群热爱AI技术的工程师和设计师共同创立，致力于解决图像处理的痛点问题。',
            items: ['团队组建', '技术研发', '产品规划']
          },
          {
            year: '2023',
            title: '技术突破',
            description: '成功开发出高精度的AI抠图算法，准确率达到99%以上，获得用户广泛认可。',
            items: ['算法优化', '用户增长', '市场认可']
          },
          {
            year: '2024',
            title: '全球扩张',
            description: '服务用户超过50万，处理图片超过100万张，成为行业领先的AI图像处理平台。',
            items: ['全球布局', '技术领先', '行业标杆']
          }
        ]
      },
      team: {
        title: '我们的团队',
        subtitle: '专业、创新、充满激情',
        departments: [
          {
            title: '技术团队',
            subtitle: 'AI算法专家',
            description: '来自顶尖高校和科技公司的AI专家，专注于深度学习算法研发'
          },
          {
            title: '产品团队',
            subtitle: '用户体验专家',
            description: '资深产品经理和设计师，致力于打造最佳的用户体验'
          },
          {
            title: '运营团队',
            subtitle: '客户服务专家',
            description: '专业的客户服务团队，7x24小时为用户提供支持'
          },
          {
            title: '市场团队',
            subtitle: '营销策略专家',
            description: '经验丰富的市场营销团队，推动品牌全球发展'
          }
        ]
      },
      stats: {
        title: '数据见证成长',
        subtitle: '用实力说话',
        cards: [
          {
            value: '50K+',
            label: '活跃用户',
            description: '来自全球100+国家',
            trend: '+15%'
          },
          {
            value: '1M+',
            label: '处理图片',
            description: '每月处理量'
          },
          {
            value: '99.9%',
            label: '准确率',
            description: 'AI算法精度'
          },
          {
            value: '24/7',
            label: '服务时间',
            description: '全天候技术支持'
          }
        ]
      },
      cta: {
        title: '加入我们的旅程',
        description: '让我们一起用AI技术改变世界，让创意无限可能',
        startUsing: '开始使用',
        contactUs: '联系我们'
      },
      backToHome: '返回首页'
    },
    imageComparison: {
      dragToCompare: '拖拽对比/点击切换',
      originalImage: '原图',
      resultImage: '结果图'
    },
    login: {
      title: '欢迎回来',
      subtitle: '登录您的账户',
      googleLogin: '使用Google登录',
      terms: '登录即表示您同意我们的',
      privacy: '隐私政策'
    },
    upload: {
      title: '上传一张图片以消除背景',
      subtitle: '上传您的图片',
      backToHome: '返回首页',
      uploadArea: {
        title: '上传图片',
        subtitle: '或者拖放一个文件',
        dragDrop: '或者拖放一个文件',
        or: '或者',
        paste: '粘贴图片或',
        url: 'URL',
        examples: '没有图片？试试这些示例图片：',
        exampleTitle: '示例',
        exampleLabel: '示例',
        clickToUse: '点击使用',
        exampleImages: ['人物照片', '动物照片', '物品照片', '建筑照片']
      },
      editor: {
        createAIScene: '创建AI场景',
        download: '下载',
        background: '背景',
        backgroundNew: '新的',
        eraser: '擦除/恢复',
        effects: '效果',
        createDesign: '创建设计',
        tools: {
          zoom: '缩放',
          rotate: '旋转',
          reset: '重置',
          fullscreen: '全屏',
          eraser: '橡皮擦',
          palette: '调色板'
        },
        rating: '给这个结果评分',
        thumbnail: '缩略图',
        originalImage: '原图',
        processedImage: '处理后',
        processing: '处理中...',
        processingComplete: '处理完成',
        processingFailed: '处理失败',
        showEffect: '展示效果中...',
        uploadAndProcess: '上传图片后自动开始处理',
        removeBackground: '移除背景',
        reprocess: '重新处理',
        downloadResult: '下载结果'
      },
      footer: {
        termsAgreement: '上传图片或网址，即代表您同意我们的',
        termsLink: '服务条款',
        privacyInfo: '。要了解有关 背景移除 如何处理您的个人数据的更多信息，请查看我们的',
        privacyLink: '隐私政策'
      }
    },
    help: {
      title: '帮助中心',
      subtitle: '找到您需要的帮助',
      search: '搜索帮助',
      backToHome: '返回首页',
      badge: '帮助中心',
      description: '找到您需要的所有帮助信息，快速解决使用过程中的问题',
      searchPlaceholder: '搜索帮助内容...',
      views: '次浏览',
      categories: {
        title: '帮助分类',
        subtitle: '选择您需要的帮助类型',
        gettingStarted: {
          title: '快速开始',
          description: '了解如何快速上手使用我们的服务',
          items: [
            '如何注册账户',
            '上传第一张图片',
            '下载处理结果',
            '基本操作指南'
          ]
        },
        features: {
          title: '功能使用',
          description: '掌握各种功能的使用方法',
          items: [
            '背景移除功能',
            '批量处理图片',
            '图片格式转换',
            '高级编辑工具'
          ]
        },
        security: {
          title: '账户安全',
          description: '保护您的账户和数据安全',
          items: [
            '密码安全设置',
            '隐私保护说明',
            '数据删除政策',
            '安全最佳实践'
          ]
        },
        billing: {
          title: '付费服务',
          description: '了解付费计划和订阅服务',
          items: [
            '套餐价格对比',
            '订阅管理',
            '发票和账单',
            '退款政策'
          ]
        }
      },
      popularArticles: {
        title: '热门文章',
        subtitle: '用户最常查看的帮助内容',
        articles: [
          {
            title: '如何批量处理多张图片？',
            category: '功能使用',
            views: '2.3k',
            rating: 4.8
          },
          {
            title: '支持的图片格式有哪些？',
            category: '快速开始',
            views: '1.8k',
            rating: 4.9
          },
          {
            title: '如何保证图片隐私安全？',
            category: '账户安全',
            views: '1.5k',
            rating: 4.7
          },
          {
            title: '免费版和付费版有什么区别？',
            category: '付费服务',
            views: '1.2k',
            rating: 4.6
          }
        ]
      },
      contactSupport: {
        title: '联系我们的客服团队',
        subtitle: '需要更多帮助？',
        description: '如果您在帮助中心找不到答案，我们的专业客服团队随时为您提供支持',
        methods: [
          {
            title: '邮件支持',
            description: '24小时内回复',
            button: '发送邮件'
          },
          {
            title: '电话支持',
            description: '工作日 9:00-18:00',
            button: '拨打电话'
          },
          {
            title: '在线客服',
            description: '7x24小时在线',
            button: '开始对话'
          }
        ]
      }
    },
    contact: {
      title: '联系我们',
      subtitle: '随时为您服务',
      description: '如果您有任何问题或建议，请通过以下方式联系我们：',
      methods: [
        {
          title: '客服邮箱',
          contact: 'q9425916@gmail.com',
          description: '发送邮件至我们的客服邮箱'
        },
        {
          title: '客服电话',
          contact: '+023 6287 2229',
          description: '拨打我们的客服热线'
        },
        {
          title: '在线客服',
          contact: 'https://example.com/chat',
          description: '通过在线聊天获得即时帮助'
        }
      ]
    },
    dashboard: {
      title: '个人空间',
      subtitle: '管理您的账户和积分',
      welcome: '欢迎回来',
      loading: '加载中...',
      credits: '积分',
      creditOverview: {
        title: '积分概览',
        currentCredits: '当前积分',
        totalEarned: '累计获得',
        totalConsumed: '累计消费',
        buyCredits: '购买积分'
      },
      recentTransactions: {
        title: '最近交易',
        noTransactions: '暂无交易记录',
        refresh: '刷新',
        tableHeaders: {
          type: '类型',
          description: '描述',
          amount: '金额',
          date: '日期',
          status: '状态'
        },
        type: {
          recharge: '充值',
          consumption: '消费',
          rollback: '回滚',
          refund: '退款',
          unknown: '未知',
          other: '其他'
        },
        status: {
          success: '成功',
          failed: '失败',
          pending: '处理中'
        }
      },
      generations: {
        title: '生成记录',
        noGenerations: '暂无生成记录',
        view: '查看',
        image: '图片',
        generatedResult: '生成结果',
        tableHeaders: {
          type: '类型',
          status: '状态',
          result: '结果',
          created: '创建时间',
          action: '操作'
        }
      },
      creditPackages: {
        title: '积分套餐',
        description: '选择适合您的积分套餐',
        recommended: '推荐',
        buyCredits: '购买积分',
        basic: {
          name: '基础版',
          price: '$9.99',
          credits: '100 积分',
          description: '适合轻度使用的用户'
        },
        standard: {
          name: '标准版',
          price: '$29.99',
          credits: '500 积分',
          description: '适合中度使用的用户',
          recommended: '推荐'
        },
        premium: {
          name: '热门版',
          price: '$49.99',
          credits: '1000 积分',
          description: '适合重度使用的用户'
        }
      },
      paymentModal: {
        title: '支付确认',
        processing: '处理中...',
        success: '支付成功',
        error: '支付失败',
        unauthorized: '请先登录后再进行支付',
        paymentSuccess: '支付成功！已获得',
        securePayment: '安全支付',
        purchase: '购买',
        getCredits: '获得',
        price: '价格',
        creditCardInfo: '信用卡信息',
        cancel: '取消',
        pay: '支付',
        loginFirst: '请先登录后再进行支付',
        paymentInitFailed: '支付初始化失败',
        createPaymentFailed: '创建支付失败',
        paymentFormNotLoaded: '支付表单未加载',
        paymentFailed: '支付失败',
        paymentProcessFailed: '支付处理失败'
      }
    },
    policies: {
          refund: {
      title: '退款政策',
      content: '我们提供30天无条件退款保证。如果您对我们的服务不满意，我们承诺在购买后30天内提供全额退款。退款将在3-5个工作日内处理完成。',
      contact: '联系客服',
      backToHome: '返回首页',
      email: '邮箱：q9425916@gmail.com',
      phone: '电话：+023 6287 2229',
      badge: '退款保障',
      heroStats: {
        days: '7天内退款',
        fullRefund: '全额退款',
        fastProcess: '快速处理'
      },
      overview: {
        title: '退款政策概述',
        description: '我们理解有时候服务可能不符合您的期望。为了确保您的权益，我们制定了以下退款政策：',
        features: [
          {
            title: '7天退款保证',
            description: '所有付费服务在购买后7天内可申请全额退款'
          },
          {
            title: '快速处理',
            description: '退款将在3-5个工作日内处理完成'
          },
          {
            title: '技术保障',
            description: '专业技术团队确保退款流程顺畅'
          },
          {
            title: '无理由退款',
            description: '无需提供任何理由，即可申请退款'
          }
        ]
      },
      process: {
        title: '退款流程',
        description: '我们的退款流程简单快捷，确保您能够快速获得退款：',
        steps: [
          {
            title: '提交申请',
            description: '通过客服渠道提交退款申请'
          },
          {
            title: '审核确认',
            description: '我们将在24小时内审核您的申请'
          },
          {
            title: '处理退款',
            description: '审核通过后，退款将在3-5个工作日内到账'
          },
          {
            title: '完成退款',
            description: '您将收到退款确认邮件'
          }
        ]
      },
      conditions: {
        title: '退款条件',
        description: '为了确保公平性，我们制定了以下退款条件：',
        eligible: [
          '购买后7天内的服务',
          '未使用的积分或套餐',
          '技术问题导致的服务不可用',
          '服务质量不符合承诺'
        ],
        notEligible: [
          '已使用的积分或套餐',
          '超过7天的购买',
          '恶意使用或滥用服务',
          '违反服务条款的行为'
        ]
      },
      contactInfo: {
        title: '联系我们',
        description: '如果您有任何问题或建议，请通过以下方式联系我们：',
        methods: [
          {
            title: '客服邮箱',
            description: '发送邮件至我们的客服邮箱',
            action: '发送邮件'
          },
          {
            title: '客服电话',
            description: '拨打我们的客服热线',
            action: '拨打电话'
          },
          {
            title: '在线客服',
            description: '通过在线聊天获得即时帮助',
            action: '开始聊天'
          }
        ]
      },
      notEligibleTitle: '不符合退款条件的情况',
      sidebar: {
        quickInfo: {
          title: '退款要点',
          items: [
            { text: '7天内可退款' },
            { text: '全额退款' },
            { text: '快速处理' }
          ]
        },
        faq: {
          title: '常见问题',
          questions: [
            {
              question: '退款需要多长时间？',
              answer: '通常在3-5个工作日内处理完成并到账。'
            },
            {
              question: '可以部分退款吗？',
              answer: '我们提供全额退款，不支持部分退款。'
            },
            {
              question: '退款到原支付账户吗？',
              answer: '是的，退款将原路返回到您的支付账户。'
            }
          ]
        },
        cta: {
          title: '需要帮助？',
          description: '我们的客服团队随时为您提供帮助'
        }
      }
    },
      service: {
        title: '服务政策',
        content: '我们致力于提供优质服务，确保用户能够获得最佳的图像处理体验。我们的服务团队随时为您提供专业的技术支持和解决方案。',
        contact: '联系客服',
        backToHome: '返回首页',
        freeTrial: '免费试用',
        badge: '服务保障',
        description: '我们致力于为您提供专业、稳定、安全的AI图像处理服务，确保您的每一次使用都能获得最佳体验。',
        heroStats: {
          availability: '99.9% 可用性',
          support: '24/7 支持',
          security: '数据安全'
        },
        overview: {
          title: '服务概述',
          description: '背景移除提供基于AI技术的图像处理服务，包括背景移除、物体分割、图像增强等功能。我们承诺为您提供高质量、高效率的服务体验。',
          features: [
            {
              title: 'AI驱动',
              description: '采用最新的AI算法，提供精准的图像处理结果'
            },
            {
              title: '快速处理',
              description: '平均处理时间不超过30秒，支持批量处理'
            },
            {
              title: '安全可靠',
              description: '采用银行级加密技术，保护您的数据安全'
            },
            {
              title: '专业支持',
              description: '7x24小时技术支持，随时解决您的问题'
            }
          ]
        },
        terms: {
          title: '服务条款',
          scope: {
            title: '服务范围',
            items: [
              'AI背景移除服务',
              '物体分割与提取',
              '图像质量增强',
              '批量处理功能'
            ]
          },
          guidelines: {
            title: '使用指南',
            items: [
              '支持常见图片格式',
              '单次上传限制50MB',
              '批量处理最多10张',
              '结果7天内有效'
            ]
          }
        },
        sla: {
          title: '服务级别协议 (SLA)',
          availability: {
            title: '服务可用性',
            value: '99.9%',
            description: '我们承诺99.9%的服务可用性，确保您随时可以使用我们的服务'
          },
          responseTime: {
            title: '响应时间',
            value: '30s',
            description: '平均处理时间不超过30秒，大部分图片可在10秒内完成处理'
          },
          support: {
            title: '技术支持',
            value: '24h',
            description: '7x24小时技术支持，问题响应时间不超过24小时'
          }
        },
        security: {
          title: '数据安全',
          encryption: {
            title: '数据加密',
            subtitle: 'AES-256加密',
            description: '所有数据传输和存储都采用银行级加密技术'
          },
          privacy: {
            title: '隐私保护',
            subtitle: '严格保密',
            description: '您的图片数据不会被用于其他用途，处理完成后自动删除'
          }
        },
        sidebar: {
          features: {
            title: '服务特色',
            items: [
              'AI智能处理',
              '快速响应',
              '安全可靠',
              '专业支持'
            ]
          },
          support: {
            title: '技术支持',
            email: 'q9425916@gmail.com',
            phone: '+023 6287 2229',
            responseTime: '我们通常在24小时内回复'
          },
          cta: {
            title: '开始使用',
            description: '立即体验专业的AI图像处理服务',
            button: '免费试用'
          }
        }
      },
      privacy: {
        title: '隐私政策',
        content: '我们重视您的隐私保护，承诺保护您的个人信息安全。我们不会向第三方出售、交易或转让您的个人信息，除非获得您的明确同意。',
        contact: '发送邮件',
        backToHome: '返回首页',
        email: '邮箱：q9425916@gmail.com',
        phone: '电话：+023 6287 2229',
        badge: '隐私保护',
        description: '我们高度重视您的隐私保护，承诺以最严格的标准保护您的个人信息和数据安全。',
        heroStats: {
          dataEncryption: '数据加密',
          privacyProtection: '隐私保护',
          securityReliable: '安全可靠'
        },
        overview: {
          title: '政策概述',
          description: '本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。我们承诺以透明、负责任的方式处理您的数据。',
          features: [
            {
              title: '数据保护',
              description: '采用银行级加密技术保护您的数据安全'
            },
            {
              title: '透明处理',
              description: '明确告知您我们如何使用您的数据'
            },
            {
              title: '访问控制',
              description: '严格控制数据访问权限，防止未授权访问'
            },
            {
              title: '定期清理',
              description: '定期清理过期数据，减少数据泄露风险'
            }
          ]
        },
        informationCollection: {
          title: '信息收集',
          weCollect: {
            title: '我们收集的信息',
            items: [
              '您上传的图片文件',
              '设备信息（浏览器类型、IP地址）',
              '使用记录（访问时间、功能使用）',
              '联系信息（如您主动提供）'
            ]
          },
          weDontCollect: {
            title: '我们不收集的信息',
            items: [
              '个人身份信息（姓名、身份证号）',
              '财务信息（银行卡、支付密码）',
              '敏感个人信息',
              '位置信息'
            ]
          }
        },
        informationUsage: {
          title: '信息使用',
          purposes: [
            {
              number: '1',
              title: '提供服务',
              description: '处理您上传的图片，提供AI图像处理服务'
            },
            {
              number: '2',
              title: '改进服务',
              description: '分析使用数据，持续改进服务质量和用户体验'
            },
            {
              number: '3',
              title: '安全保障',
              description: '检测和防止欺诈行为，保护服务安全'
            }
          ]
        },
        dataProtection: {
          title: '数据保护',
          methods: [
            {
              title: '加密传输',
              subtitle: 'SSL/TLS加密',
              description: '所有数据传输都采用SSL/TLS加密技术'
            },
            {
              title: '安全存储',
              subtitle: 'AES-256加密',
              description: '数据存储采用AES-256银行级加密'
            },
            {
              title: '访问控制',
              subtitle: '严格权限管理',
              description: '严格控制数据访问权限，定期审计'
            },
            {
              title: '定期清理',
              subtitle: '自动删除',
              description: '处理完成后自动删除原始图片数据'
            }
          ]
        },
        sidebar: {
          privacyHighlights: {
            title: '隐私要点',
            items: [
              { title: '数据加密存储' },
              { title: '透明处理' },
              { title: '安全传输' }
            ]
          },
          faq: {
            title: '常见问题',
            questions: [
              {
                question: '我的图片会被保存多久？',
                answer: '处理完成后24小时内自动删除原始图片。'
              },
              {
                question: '你们会分享我的数据吗？',
                answer: '不会，我们不会与第三方分享您的个人信息。'
              },
              {
                question: '如何删除我的数据？',
                answer: '请联系我们，我们会在30天内删除您的所有数据。'
              }
            ]
          },
          contact: {
            title: '联系我们',
            description: '如有隐私相关问题，请随时联系我们',
            sendEmail: '发送邮件'
          }
        }
      },
      terms: {
        title: '用户协议',
        content: '请仔细阅读本协议，使用我们的服务即表示您同意遵守以下条款和条件。',
        contact: '发送邮件',
        backToHome: '返回首页',
        email: '邮箱：q9425916@gmail.com',
        phone: '电话：+023 6287 2229',
        badge: '用户协议',
        heroStats: {
          legalProtection: '法律保障',
          rightsProtection: '权益保护',
          userFriendly: '用户友好'
        },
        overview: {
          title: '协议概述',
          description: '本用户协议（以下简称"协议"）是您与背景移除平台之间的法律协议，规定了您使用我们服务时的权利和义务。',
          features: [
            {
              title: '法律约束',
              description: '本协议具有法律约束力，请仔细阅读'
            },
            {
              title: '权益保护',
              description: '明确双方权利和义务，保护用户权益'
            },
            {
              title: '用户友好',
              description: '条款清晰易懂，便于用户理解'
            },
            {
              title: '及时更新',
              description: '根据法律法规变化及时更新条款'
            }
          ]
        },
        serviceDescription: {
          title: '服务描述',
          content: {
            title: '服务内容',
            services: [
              'AI背景移除服务',
              '物体分割与提取',
              '图像质量增强',
              '批量处理功能'
            ]
          },
          scope: {
            title: '服务范围',
            items: [
              '全球用户服务',
              '24/7在线服务',
              '多平台支持',
              '专业技术支持'
            ]
          }
        },
        userRights: {
          title: '用户权利与义务',
          rights: {
            title: '用户权利',
            items: [
              '享受高质量的服务',
              '获得技术支持',
              '保护个人隐私'
            ]
          },
          obligations: {
            title: '用户义务',
            items: [
              '遵守法律法规',
              '不得恶意使用',
              '保护账户安全'
            ]
          }
        },
        prohibitedActivities: {
          title: '禁止行为',
          activities: [
            {
              title: '违法内容',
              subtitle: '严格禁止',
              description: '上传包含色情、暴力、恐怖主义等违法内容的图片'
            },
            {
              title: '系统攻击',
              subtitle: '恶意行为',
              description: '恶意攻击系统、破坏服务稳定性'
            },
            {
              title: '数据滥用',
              subtitle: '违规使用',
              description: '批量上传、自动化操作影响服务性能'
            },
            {
              title: '商业滥用',
              subtitle: '未授权使用',
              description: '未购买商业许可的商用行为'
            }
          ]
        },
        sidebar: {
          keyPoints: {
            title: '关键要点',
            items: [
              { text: '法律约束' },
              { text: '权益保护' },
              { text: '用户友好' }
            ]
          },
          faq: {
            title: '常见问题',
            questions: [
              {
                question: '协议何时生效？',
                answer: '使用服务即表示同意本协议，立即生效。'
              },
              {
                question: '可以修改协议吗？',
                answer: '我们会提前通知用户协议变更，继续使用表示同意。'
              },
              {
                question: '违反协议后果？',
                answer: '可能面临服务暂停、账户封禁等处罚措施。'
              }
            ]
          },
          contact: {
            title: '法律咨询',
            description: '如有法律相关问题，请随时联系我们',
            sendEmail: '发送邮件'
          }
        }
      }
    },
    footer: {
      description: '专业的AI图像处理平台，为您提供精准的背景移除、物体分割和图像增强服务。',
      quickLinks: '快速链接',
      support: '支持',
      aboutUs: '关于我们',
      contactUs: '联系我们',
      refund: '退款政策',
      service: '服务政策',
      helpCenter: '帮助中心',
      faq: '常见问题',
      terms: '用户协议',
      privacy: '隐私政策',
      cookie: 'Cookie政策',
      copyright: '© 2024 背景移除',
      allRightsReserved: '保留所有权利'
    }
  },
  en: {
    metadata: {
      title: 'BgRemoval - Professional AI Image Processing Platform',
      description: 'Professional AI image processing platform, providing you with precise background removal, object segmentation, and image enhancement services.',
      pageTitle: 'BgRemoval - Professional AI Image Processing Platform'
    },
    logo: {
      alt: 'BgRemoval',
      text: 'BgRemoval'
    },
    common: {
      startUsing: 'Start Using',
      viewPricing: 'View Pricing',
      login: 'Login',
      about: 'About Us',
      home: 'Home',
      pricing: 'Pricing',
      backToHome: 'Back to Home',
      contactUs: 'Contact Us',
      sendEmail: 'Send Email',
      freeTrial: 'Free Trial',
      noRegistration: 'No Registration',
      instantProcessing: 'Instant Processing',
      professionalQuality: 'Professional Quality',
      startNow: 'Start Now',
      readyToExperience: 'Ready to experience the charm of AI?',
      joinThousands: 'Join tens of thousands of users\' choice',
      noCreditCard: 'No credit card required, no software download required, start your AI image processing journey immediately.',
      noDownload: 'No software download required',
      startJourney: 'Start your AI image processing journey immediately'
    },
    navbar: {
      home: 'Home',
      pricing: 'Pricing',
      aboutUs: 'About Us',
      login: 'Login',
      startUsing: 'Start Using'
    },
    home: {
      hero: {
        title: 'Ready to experience the charm of AI?',
        subtitle: 'Join tens of thousands of users\' choice',
        description: 'No credit card required, no software download required, start your AI image processing journey immediately.',
        ctaPrimary: 'Start Using for Free',
        ctaSecondary: 'View Cases',
        badge: 'AI-Powered Image Processing Platform',
        mainTitle: 'Background Removal',
        subTitle: 'Precise Cutout, Intelligent Processing',
        features: {
          title: 'Features',
          trial: 'Free Trial Available',
          formats: 'Multiple Image Formats',
          algorithm: 'High-Precision AI Algorithm',
          batch: 'Batch Processing'
        }
      },
      stats: {
        title: 'Data Speaks, Strength Testifies',
        subtitle: 'Trusted Choice of Global Users',
        cards: [
          {
            title: 'Active Users',
            value: '50K+',
            description: 'Professional users from around the world',
            trend: 'Growth',
            trendValue: '+15%'
          },
          {
            title: 'Industry Leader',
            value: '1M+',
            subtitle: 'Image Processing Volume',
            description: 'Processing over 1 million images per month'
          },
          {
            title: 'Accuracy Rate',
            value: '99.9%',
            description: 'Accuracy rate of AI algorithm'
          },
          {
            title: 'User Satisfaction',
            value: '99.9%',
            description: 'Customer satisfaction rating',
            trend: 'Growth',
            trendValue: '+12%'
          }
        ]
      },
      steps: {
        title: 'Three Steps to Complete, Simple and Efficient',
        subtitle: 'No Professional Skills Required, Everyone Can Use It',
        description: 'Simplified workflow, making image processing easier than ever before',
        items: [
          {
            number: '1',
            title: 'Start',
            description: 'Upload Image',
            features: ['Support Multiple Formats', 'Drag and Drop', 'Batch Processing']
          },
          {
            number: '2',
            title: 'Process',
            description: 'AI Smart Processing',
            features: ['Smart Recognition', 'Auto Optimization', 'Real-time Preview']
          },
          {
            number: '3',
            title: 'Complete',
            description: 'Download Results',
            features: ['HD Output', 'Multiple Formats', 'One-click Download']
          },
          {
            number: '4',
            title: 'Complete',
            description: 'Finish Processing',
            features: ['Quality Assurance', 'Fast Processing', 'Satisfactory Results']
          }
        ]
      },
      features: {
        title: 'Powerful Features, Easy to Use',
        subtitle: 'One-Stop Image Processing Solution',
        description: 'From background removal to image enhancement, we provide comprehensive AI image processing services',
        intelligentCutout: {
          title: 'Intelligent Cutout',
          description: 'Using deep learning algorithms to accurately identify and separate foreground from background, supporting complex scenes and detail processing.',
          features: ['Millisecond-level processing speed', '99%+ accuracy rate', 'Supports complex backgrounds']
        },
        imageEnhancement: {
          title: 'Image Enhancement',
          description: 'Automatically optimize image quality, improve clarity, contrast and color saturation, making your images more outstanding.',
          features: ['Automatic color correction', 'Noise reduction processing', 'Detail enhancement']
        },
        batchProcessing: {
          title: 'Batch Processing',
          description: 'Support processing multiple images simultaneously, greatly improving work efficiency, suitable for e-commerce, design and other batch needs.',
          features: ['Supports 100+ images processed simultaneously', 'Maintain consistent quality', 'Automatic naming']
        },
        step1: {
          title: 'Upload Image',
          description: 'Support multiple formats, drag and drop upload is more convenient',
          features: ['Support JPG, PNG, WebP', 'Drag and drop upload', 'Batch processing', 'Cloud storage']
        },
        step2: {
          title: 'AI Smart Processing',
          description: 'Advanced AI algorithms, automatic recognition and processing',
          features: ['Smart recognition', 'Auto optimization', 'Real-time preview', 'One-click processing']
        },
        step3: {
          title: 'Download Results',
          description: 'High-quality output, multiple format options',
          features: ['HD output', 'Multiple formats', 'Batch download', 'Cloud sync']
        },
        step4: {
          title: 'Enjoy Results',
          description: 'Share your amazing results with friends and colleagues',
          features: ['One-click sharing', 'Social media', 'Professional use'],
          button: 'Complete'
        }
      },
      caseStudy: {
        title: 'Case Studies',
        subtitle: 'Witness the unlimited possibilities of AI',
        description: 'Explore real cases of our AI image processing technology and experience professional-level processing effects',
        viewAll: 'View All Cases'
      },
      testimonials: {
        title: 'What Our Users Say',
        subtitle: 'Join thousands of satisfied users who trust CutoutMaster to meet their image editing needs',
        rating: 'Based on 10,000+ reviews',
        reviews: [
          {
            name: 'Xiaoya Li',
            username: '@xiaoya',
            location: 'CN China',
            role: 'E-commerce Designer',
            body: 'CutoutMaster\'s background removal is amazing! It can perfectly remove backgrounds in seconds, even more accurately than professional tools.'
          },
          {
            name: 'David Chen',
            username: '@davidc',
            location: 'US United States',
            role: 'Professional Photographer',
            body: 'As a photographer, I process hundreds of photos daily. CutoutMaster\'s batch processing saves me 80% of my time!'
          },
          {
            name: 'Misaki Tanaka',
            username: '@misaki',
            location: 'JP Japan',
            role: 'Graphic Designer',
            body: 'Finally found the perfect cutout tool! Even hair strands are processed so finely, this is absolutely amazing.'
          },
          {
            name: 'Max Weber',
            username: '@maxw',
            location: 'DE Germany',
            role: 'Product Manager',
            body: 'AI technology has truly changed my workflow. Creating product images is now so simple and efficient.'
          },
          {
            name: 'Sophie Martin',
            username: '@sophie',
            location: 'FR France',
            role: 'Creative Director',
            body: 'Impressed by its ability to handle complex backgrounds, even transparent glass and reflective materials are processed perfectly.'
          },
          {
            name: 'Ryan Thompson',
            username: '@ryant',
            location: 'CA Canada',
            role: 'Social Media Manager',
            body: 'Mobile experience is great too, I can process images anytime, anywhere. A true productivity tool!'
          },
          {
            name: 'Isabella Brown',
            username: '@bella',
            location: 'AU Australia',
            role: 'E-commerce Manager',
            body: 'Batch processing is so useful! Processing 100 images at once while maintaining consistent quality.'
          },
          {
            name: 'Arjun Patel',
            username: '@arjun',
            location: 'IN India',
            role: 'Digital Marketing Expert',
            body: 'From trial to paid user, CutoutMaster keeps improving. Looking forward to more AI features!'
          },
          {
            name: 'Emma Wilson',
            username: '@emma',
            location: 'GB United Kingdom',
            role: 'Freelancer',
            body: 'The free version is already powerful, and the paid features are even more surprising. Great value for money!'
          },
          {
            name: 'Jihoon Park',
            username: '@jihoon',
            location: 'KR South Korea',
            role: 'Content Creator',
            body: 'Clean and easy-to-use interface, beginners can get started quickly. Customer support is very responsive.'
          },
          {
            name: 'Ana Silva',
            username: '@anas',
            location: 'BR Brazil',
            role: 'Blogger',
            body: 'The enhancement feature elevated my image quality to the next level, more vibrant and clearer details.'
          },
          {
            name: 'Carlos Rodriguez',
            username: '@carlos',
            location: 'ES Spain',
            role: 'Enterprise User',
            body: 'Great security measures, images are automatically deleted after processing. No privacy concerns at all.'
          }
        ]
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Quickly understand our services',
        description: 'If you have other questions, please feel free to contact our customer team',
        questions: [
          {
            question: 'What image formats does CutoutMaster support?',
            answer: 'We support mainstream image formats such as JPG, PNG, WebP, BMP, with a maximum file size of 10MB.'
          },
          {
            question: 'How long does it take to process one image?',
            answer: 'Usually, processing one image only takes 2-5 seconds, depending on the image size and complexity.'
          },
          {
            question: 'What are the limitations for free users?',
            answer: 'Free users can process 10 images per day, upgrade to a paid plan to enjoy unlimited processing.'
          },
          {
            question: 'How to ensure image privacy and security?',
            answer: 'We use end-to-end encryption technology, and your images will be automatically deleted after processing, never saved or shared.'
          },
          {
            question: 'Can I process images in batches?',
            answer: 'Yes, paid users can upload and process multiple images simultaneously, greatly improving work efficiency.'
          },
          {
            question: 'How to register an account?',
            answer: 'Click the register button in the upper right corner, use email or third-party accounts to register quickly.'
          }
        ]
      }
    },
    pricing: {
      title: 'Choose Your Credit Package',
      subtitle: 'Choose the perfect plan for your image processing needs',
      plans: {
        basic: {
          name: 'Basic',
          description: 'Perfect for starting with AI image generation',
          originalPrice: '$10.00',
          currentPrice: '$9.99',
          credits: '100 Credits',
          features: [
            '100 AI Image Credits',
            'Basic Support',
            'Standard Quality',
            'Personal Use License'
          ],
          button: 'Choose Package'
        },
        standard: {
          name: 'Standard',
          description: 'Suitable for regular users who need more credits',
          originalPrice: '$55.00',
          currentPrice: '$29.99',
          savings: 'Save 55%',
          credits: '500 Credits',
          features: [
            '500 AI Image Credits',
            'Priority Support',
            'High Quality',
            'Commercial Use License'
          ],
          button: 'Choose Package',
          popular: 'Most Popular'
        },
        premium: {
          name: 'Premium',
          description: 'Most popular choice for advanced users',
          originalPrice: '$120.00',
          currentPrice: '$49.99',
          savings: 'Save 58%',
          credits: '1000 Credits',
          features: [
            '1000 AI Image Credits',
            'Advanced Support',
            'Premium Quality',
            'Commercial Use License',
            'Advanced Features'
          ],
          button: 'Choose Package'
        }
      },
      howToUse: {
        title: 'How to Use Credits',
        creditRate: '1 Credit = Process 1 Image',
        steps: [
          'Upload image and select processing type',
          'Credits are automatically deducted after processing',
          'View credit balance in dashboard'
        ]
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          {
            question: 'How are credits used?',
            answer: 'Each time you use AI features to process images, corresponding credits are consumed. Different features consume different amounts of credits, image coloring typically consumes 4-6 credits, image super-resolution consumes 3-5 credits.'
          },
          {
            question: 'Do credits have an expiration date?',
            answer: 'Yes, credits are valid for 12 months from the date of purchase. We recommend choosing a suitable package based on your actual usage frequency.'
          },
          {
            question: 'What payment methods are supported?',
            answer: 'We support various payment methods including credit cards and debit cards. All payments are securely processed through Stripe to ensure your payment information security.'
          },
          {
            question: 'How to get free credits?',
            answer: 'We provide a daily login reward system where users automatically receive 5 credits each day they log in. You will receive reward notifications in the message center after logging in. This is our way of rewarding users and encouraging continued use of our services. You can also manually claim rewards by clicking the gift icon in the top right corner.'
          }
        ]
      }
    },
    cases: {
      title: 'Effect Showcase',
      subtitle: 'View Real Processing Effects of Our AI Technology',
      description: 'Explore real cases of our AI image processing technology and experience professional-level processing effects. Each case demonstrates the precision and reliability of our technology.',
      stats: {
        processedImages: 'Images Processed',
        avgProcessingTime: 'Average Processing Time',
        qualityImprovement: 'Average Quality Improvement'
      },
      cta: {
        title: 'Ready to Experience AI Image Processing?',
        description: 'Start now and make your pictures look new',
        startUsing: 'Free Trial',
        viewPricing: 'View Pricing'
      },
      cases: [
        {
          id: 1,
          title: 'Portrait Background Removal',
          description: 'Perfectly handles complex portraits, including hair details',
          category: 'Portrait Processing',
          rating: 4.9,
          views: '2.3k'
        },
        {
          id: 2,
          title: 'Animal Image Processing',
          description: 'Accurately identifies animal contours, maintaining natural effects',
          category: 'Animal Processing',
          rating: 4.8,
          views: '1.8k'
        },
        {
          id: 3,
          title: 'Product Display Optimization',
          description: 'Professional-grade product image background removal',
          category: 'Product Processing',
          rating: 4.9,
          views: '3.1k'
        },
        {
          id: 4,
          title: 'Car Background Removal',
          description: 'Accurate extraction of vehicles from complex backgrounds',
          category: 'Vehicle Processing',
          rating: 4.7,
          views: '1.5k'
        },
        {
          id: 5,
          title: 'Pet Photo Processing',
          description: 'Professional-grade background removal for pets',
          category: 'Pet Processing',
          rating: 4.8,
          views: '2.1k'
        },
        {
          id: 6,
          title: 'Architectural Photography Optimization',
          description: 'Professional background removal for architectural photography',
          category: 'Architecture Processing',
          rating: 4.6,
          views: '1.2k'
        }
      ]
    },
    about: {
      title: 'About Us',
      subtitle: 'Learn about our mission and vision',
      description: 'We are committed to providing professional, efficient, and user-friendly image processing solutions through advanced AI technology.',
      badge: 'About Background Removal',
      heroStats: {
        users: '50K+ Users',
        countries: '100+ Countries',
        satisfaction: '99.9% Satisfaction'
      },
      mission: {
        title: 'Our Mission',
        description: 'Through advanced AI technology, we provide professional, efficient, and user-friendly image processing solutions, enabling everyone to easily achieve professional image editing effects.',
        features: ['Lower the technical barrier of image processing', 'Provide efficient and precise AI solutions', 'Continuous innovation, leading industry development']
      },
      vision: {
        title: 'Our Vision',
        description: 'To become the world\'s leading AI image processing platform, promoting the popularization and application of image processing technology, making creativity unlimited.',
        coreValues: {
          title: 'Core Values',
          userFirst: 'User First',
          innovation: 'Technology Innovation',
          security: 'Safe and Reliable',
          globalService: 'Global Service'
        }
      },
      story: {
        title: 'Our Story',
        subtitle: 'Journey from idea to reality',
        timeline: [
          {
            year: '2022',
            title: 'Foundation',
            description: 'Founded by a group of engineers and designers passionate about AI technology, committed to solving pain points in image processing.',
            items: ['Team Building', 'Technology R&D', 'Product Planning']
          },
          {
            year: '2023',
            title: 'Technology Breakthrough',
            description: 'Successfully developed high-precision AI cutout algorithms with accuracy over 99%, gaining widespread user recognition.',
            items: ['Algorithm Optimization', 'User Growth', 'Market Recognition']
          },
          {
            year: '2024',
            title: 'Global Expansion',
            description: 'Serving over 500,000 users, processing over 1 million images, becoming the industry-leading AI image processing platform.',
            items: ['Global Layout', 'Technology Leadership', 'Industry Benchmark']
          }
        ]
      },
      team: {
        title: 'Our Team',
        subtitle: 'Professional, innovative, and passionate',
        departments: [
          {
            title: 'Technology Team',
            subtitle: 'AI Algorithm Experts',
            description: 'AI experts from top universities and tech companies, focusing on deep learning algorithm development'
          },
          {
            title: 'Product Team',
            subtitle: 'User Experience Experts',
            description: 'Senior product managers and designers, committed to creating the best user experience'
          },
          {
            title: 'Operations Team',
            subtitle: 'Customer Service Experts',
            description: 'Professional customer service team, providing 24/7 support to users'
          },
          {
            title: 'Marketing Team',
            subtitle: 'Marketing Strategy Experts',
            description: 'Experienced marketing team, driving global brand development'
          }
        ]
      },
      stats: {
        title: 'Data Witnesses Growth',
        subtitle: 'Let strength speak',
        cards: [
          {
            value: '50K+',
            label: 'Active Users',
            description: 'From 100+ countries worldwide',
            trend: '+15%'
          },
          {
            value: '1M+',
            label: 'Images Processed',
            description: 'Monthly processing volume'
          },
          {
            value: '99.9%',
            label: 'Accuracy Rate',
            description: 'AI algorithm precision'
          },
          {
            value: '24/7',
            label: 'Service Time',
            description: 'Round-the-clock technical support'
          }
        ]
      },
      cta: {
        title: 'Join Our Journey',
        description: 'Let\'s change the world together with AI technology, making creativity unlimited',
        startUsing: 'Start Using',
        contactUs: 'Contact Us'
      },
      backToHome: 'Back to Home'
    },
    imageComparison: {
      dragToCompare: 'Drag to compare/Click to switch',
      originalImage: 'Original',
      resultImage: 'Result'
    },
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      googleLogin: 'Sign in with Google',
      terms: 'By signing in, you agree to our',
      privacy: 'Privacy Policy'
    },
    upload: {
      title: 'Upload an image to remove the background',
      subtitle: 'Upload your image',
      backToHome: 'Back to Home',
      uploadArea: {
        title: 'Upload Image',
        subtitle: 'Or drag and drop a file',
        dragDrop: 'Or drag and drop a file',
        or: 'Or',
        paste: 'Paste image or',
        url: 'URL',
        examples: 'No image? Try these example images:',
        exampleTitle: 'Example',
        exampleLabel: 'Example',
        clickToUse: 'Click to use',
        exampleImages: ['Portrait Photo', 'Animal Photo', 'Object Photo', 'Architecture Photo']
      },
      editor: {
        createAIScene: 'Create AI Scene',
        download: 'Download',
        background: 'Background',
        backgroundNew: 'New',
        eraser: 'Erase/Restore',
        effects: 'Effects',
        createDesign: 'Create Design',
        tools: {
          zoom: 'Zoom',
          rotate: 'Rotate',
          reset: 'Reset',
          fullscreen: 'Fullscreen',
          eraser: 'Eraser',
          palette: 'Palette'
        },
        rating: 'Rate this result',
        thumbnail: 'Thumbnail',
        originalImage: 'Original Image',
        processedImage: 'Processed',
        processing: 'Processing...',
        processingComplete: 'Processing Complete',
        processingFailed: 'Processing Failed',
        showEffect: 'Showing Effect...',
        uploadAndProcess: 'Automatically start processing after uploading image',
        removeBackground: 'Remove Background',
        reprocess: 'Reprocess',
        downloadResult: 'Download Result'
      },
      footer: {
        termsAgreement: 'By uploading an image or URL, you agree to our',
        termsLink: 'Terms of Service',
        privacyInfo: '. To learn more about how Background Removal handles your personal data, please see our',
        privacyLink: 'Privacy Policy'
      }
    },
    help: {
      title: 'Help Center',
      subtitle: 'Find the help you need',
      search: 'Search Help',
      backToHome: 'Back to Home',
      badge: 'Help Center',
      description: 'Find all the help information you need and quickly solve problems during use',
      searchPlaceholder: 'Search help content...',
      views: 'views',
      categories: {
        title: 'Help Categories',
        subtitle: 'Choose the type of help you need',
        gettingStarted: {
          title: 'Getting Started',
          description: 'Learn how to quickly get started with our services',
          items: [
            'How to register an account',
            'Upload your first image',
            'Download processing results',
            'Basic operation guide'
          ]
        },
        features: {
          title: 'Feature Usage',
          description: 'Master the usage methods of various features',
          items: [
            'Background removal function',
            'Batch process images',
            'Image format conversion',
            'Advanced editing tools'
          ]
        },
        security: {
          title: 'Account Security',
          description: 'Protect your account and data security',
          items: [
            'Password security settings',
            'Privacy protection instructions',
            'Data deletion policy',
            'Security best practices'
          ]
        },
        billing: {
          title: 'Paid Services',
          description: 'Learn about paid plans and subscription services',
          items: [
            'Package price comparison',
            'Subscription management',
            'Invoices and billing',
            'Refund policy'
          ]
        }
      },
      popularArticles: {
        title: 'Popular Articles',
        subtitle: 'Help content most viewed by users',
        articles: [
          {
            title: 'How to batch process multiple images?',
            category: 'Feature Usage',
            views: '2.3k',
            rating: 4.8
          },
          {
            title: 'What image formats are supported?',
            category: 'Getting Started',
            views: '1.8k',
            rating: 4.9
          },
          {
            title: 'How to ensure image privacy and security?',
            category: 'Account Security',
            views: '1.5k',
            rating: 4.7
          },
          {
            title: 'What\'s the difference between free and paid versions?',
            category: 'Paid Services',
            views: '1.2k',
            rating: 4.6
          }
        ]
      },
      contactSupport: {
        title: 'Contact Our Customer Service Team',
        subtitle: 'Need more help?',
        description: 'If you can\'t find the answer in the help center, our professional customer service team is always ready to provide support',
        methods: [
          {
            title: 'Email Support',
            description: 'Reply within 24 hours',
            button: 'Send Email'
          },
          {
            title: 'Phone Support',
            description: 'Weekdays 9:00-18:00',
            button: 'Call Now'
          },
          {
            title: 'Online Customer Service',
            description: '7x24 hours online',
            button: 'Start Chat'
          }
        ]
      }
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We are here to serve you at any time',
      description: 'If you have any questions or suggestions, please contact us through the following methods:',
      methods: [
        {
          title: 'Customer Service Email',
          contact: 'q9425916@gmail.com',
          description: 'Send email to our customer service email'
        },
        {
          title: 'Customer Service Phone',
          contact: '+023 6287 2229',
          description: 'Call our customer service hotline'
        },
        {
          title: 'Online Chat',
          contact: 'https://example.com/chat',
          description: 'Get instant help through online chat'
        }
      ]
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Manage your account and credits',
      welcome: 'Welcome back',
      loading: 'Loading...',
      credits: 'Credits',
      creditOverview: {
        title: 'Credit Overview',
        currentCredits: 'Current Credits',
        totalEarned: 'Total Earned',
        totalConsumed: 'Total Consumed',
        buyCredits: 'Buy Credits'
      },
      recentTransactions: {
        title: 'Recent Transactions',
        noTransactions: 'No transactions yet',
        refresh: 'Refresh',
        tableHeaders: {
          type: 'Type',
          description: 'Description',
          amount: 'Amount',
          date: 'Date',
          status: 'Status'
        },
        type: {
          recharge: 'Recharge',
          consumption: 'Consumption',
          rollback: 'Rollback',
          refund: 'Refund',
          unknown: 'Unknown',
          other: 'Other'
        },
        status: {
          success: 'Success',
          failed: 'Failed',
          pending: 'Pending'
        }
      },
      generations: {
        title: 'Generation Records',
        noGenerations: 'No generation records',
        view: 'View',
        image: 'Image',
        generatedResult: 'Generated Result',
        tableHeaders: {
          type: 'Type',
          status: 'Status',
          result: 'Result',
          created: 'Created',
          action: 'Action'
        }
      },
      creditPackages: {
        title: 'Credit Packages',
        description: 'Choose the credit package that suits you',
        recommended: 'Recommended',
        buyCredits: 'Buy Credits',
        basic: {
          name: 'Basic',
          price: '$9.99',
          credits: '100 Credits',
          description: 'Perfect for light users'
        },
        standard: {
          name: 'Standard',
          price: '$29.99',
          credits: '500 Credits',
          description: 'Perfect for regular users',
          recommended: 'Recommended'
        },
        premium: {
          name: 'Premium',
          price: '$49.99',
          credits: '1000 Credits',
          description: 'Perfect for heavy users'
        }
      },
      paymentModal: {
        title: 'Payment Confirmation',
        processing: 'Processing...',
        success: 'Payment Successful',
        error: 'Payment Failed',
        unauthorized: 'Please login first before making payment',
        paymentSuccess: 'Payment successful! You have received',
        securePayment: 'Secure Payment',
        purchase: 'Purchase',
        getCredits: 'Get',
        price: 'Price',
        creditCardInfo: 'Credit Card Information',
        cancel: 'Cancel',
        pay: 'Pay',
        loginFirst: 'Please login first before making payment',
        paymentInitFailed: 'Payment initialization failed',
        createPaymentFailed: 'Failed to create payment',
        paymentFormNotLoaded: 'Payment form not loaded',
        paymentFailed: 'Payment failed',
        paymentProcessFailed: 'Payment processing failed'
      }
    },
    policies: {
          refund: {
      title: 'Refund Policy',
      content: 'We provide a 30-day unconditional refund guarantee. If you are not satisfied with our service, we promise to provide a full refund within 30 days of purchase. Refunds will be processed within 3-5 business days.',
      contact: 'Contact Support',
      backToHome: 'Back to Home',
      email: 'Email: q9425916@gmail.com',
      phone: 'Phone: +023 6287 2229',
      badge: 'Refund Guarantee',
      heroStats: {
        days: '7-Day Refund',
        fullRefund: 'Full Refund',
        fastProcess: 'Fast Processing'
      },
      overview: {
        title: 'Refund Policy Overview',
        description: 'We understand that sometimes services may not meet your expectations. To ensure your rights, we have established the following refund policy:',
        features: [
          {
            title: '7-Day Refund Guarantee',
            description: 'All paid services can apply for a full refund within 7 days of purchase'
          },
          {
            title: 'Fast Processing',
            description: 'Refunds will be processed within 3-5 business days'
          },
          {
            title: 'Technical Support',
            description: 'Professional technical team ensures smooth refund process'
          },
          {
            title: 'No-Questions-Asked Refund',
            description: 'No reason required to apply for a refund'
          }
        ]
      },
      process: {
        title: 'Refund Process',
        description: 'Our refund process is simple and fast, ensuring you can get your refund quickly:',
        steps: [
          {
            title: 'Submit Application',
            description: 'Submit refund application through customer service channels'
          },
          {
            title: 'Review Confirmation',
            description: 'We will review your application within 24 hours'
          },
          {
            title: 'Process Refund',
            description: 'After approval, refund will be credited within 3-5 business days'
          },
          {
            title: 'Complete Refund',
            description: 'You will receive a refund confirmation email'
          }
        ]
      },
      conditions: {
        title: 'Refund Conditions',
        description: 'To ensure fairness, we have established the following refund conditions:',
        eligible: [
          'Services purchased within 7 days',
          'Unused credits or packages',
          'Service unavailability due to technical issues',
          'Service quality not meeting promises'
        ],
        notEligible: [
          'Used credits or packages',
          'Purchases over 7 days old',
          'Malicious use or service abuse',
          'Violation of terms of service'
        ]
      },
      contactInfo: {
        title: 'Contact Us',
        description: 'If you have any questions or suggestions, please contact us through the following methods:',
        methods: [
          {
            title: 'Customer Service Email',
            description: 'Send email to our customer service email',
            action: 'Send Email'
          },
          {
            title: 'Customer Service Phone',
            description: 'Call our customer service hotline',
            action: 'Call Now'
          },
          {
            title: 'Online Chat',
            description: 'Get instant help through online chat',
            action: 'Start Chat'
          }
        ]
      },
      notEligibleTitle: 'Non-Eligible Refund Conditions',
      sidebar: {
        quickInfo: {
          title: 'Refund Highlights',
          items: [
            { text: '7-Day Refund Window' },
            { text: 'Full Refund' },
            { text: 'Fast Processing' }
          ]
        },
        faq: {
          title: 'Frequently Asked Questions',
          questions: [
            {
              question: 'How long does the refund take?',
              answer: 'Usually processed and credited within 3-5 business days.'
            },
            {
              question: 'Can I get a partial refund?',
              answer: 'We provide full refunds, partial refunds are not supported.'
            },
            {
              question: 'Will the refund go to my original payment account?',
              answer: 'Yes, the refund will be returned to your original payment account.'
            }
          ]
        },
        cta: {
          title: 'Need Help?',
          description: 'Our customer service team is always here to help you'
        }
      }
    },
      service: {
        title: 'Service Policy',
        content: 'We are committed to providing quality service, ensuring users can get the best image processing experience. Our service team is always ready to provide professional technical support and solutions.',
        contact: 'Contact Support',
        backToHome: 'Back to Home',
        freeTrial: 'Free Trial',
        badge: 'Service Guarantee',
        description: 'We are committed to providing you with professional, stable, and secure AI image processing services, ensuring you get the best experience every time you use our service.',
        heroStats: {
          availability: '99.9% Availability',
          support: '24/7 Support',
          security: 'Data Security'
        },
        overview: {
          title: 'Service Overview',
          description: 'Background Removal provides AI-powered image processing services including background removal, object segmentation, image enhancement, and more. We promise to provide you with high-quality, efficient service experience.',
          features: [
            {
              title: 'AI-Driven',
              description: 'Using the latest AI algorithms to provide accurate image processing results'
            },
            {
              title: 'Fast Processing',
              description: 'Average processing time under 30 seconds, supporting batch processing'
            },
            {
              title: 'Secure & Reliable',
              description: 'Using bank-level encryption technology to protect your data security'
            },
            {
              title: 'Professional Support',
              description: '24/7 technical support, ready to solve your problems anytime'
            }
          ]
        },
        terms: {
          title: 'Service Terms',
          scope: {
            title: 'Service Scope',
            items: [
              'AI Background Removal Service',
              'Object Segmentation & Extraction',
              'Image Quality Enhancement',
              'Batch Processing Function'
            ]
          },
          guidelines: {
            title: 'Usage Guidelines',
            items: [
              'Support common image formats',
              'Single upload limit 50MB',
              'Batch process up to 10 images',
              'Results valid for 7 days'
            ]
          }
        },
        sla: {
          title: 'Service Level Agreement (SLA)',
          availability: {
            title: 'Service Availability',
            value: '99.9%',
            description: 'We promise 99.9% service availability, ensuring you can use our services anytime'
          },
          responseTime: {
            title: 'Response Time',
            value: '30s',
            description: 'Average processing time under 30 seconds, most images can be processed within 10 seconds'
          },
          support: {
            title: 'Technical Support',
            value: '24h',
            description: '24/7 technical support, problem response time within 24 hours'
          }
        },
        security: {
          title: 'Data Security',
          encryption: {
            title: 'Data Encryption',
            subtitle: 'AES-256 Encryption',
            description: 'All data transmission and storage use bank-level encryption technology'
          },
          privacy: {
            title: 'Privacy Protection',
            subtitle: 'Strict Confidentiality',
            description: 'Your image data will not be used for other purposes and will be automatically deleted after processing'
          }
        },
        sidebar: {
          features: {
            title: 'Service Features',
            items: [
              'AI Smart Processing',
              'Fast Response',
              'Secure & Reliable',
              'Professional Support'
            ]
          },
          support: {
            title: 'Technical Support',
            email: 'q9425916@gmail.com',
            phone: '+023 6287 2229',
            responseTime: 'We usually respond within 24 hours'
          },
          cta: {
            title: 'Get Started',
            description: 'Experience professional AI image processing services immediately',
            button: 'Free Trial'
          }
        }
      },
      privacy: {
        title: 'Privacy Policy',
        content: 'We value your privacy protection and are committed to protecting your personal information security. We will not sell, trade, or transfer your personal information to third parties unless we have your explicit consent.',
        contact: 'Send Email',
        backToHome: 'Back to Home',
        email: 'Email: q9425916@gmail.com',
        phone: 'Phone: +023 6287 2229',
        badge: 'Privacy Protection',
        description: 'We highly value your privacy protection and are committed to protecting your personal information and data security with the strictest standards.',
        heroStats: {
          dataEncryption: 'Data Encryption',
          privacyProtection: 'Privacy Protection',
          securityReliable: 'Security & Reliable'
        },
        overview: {
          title: 'Policy Overview',
          description: 'This privacy policy explains how we collect, use, store, and protect your personal information. We are committed to handling your data in a transparent and responsible manner.',
          features: [
            {
              title: 'Data Protection',
              description: 'Use bank-level encryption technology to protect your data security'
            },
            {
              title: 'Transparent Processing',
              description: 'Clearly inform you how we use your data'
            },
            {
              title: 'Access Control',
              description: 'Strictly control data access permissions to prevent unauthorized access'
            },
            {
              title: 'Regular Cleanup',
              description: 'Regularly clean up expired data to reduce data breach risks'
            }
          ]
        },
        informationCollection: {
          title: 'Information Collection',
          weCollect: {
            title: 'Information We Collect',
            items: [
              'Images you upload',
              'Device information (browser type, IP address)',
              'Usage records (access time, feature usage)',
              'Contact information (if you actively provide)'
            ]
          },
          weDontCollect: {
            title: 'Information We Don\'t Collect',
            items: [
              'Personal identity information (name, ID number)',
              'Financial information (bank cards, payment passwords)',
              'Sensitive personal information',
              'Location information'
            ]
          }
        },
        informationUsage: {
          title: 'Information Usage',
          purposes: [
            {
              number: '1',
              title: 'Provide Services',
              description: 'Process your uploaded images and provide AI image processing services'
            },
            {
              number: '2',
              title: 'Improve Services',
              description: 'Analyze usage data to continuously improve service quality and user experience'
            },
            {
              number: '3',
              title: 'Security Protection',
              description: 'Detect and prevent fraudulent behavior to protect service security'
            }
          ]
        },
        dataProtection: {
          title: 'Data Protection',
          methods: [
            {
              title: 'Encrypted Transmission',
              subtitle: 'SSL/TLS Encryption',
              description: 'All data transmission uses SSL/TLS encryption technology'
            },
            {
              title: 'Secure Storage',
              subtitle: 'AES-256 Encryption',
              description: 'Data storage uses AES-256 bank-level encryption'
            },
            {
              title: 'Access Control',
              subtitle: 'Strict Permission Management',
              description: 'Strictly control data access permissions with regular audits'
            },
            {
              title: 'Regular Cleanup',
              subtitle: 'Automatic Deletion',
              description: 'Automatically delete original image data after processing'
            }
          ]
        },
        sidebar: {
          privacyHighlights: {
            title: 'Privacy Highlights',
            items: [
              { title: 'Data Encrypted Storage' },
              { title: 'Transparent Processing' },
              { title: 'Secure Transmission' }
            ]
          },
          faq: {
            title: 'FAQ',
            questions: [
              {
                question: 'How long will my images be saved?',
                answer: 'Original images are automatically deleted within 24 hours after processing.'
              },
              {
                question: 'Will you share my data?',
                answer: 'No, we will not share your personal information with third parties.'
              },
              {
                question: 'How to delete my data?',
                answer: 'Please contact us and we will delete all your data within 30 days.'
              }
            ]
          },
          contact: {
            title: 'Contact Us',
            description: 'If you have any privacy-related questions, please contact us anytime',
            sendEmail: 'Send Email'
          }
        }
      },
      terms: {
        title: 'Terms of Service',
        content: 'Please read this agreement carefully. Using our services means you agree to comply with the following terms and conditions.',
        contact: 'Send Email',
        backToHome: 'Back to Home',
        email: 'Email: q9425916@gmail.com',
        phone: 'Phone: +023 6287 2229',
        badge: 'Terms of Service',
        heroStats: {
          legalProtection: 'Legal Protection',
          rightsProtection: 'Rights Protection',
          userFriendly: 'User Friendly'
        },
        overview: {
          title: 'Agreement Overview',
          description: 'This Terms of Service Agreement (hereinafter "Agreement") is a legal agreement between you and Background Removal platform, defining your rights and obligations when using our services.',
          features: [
            {
              title: 'Legal Binding',
              description: 'This agreement is legally binding, please read carefully'
            },
            {
              title: 'Rights Protection',
              description: 'Clearly define rights and obligations, protect user rights'
            },
            {
              title: 'User Friendly',
              description: 'Clear and understandable terms, easy for users to understand'
            },
            {
              title: 'Timely Updates',
              description: 'Update terms in time according to changes in laws and regulations'
            }
          ]
        },
        serviceDescription: {
          title: 'Service Description',
          content: {
            title: 'Service Content',
            services: [
              'AI Background Removal Service',
              'Object Segmentation and Extraction',
              'Image Quality Enhancement',
              'Batch Processing Function'
            ]
          },
          scope: {
            title: 'Service Scope',
            items: [
              'Global User Service',
              '24/7 Online Service',
              'Multi-platform Support',
              'Professional Technical Support'
            ]
          }
        },
        userRights: {
          title: 'User Rights and Obligations',
          rights: {
            title: 'User Rights',
            items: [
              'Enjoy high-quality services',
              'Receive technical support',
              'Protect personal privacy'
            ]
          },
          obligations: {
            title: 'User Obligations',
            items: [
              'Comply with laws and regulations',
              'No malicious use',
              'Protect account security'
            ]
          }
        },
        prohibitedActivities: {
          title: 'Prohibited Activities',
          activities: [
            {
              title: 'Illegal Content',
              subtitle: 'Strictly Prohibited',
              description: 'Upload images containing pornography, violence, terrorism and other illegal content'
            },
            {
              title: 'System Attack',
              subtitle: 'Malicious Behavior',
              description: 'Maliciously attack the system and damage service stability'
            },
            {
              title: 'Data Abuse',
              subtitle: 'Violation of Use',
              description: 'Batch uploads and automated operations affecting service performance'
            },
            {
              title: 'Commercial Abuse',
              subtitle: 'Unauthorized Use',
              description: 'Commercial use without purchasing commercial license'
            }
          ]
        },
        sidebar: {
          keyPoints: {
            title: 'Key Points',
            items: [
              { text: 'Legal Binding' },
              { text: 'Rights Protection' },
              { text: 'User Friendly' }
            ]
          },
          faq: {
            title: 'FAQ',
            questions: [
              {
                question: 'When does the agreement take effect?',
                answer: 'Using the service means agreeing to this agreement, effective immediately.'
              },
              {
                question: 'Can the agreement be modified?',
                answer: 'We will notify users of agreement changes in advance, continued use means agreement.'
              },
              {
                question: 'What are the consequences of violating the agreement?',
                answer: 'May face penalties such as service suspension and account suspension.'
              }
            ]
          },
          contact: {
            title: 'Legal Consultation',
            description: 'If you have any legal questions, please contact us anytime',
            sendEmail: 'Send Email'
          }
        }
      }
    },
    footer: {
      description: 'Professional AI image processing platform, providing you with precise background removal, object segmentation, and image enhancement services.',
      quickLinks: 'Quick Links',
      support: 'Support',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      refund: 'Refund Policy',
      service: 'Service Policy',
      helpCenter: 'Help Center',
      faq: 'FAQ',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      cookie: 'Cookie Policy',
      copyright: '© 2024 Background Removal',
      allRightsReserved: 'All rights reserved'
    }
  }
} 