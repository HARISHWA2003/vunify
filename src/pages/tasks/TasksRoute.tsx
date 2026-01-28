import { useEffect, useState } from "react";
import TasksWeb from "./Tasks.web";
import TasksMobile from "./Tasks.mobile";

export default function TasksRoute() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile ? <TasksMobile /> : <TasksWeb />;
}
