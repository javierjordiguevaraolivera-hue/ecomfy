import Fe6Client from "../fe6/pageClient";
import LandingGtmNoscript, { LandingGtmScripts } from "../components/antony-gtm";

export default function FinalExpenseShortChatPage() {
  return (
    <>
      <LandingGtmScripts />
      <LandingGtmNoscript />
      <script src="//b-js.ringba.com/CAe815cc18555c45ecb7b27ad7dd859c52" async />
      <Fe6Client />
    </>
  );
}
