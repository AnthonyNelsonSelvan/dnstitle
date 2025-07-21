export const Footer = () => {
  return (
    <div>
      <footer className="bg-slate-800 text-white text-sm py-8 px-4 text-center space-y-2 mt-10">
        <div>© {new Date().getFullYear()} DnsTitle. All rights reserved.</div>
        <div>
          <a href="/privacy" className="underline hover:text-gray-300">
            Privacy Policy
          </a>{" "}
          ·
          <a href="/terms" className="underline hover:text-gray-300 ml-2">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};
