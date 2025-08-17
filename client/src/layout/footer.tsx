import { Link } from "wouter";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { KloutLogo } from "@/components/ui/logo";

export default function Footer() {
  return (
    <footer className="bg-muted/30 text-muted-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Link href="/" data-testid="footer-logo">
                <KloutLogo variant="dark" size="md" />
              </Link>
            </div>
            <p className="mb-4 text-muted-foreground">The premier platform for tracking and analyzing soccer players' global influence and performance impact.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="social-twitter">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="social-facebook">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="social-instagram">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="social-youtube">
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Rankings</h4>
            <ul className="space-y-2">
              <li><Link href="/rankings" className="hover:text-primary transition-colors duration-200" data-testid="footer-rankings">Top 100 Players</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">By League</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">By Country</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">By Position</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Historical Rankings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors duration-200" data-testid="footer-about">How Scores Work</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Data Sources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Developer Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors duration-200" data-testid="footer-company-about">About Us</Link></li>
              <li><a href="https://aqvil.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200" data-testid="footer-aqvil">Aqvil Fantasy League</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Klout.soccer. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary mr-4 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary mr-4 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
