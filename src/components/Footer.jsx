import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaShieldAlt,
  FaTruck,
  FaCreditCard,
  FaHeadset,
  FaRocket,
  FaBox,
  FaUsers,
  FaQuestionCircle,
  FaFileContract,
  FaLock,
  FaStar
} from 'react-icons/fa';
import { SiTrustpilot, SiVisa, SiMastercard, SiPaypal, SiStripe } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Quick Links
  const shopLinks = [
    { name: 'All Products', path: '/all-products' },
    { name: 'Featured Products', path: '/products/featured' },
    { name: 'New Arrivals', path: '/products/new' },
    { name: 'Best Sellers', path: '/products/best-sellers' },
    { name: 'Clearance Sale', path: '/products/sale' },
    { name: 'Bulk Orders', path: '/bulk-orders' }
  ];

  // Categories
  const categories = [
    { name: 'Shirts & T-Shirts', path: '/products/category/shirt' },
    { name: 'Pants & Jeans', path: '/products/category/pant' },
    { name: 'Jackets & Coats', path: '/products/category/jacket' },
    { name: 'Accessories', path: '/products/category/accessories' },
    { name: 'Custom Tailoring', path: '/custom-tailoring' },
    { name: 'Corporate Orders', path: '/corporate-orders' }
  ];

  // Company Links
  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Story', path: '/story' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press & Media', path: '/press' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Blog & News', path: '/blog' }
  ];

  // Support Links
  const supportLinks = [
    { name: 'Help Center', path: '/help', icon: <FaQuestionCircle /> },
    { name: 'FAQ', path: '/faq', icon: <FaQuestionCircle /> },
    { name: 'Shipping Policy', path: '/shipping', icon: <FaTruck /> },
    { name: 'Returns & Refunds', path: '/returns', icon: <FaBox /> },
    { name: 'Size Guide', path: '/size-guide', icon: <FaUsers /> },
    { name: 'Contact Us', path: '/contact', icon: <FaHeadset /> }
  ];

  // Legal Links
  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy', icon: <FaLock /> },
    { name: 'Terms of Service', path: '/terms', icon: <FaFileContract /> },
    { name: 'Cookie Policy', path: '/cookies', icon: <FaShieldAlt /> },
    { name: 'Sitemap', path: '/sitemap', icon: <FaMapMarkerAlt /> }
  ];

  // Trust Badges
  const trustBadges = [
    { 
      icon: <FaShieldAlt className="text-2xl" />, 
      text: '100% Secure Payment', 
      color: 'text-success' 
    },
    { 
      icon: <FaTruck className="text-2xl" />, 
      text: 'Free Shipping Over $99', 
      color: 'text-primary' 
    },
    { 
      icon: <FaCreditCard className="text-2xl" />, 
      text: '30-Day Returns', 
      color: 'text-secondary' 
    },
    { 
      icon: <FaHeadset className="text-2xl" />, 
      text: '24/7 Support', 
      color: 'text-accent' 
    }
  ];

  // Social Media Links
  const socialLinks = [
    { icon: <FaFacebook />, name: 'Facebook', url: 'https://facebook.com/garmentpro', color: 'hover:bg-blue-600 hover:text-white' },
    { icon: <FaTwitter />, name: 'Twitter', url: 'https://twitter.com/garmentpro', color: 'hover:bg-sky-500 hover:text-white' },
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com/garmentpro', color: 'hover:bg-pink-600 hover:text-white' },
    { icon: <FaLinkedin />, name: 'LinkedIn', url: 'https://linkedin.com/company/garmentpro', color: 'hover:bg-blue-700 hover:text-white' },
    { icon: <FaYoutube />, name: 'YouTube', url: 'https://youtube.com/garmentpro', color: 'hover:bg-red-600 hover:text-white' }
  ];

  // Payment Methods
  const paymentMethods = [
    { icon: <SiVisa className="text-3xl" />, name: 'Visa' },
    { icon: <SiMastercard className="text-3xl" />, name: 'MasterCard' },
    { icon: <SiPaypal className="text-3xl" />, name: 'PayPal' },
    { icon: <SiStripe className="text-3xl" />, name: 'Stripe' },
    { icon: <FaCreditCard className="text-3xl" />, name: 'bKash' },
    { icon: <FaCreditCard className="text-3xl" />, name: 'Nagad' }
  ];

  return (
    <footer className="bg-base-300 text-base-content mt-20">
      {/* Trust Bar */}
      <div className="bg-base-100 border-y border-base-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center justify-center md:justify-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors">
                <div className={`${badge.color}`}>
                  {badge.icon}
                </div>
                <div>
                  <div className="font-semibold">{badge.text}</div>
                  <div className="text-xs text-gray-500">Guaranteed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl group-hover:scale-105 transition-transform">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="text-primary">Garment</span>
                  <span className="text-secondary">Pro</span>
                </h2>
                <p className="text-sm text-gray-600 -mt-1">Smart Garment Solutions</p>
              </div>
            </Link>
            
            <p className="text-gray-600 mb-6 max-w-md">
              Revolutionizing the garment industry with innovative order management solutions, 
              premium quality products, and seamless customer experiences since 2020.
            </p>
            
            {/* Newsletter */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                Subscribe to Newsletter
              </h3>
              <div className="join w-full max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered join-item flex-1 focus:ring-2 focus:ring-primary"
                />
                <button className="btn btn-primary join-item">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get updates on new products and exclusive offers
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-bold mb-3">Connect With Us</h3>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-circle btn-sm btn-ghost ${social.color} transition-all`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-l-4 border-primary pl-2">
              Shop
            </h3>
            <ul className="space-y-2">
              {shopLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="hover:text-primary hover:pl-2 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-l-4 border-secondary pl-2">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="hover:text-secondary hover:pl-2 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-l-4 border-accent pl-2">
              Contact & Support
            </h3>
            
            {/* Contact Info */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" />
                <span className="text-sm">
                  123 Fashion Street,<br />
                  Garment District,<br />
                  Dhaka 1200, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-accent flex-shrink-0" />
                <span className="text-sm">+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-accent flex-shrink-0" />
                <span className="text-sm">support@garmentpro.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-accent flex-shrink-0" />
                <span className="text-sm">Mon-Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-2">Need Help?</h4>
              <div className="grid grid-cols-2 gap-2">
                {supportLinks.slice(0, 4).map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="text-xs badge badge-outline hover:badge-primary gap-1"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-base-300 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-600">
              © {currentYear} <span className="font-semibold text-primary">GarmentPro</span>. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Designed with ❤️ for the garment industry
            </p>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-600">We Accept:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={index} 
                    className="tooltip" 
                    data-tip={method.name}
                  >
                    <div className="p-1 bg-base-100 rounded-lg">
                      {method.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trustpilot Rating */}
            <div className="flex items-center gap-2">
              <SiTrustpilot className="text-2xl text-primary" />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <span className="text-xs text-gray-600">4.8/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-6 border-t border-base-300">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Company Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="badge badge-lg badge-outline">
            🏆 ISO 9001 Certified
          </div>
          <div className="badge badge-lg badge-outline">
            🌱 Eco-Friendly
          </div>
          <div className="badge badge-lg badge-outline">
            👕 Premium Quality
          </div>
          <div className="badge badge-lg badge-outline">
            🚚 Fast Delivery
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg z-40"
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;