import { LANDING_GTM_INLINE } from "../components/antony-gtm";

export default function Head() {
  return <script dangerouslySetInnerHTML={{ __html: LANDING_GTM_INLINE }} />;
}
