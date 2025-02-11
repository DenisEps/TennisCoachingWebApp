'use client';

export default function SupportPage() {
  const faqs = [
    {
      question: 'How do I book a session?',
      answer: 'Log in as a client, go to your dashboard, click "Book Now", select a coach and available time slot, then confirm your booking.',
    },
    {
      question: 'How do I cancel a session?',
      answer: 'Go to your dashboard, find the session under "Upcoming Sessions", and click the "Cancel" button. Please note that cancellations should be made at least 24 hours in advance.',
    },
    {
      question: 'How do payments work?',
      answer: 'For the MVP version, all payments are handled offline directly with your coach. Online payments will be added in a future update.',
    },
    {
      question: 'How do I set my availability as a coach?',
      answer: 'Log in as a coach, go to your dashboard, click "Manage Schedule", and add your available time slots for each day of the week.',
    },
  ];

  const contactInfo = {
    email: 'support@tenniscoaching.com',
    phone: '+1 (555) 123-4567',
    hours: 'Monday to Friday, 9:00 AM - 5:00 PM EST',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Help & Support</h1>

        {/* FAQs Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">Contact Us</h2>
          <div className="space-y-4">
            <p className="flex items-center space-x-2">
              <span className="font-medium">Email:</span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {contactInfo.email}
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-medium">Phone:</span>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {contactInfo.phone}
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-medium">Support Hours:</span>
              <span>{contactInfo.hours}</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 