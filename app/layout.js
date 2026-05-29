import './globals.css'
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Mining Problem Submission Portal | IIT (BHU) Varanasi',
  description: 'Submit and browse real-world mining challenges from industry professionals. A Department of Mining Engineering initiative at IIT (BHU) Varanasi.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
