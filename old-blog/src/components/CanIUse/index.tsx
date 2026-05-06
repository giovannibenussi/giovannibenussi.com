import { SunIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import canIUseLogo from './caniuse-logo.png'
import mdnLogo from './mdn-logo.jpeg'
import w3cLogo from './w3c-logo.png'

function CanIUse({ docURL, name, support, canIUseURL, w3cURL }: any) {
  return (
    <div className="rounded bg-blue-50 p-4 pb-1 dark:bg-blue-200">
      <p
        className="flex font-bold dark:text-blue-900"
        style={{ fontWeight: '700', margin: '0 0 0.5rem 0' }}
      >
        <SunIcon />
        &nbsp; {name}
      </p>
      <ul className="leading-8">
        {canIUseURL && (
          <li>
            <a
              href={canIUseURL}
              target="_blank"
              rel="noreferrer"
              className="link-green dark:text-green-600"
            >
              <Image
                src={canIUseLogo}
                height={24}
                width={24}
                alt="caniuse.com logo"
              />
              <span className="ml-2">Global Support: {support}</span>
            </a>
          </li>
        )}
        {docURL && (
          <li>
            <a
              href={docURL}
              target="_blank"
              rel="noreferrer"
              className="link-blue"
            >
              <Image
                src={mdnLogo}
                alt="Mozilla Developer Network logo"
                height={24}
                width={24}
              />
              <span className="ml-2">MDN Docs</span>
            </a>
          </li>
        )}
        {w3cURL && (
          <li>
            <a
              href={w3cURL}
              target="_blank"
              rel="noreferrer"
              className="link-blue"
            >
              <Image src={w3cLogo} alt="W3c logo" height={24} width={24} />
              <span className="ml-2">W3C</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}

export default CanIUse
