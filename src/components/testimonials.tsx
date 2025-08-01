'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Marquee } from '@/components/ui/marquee'
import { useLanguage } from '@/contexts/language-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const images = [
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
]

// 将评论分成两行

const ReviewCard = ({
  img,
  name,
  username,
  location,
  role,
  body,
}: {
  img: string
  name: string
  username: string
  location: string
  role: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-6",
        "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800/70 transition-colors"
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        <Image 
          className="rounded-full object-cover" 
          alt={name} 
          src={img} 
          width={48}
          height={48}
        />
        <div className="flex flex-col flex-1">
          <figcaption className="text-sm font-medium text-gray-900 dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs text-gray-600 dark:text-gray-400">{location}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{role}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">{username}</p>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {body}
      </blockquote>
    </figure>
  )
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  
  // 获取翻译的评论数据
  const getReviews = () => {
    const reviews = t('home.testimonials.reviews')
    return reviews.map((review: any, index: number) => ({
      ...review,
      img: images[index % images.length]
    }))
  }

  const reviews = getReviews()
  const firstRow = reviews.slice(0, reviews.length / 2)
  const secondRow = reviews.slice(reviews.length / 2)
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.testimonials.title')}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            {t('home.testimonials.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('home.testimonials.rating')}</span>
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="mb-8">
            <Marquee pauseOnHover className="[--duration:300s]">
              {firstRow.map((review: any) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div>
            <Marquee reverse pauseOnHover className="[--duration:300s]">
              {secondRow.map((review: any) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900"></div>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="max-w-3xl mx-auto mt-20 mb-10" style={{ 
          scrollBehavior: 'smooth',
          overflowAnchor: 'none'
        }}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">{t('home.faq.title')}</h2>
          <p className="text-blue-600 dark:text-blue-400 text-center mb-6">{t('home.faq.subtitle')}</p>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10">{t('home.faq.description')}</p>
          <Accordion type="single" collapsible className="space-y-6">
            <AccordionItem value="item-1" className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-gray-800">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-4 gap-2.5 text-gray-900 dark:text-white font-medium transition-all [&[data-state=open]>svg]:rotate-180 cursor-pointer text-left hover:no-underline">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.faq.questions.0.question')}</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{t('home.faq.questions.0.answer')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-gray-800">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-4 gap-2.5 text-gray-900 dark:text-white font-medium transition-all [&[data-state=open]>svg]:rotate-180 cursor-pointer text-left hover:no-underline">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.faq.questions.1.question')}</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{t('home.faq.questions.1.answer')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-gray-800">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-4 gap-2.5 text-gray-900 dark:text-white font-medium transition-all [&[data-state=open]>svg]:rotate-180 cursor-pointer text-left hover:no-underline">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.faq.questions.2.question')}</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{t('home.faq.questions.2.answer')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-gray-800">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-4 gap-2.5 text-gray-900 dark:text-white font-medium transition-all [&[data-state=open]>svg]:rotate-180 cursor-pointer text-left hover:no-underline">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.faq.questions.3.question')}</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{t('home.faq.questions.3.answer')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-gray-800">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-4 gap-2.5 text-gray-900 dark:text-white font-medium transition-all [&[data-state=open]>svg]:rotate-180 cursor-pointer text-left hover:no-underline">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.faq.questions.4.question')}</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{t('home.faq.questions.4.answer')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-gray-800">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-4 gap-2.5 text-gray-900 dark:text-white font-medium transition-all [&[data-state=open]>svg]:rotate-180 cursor-pointer text-left hover:no-underline">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.faq.questions.5.question')}</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{t('home.faq.questions.5.answer')}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </section>
  )
} 