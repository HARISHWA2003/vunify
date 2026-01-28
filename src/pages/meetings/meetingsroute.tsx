import { useEffect, useState } from "react";
import MeetingsWeb from "./meetings.web";
import MeetingsMobile from "./meetings.mobile";

export default function MeetingsRoute() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile ? <MeetingsMobile /> : <MeetingsWeb />;
}
