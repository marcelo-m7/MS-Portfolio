import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const isModifiedEvent = (event: MouseEvent) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

const isExternalUrl = (href: string) => {
  if (href.startsWith("mailto:")) return true;
  if (href.startsWith("tel:")) return true;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) return true;
  if (href.startsWith("//")) return true;
  return false;
};

export const NavigationInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (isModifiedEvent(event)) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (href.startsWith("#")) return;
      if (isExternalUrl(href)) return;

      event.preventDefault();
      const url = new URL(href, window.location.origin);
      const nextPath = `${url.pathname}${url.search}${url.hash}`;
      navigate(nextPath);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [navigate]);

  return null;
};

export default NavigationInterceptor;
