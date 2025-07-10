import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
          <Link href="/" className={`flex items-center gap-2 ${className}`}>
        <Image
          src="/Logo.png"
          alt="Life HP Logo"
          width={size}
          height={size}
          className="rounded-lg"
        />
        {showText && (
          <span className="font-bold text-xl text-primary">Life HP</span>
        )}
      </Link>
  )
}

export function LogoIcon({ size = 40, className = '' }: Omit<LogoProps, 'showText'>) {
      return (
      <Image
        src="/Logo.png"
        alt="Life HP Logo"
        width={size}
        height={size}
        className={`rounded-lg ${className}`}
      />
    )
} 