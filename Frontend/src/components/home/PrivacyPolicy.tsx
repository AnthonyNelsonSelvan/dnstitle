const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-black min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: July 16, 2025</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          1. Information We Collect
        </h2>
        <p>
          We only collect the minimum necessary data to provide the service —
          such as your email, chosen subdomain, and IP address (for security
          checks).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Data</h2>
        <p>
          We use your data to:
          <ul className="list-disc pl-6 mt-2">
            <li>Create and manage your subdomain</li>
            <li>Detect and prevent abuse or spam</li>
            <li>Communicate important updates</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Sharing of Data</h2>
        <p>
          We do not sell or share your personal data with third parties.
          Information may only be shared if required by law or to prevent abuse.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Cookies & Tracking</h2>
        <p>
          We may use cookies to remember your login or preferences. We do not
          use tracking for ads or analytics at this time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p>
          We take steps to protect your information using basic encryption and
          secure storage. No system is 100% safe, but we care about your
          privacy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p>
          You may request to delete your account and data at any time by
          contacting us. We’ll remove it unless we're legally required to keep
          it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          7. Changes to This Policy
        </h2>
        <p>
          We may update this policy if needed. If we make significant changes,
          we will let you know.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
