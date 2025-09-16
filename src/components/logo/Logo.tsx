import { Link } from '@/i18n/navigation';
export default function Logo() {
  return (
    <div className="text-center">
      <Link href={'/'} className="mx-auto block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 260 70"
          className="mx-auto block h-14 w-auto"
        >
          <defs>
            <filter
              id="logo-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodColor="rgba(0,0,0,0.25)"
              />
            </filter>
          </defs>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="32"
            fontWeight="550"
            fill="var(--primary)"
            filter="url(#logo-shadow)"
          >
            REST Client
          </text>
        </svg>
      </Link>
    </div>
  );
}
