const TermsOfServices = () => {
  return (
    <div className="bg-white text-black min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: July 16, 2025</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Use of Subdomains</h2>
        <p>
          You may claim and use a subdomain under <code>*.dnstitle.com</code>
          for personal or project use. You are responsible for all content
          hosted on your subdomain. Do not use it for illegal, harmful,
          misleading, or malicious purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          2. Account Responsibility
        </h2>
        <p>
          You must provide valid information when registering. You're
          responsible for your account’s security and usage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Content Policy</h2>
        <p>
          You agree not to host content that is pornographic, hateful, violent,
          deceptive, or infringes on copyright/trademark laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Domain Abuse</h2>
        <p>
          We may suspend or ban any subdomain/IP found distributing spam,
          malware, phishing, or scams.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Service Availability</h2>
        <p>
          This is a free service with no uptime guarantee. We may add/remove
          features at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Data and Privacy</h2>
        <p>
          We only collect essential data. Please refer to our{" "}
          <a href="/privacy" className="underline text-blue-600">
            Privacy Policy
          </a>{" "}
          for more information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
        <p>
          We reserve the right to delete or suspend any subdomain that violates
          these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          8. Limitation of Liability
        </h2>
        <p>
          We are not liable for any damages, losses, or issues caused by your
          use of this service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. By continuing to use the
          service, you agree to the latest version.
        </p>
      </section>
    </div>
  );
};

export default TermsOfServices;
