import { useCallback } from "react";

export function broadcast(eventName, detail) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export default function (eventName) {
  const broadcastAlias = useCallback(detail => broadcast(eventName, detail), [
    eventName
  ]);

  const listen = useCallback(
    cb => {
      window.addEventListener(eventName, cb);
      return () => {
        window.removeEventListener(eventName, cb);
      };
    },
    [eventName]
  );

  return {
    broadcast: broadcastAlias,
    listen
  };
}
