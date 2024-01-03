import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const ParcelIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <polygon
      fill="currentColor"
      points="2.75,3.815918 8.190918,1.095459 6,0 0.559082,2.720459 "
    ></polygon>
    <polygon
      fill="currentColor"
      points="9.309082,1.654541 3.8681641,4.375 6,5.440918 11.440918,2.720459 "
    ></polygon>
    <polygon
      fill="currentColor"
      points="5.5,6.309082 0,3.559082 0,9.25 5.5,12 "
    ></polygon>
    <polygon
      fill="currentColor"
      points="6.5,6.309082 6.5,12 12,9.25 12,3.559082 "
    ></polygon>
  </svg>
);

export const IdIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 16"
  >
    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
  </svg>
);

export const SummaryIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 20"
  >
    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
  </svg>
);

export const CreditCardIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

export const FileEditIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
  </svg>
);

export const PayPalIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="none"
    fill="currentColor"
  >
    <path d="M20.43705,7.10449a3.82273,3.82273,0,0,0-.57281-.5238,4.72529,4.72529,0,0,0-1.15766-3.73987C17.6226,1.61914,15.77494,1,13.2144,1H7.00053A1.89234,1.89234,0,0,0,5.13725,2.5918L2.5474,18.99805A1.53317,1.53317,0,0,0,4.063,20.7832H6.72709l-.082.52051A1.46684,1.46684,0,0,0,8.0933,23h3.23438a1.76121,1.76121,0,0,0,1.751-1.46973l.64063-4.03125.01074-.05468h.29883c4.03223,0,6.55078-1.99317,7.28516-5.7627A5.149,5.149,0,0,0,20.43705,7.10449ZM7.84233,13.7041l-.71448,4.53528-.08631.54382H4.606L7.09721,3H13.2144c1.93554,0,3.31738.4043,3.99218,1.16406a2.96675,2.96675,0,0,1,.60791,2.73334l-.01861.11224c-.01215.07648-.0232.15119-.0434.24622a5.84606,5.84606,0,0,1-2.00512,3.67053,6.67728,6.67728,0,0,1-4.21753,1.183H9.70658A1.87969,1.87969,0,0,0,7.84233,13.7041Zm11.50878-2.40527c-.55078,2.82812-2.24218,4.14551-5.32226,4.14551h-.4834a1.76109,1.76109,0,0,0-1.751,1.47265l-.64941,4.07422L8.71733,21l.47815-3.03387.61114-3.85285h1.7193c.1568,0,.29541-.02356.44812-.02893.35883-.01239.71661-.02618,1.05267-.06787.20526-.02557.39362-.07221.59034-.1087.27252-.05036.54522-.10016.80108-.17127.19037-.053.368-.12121.54907-.18561.23926-.0849.4748-.174.69757-.27868.168-.0791.32807-.16706.48658-.25727a6.77125,6.77125,0,0,0,.61236-.39172c.14228-.1026.28192-.20789.415-.321a6.56392,6.56392,0,0,0,.53693-.51892c.113-.12055.2287-.23755.33331-.36725a7.09,7.09,0,0,0,.48-.69263c.07648-.12219.16126-.23523.23163-.36383a8.33175,8.33175,0,0,0,.52075-1.15326c.00867-.02386.02106-.044.02954-.068.004-.01123.00989-.02057.01386-.03186A4.29855,4.29855,0,0,1,19.35111,11.29883Z" />
  </svg>
);

export const AppleIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 21"
  >
    <path d="M14.537 10.625a4.421 4.421 0 0 0 2.684 4.047 10.96 10.96 0 0 1-1.384 2.845c-.834 1.218-1.7 2.432-3.062 2.457-1.339.025-1.769-.794-3.3-.794s-2.009.769-3.275.82c-1.316.049-2.317-1.318-3.158-2.532C1.323 14.984.01 10.451 1.772 7.391a4.9 4.9 0 0 1 4.139-2.507c1.292-.025 2.511.869 3.3.869.789 0 2.271-1.075 3.828-.917A4.67 4.67 0 0 1 16.7 6.82a4.524 4.524 0 0 0-2.161 3.805M12.02 3.193A4.4 4.4 0 0 0 13.06 0a4.482 4.482 0 0 0-2.946 1.516 4.185 4.185 0 0 0-1.061 3.093 3.708 3.708 0 0 0 2.967-1.416Z" />
  </svg>
);

export const GoogleIcon = ({ className = "h-4 w-4" }: Props) => (
  <svg
    className={cn(className)}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 19"
  >
    <path
      fillRule="evenodd"
      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
      clipRule="evenodd"
    />
  </svg>
);
