import { Link } from "wouter";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { KloutLogo } from "@/components/ui/logo";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Link href="/">
                <KloutLogo variant="light" size="md" />
              </Link>
            </div>
            <p className="mb-4">The premier platform for tracking and analyzing soccer players' global influence and performance impact.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Rankings</h4>
            <ul className="space-y-2">
              <li><Link href="/rankings"><a className="hover:text-white">Top 100 Players</a></Link></li>
              <li><a href="#" className="hover:text-white">By League</a></li>
              <li><a href="#" className="hover:text-white">By Country</a></li>
              <li><a href="#" className="hover:text-white">By Position</a></li>
              <li><a href="#" className="hover:text-white">Historical Rankings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="hover:text-white">How Scores Work</a></Link></li>
              <li><a href="#" className="hover:text-white">API Documentation</a></li>
              <li><a href="#" className="hover:text-white">Data Sources</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Developer Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="hover:text-white">About Us</a></Link></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Klout.soccer. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 hover:text-white mr-4">Terms of Service</a>
            <a href="#" className="text-neutral-400 hover:text-white mr-4">Privacy Policy</a>
            <a href="#" className="text-neutral-400 hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
