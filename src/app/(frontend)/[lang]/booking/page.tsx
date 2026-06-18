import { BookingForm } from '@/app/(frontend)/booking/booking-form'

const t = {
  en: {
    title: 'Book Your Class',
    price: 'Price per class €10',
    stepDate: '1. Choose class date(s)',
    stepTime: '2. Select class times',
    untitledClass: 'Untitled Class',
    name: 'Name',
    namePlaceholder: 'Your name',
    nameError: 'Name must be at least 2 characters',
    email: 'Email',
    emailError: 'Invalid email format',
    paymentMethod: 'Payment Method',
    selectPayment: 'Select payment',
    creditCard: 'Credit Card / iDeal',
    paypal: 'PayPal',
    selectClassError: 'Please select at least one class.',
    bookNow: 'Book Now',
  },
  ja: {
    title: 'クラスを予約する',
    price: '1クラス €10',
    stepDate: '1. 日程を選択してください',
    stepTime: '2. 時間を選択してください',
    untitledClass: '無題のクラス',
    name: 'お名前',
    namePlaceholder: 'お名前を入力してください',
    nameError: '名前は2文字以上で入力してください',
    email: 'メールアドレス',
    emailError: 'メールアドレスの形式が正しくありません',
    paymentMethod: '支払い方法',
    selectPayment: '支払い方法を選択',
    creditCard: 'クレジットカード / iDeal',
    paypal: 'PayPal',
    selectClassError: '少なくとも1つのクラスを選択してください。',
    bookNow: '予約する',
  },
}

export type BookingLabels = typeof t.en

type Args = {
  params: Promise<{ lang: string }>
}

export default async function BookingPage({ params: paramsPromise }: Args) {
  const { lang } = await paramsPromise
  const labels = t[lang as keyof typeof t] ?? t.en

  return (
    <main className="container">
      <h1 className="text-3xl font-bold mb-6">{labels.title}</h1>
      <h3>{labels.price}</h3>
      <BookingForm locale={lang} labels={labels} />
    </main>
  )
}
