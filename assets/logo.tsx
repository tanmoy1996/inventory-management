import React from 'react'

const LogoIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 80 80">
      <defs>
        <style>{`.cls-1{fill:url(#linear-gradient);}.cls-2{fill:#06175e;}`}</style>
        <linearGradient id="linear-gradient" y1="40" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3ddeed" stopOpacity="0" />
          <stop offset="1" stopColor="#3ddeed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <rect className="cls-1" width="80" height="80" rx="40" />
          <path className="cls-2" d="M58.89,26.79a17.56,17.56,0,0,0-4.8-.8A14.69,14.69,0,0,1,58.89,26.79Z" />
          <path
            className="cls-2"
            d="M66.39,30.17V19a44.64,44.64,0,0,0-13.53-2.7,20.86,20.86,0,0,0-14,5.06A22,22,0,0,0,37,23.12a24.21,24.21,0,0,0-2.39,2.94,22,22,0,0,0-3.37,7.44h9.9a14.82,14.82,0,0,1,4.3-4.75,0,0,0,0,1,0,0A12.81,12.81,0,0,1,54,26h.14a14.69,14.69,0,0,1,4.8.8l.3.1A35.9,35.9,0,0,1,66.39,30.17Z"
          />
          <path
            className="cls-2"
            d="M66.39,60.62V49.37l-.26.16h0a14.85,14.85,0,0,1-25.71-2.91h-9a22.46,22.46,0,0,0,3.43,7.31,24.63,24.63,0,0,0,2.33,2.83c.56.59,1.15,1.14,1.74,1.66a21.27,21.27,0,0,0,14.38,5.28A32.55,32.55,0,0,0,66.39,60.62Z"
          />
          <path
            className="cls-2"
            d="M23.56,35.51V26.06h7.82a27.93,27.93,0,0,1,8.21-9v-.12h-26V63.08h26V63a27.93,27.93,0,0,1-8.21-9H23.56V44.51H40.39a14.86,14.86,0,0,1,.51-8.95v-.05Z"
          />
        </g>
      </g>
    </svg>
  )
}

const Logo = React.memo(LogoIcon)
export default Logo
