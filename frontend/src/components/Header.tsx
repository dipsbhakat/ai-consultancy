import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Services', href: '/services' },
	{ name: 'Testimonials', href: '/testimonials' },
	{ name: 'Contact', href: '/contact' },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
		document.body.style.overflow = 'unset';
		};
	}, [mobileMenuOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && mobileMenuOpen) {
				handleMobileMenuToggle(false);
			}
		};
		if (mobileMenuOpen) {
			document.addEventListener('keydown', handleEscape);
			return () => document.removeEventListener('keydown', handleEscape);
		}
	}, [mobileMenuOpen]);

	const handleMobileMenuToggle = (open: boolean) => {
		setMobileMenuOpen(open);
		if (open) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	};

	 return (
		 <>
			 <header className="bg-white/97 backdrop-blur-md sticky top-0 z-50 border-b border-muted-200/60 shadow-elegant">
				 <nav className="container-custom flex items-center justify-between py-4" aria-label="Global">
					 <div className="flex lg:flex-1">
						 <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-3 group">
							 <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-effect">
								 <Brain className="w-6 h-6 text-white" />
							 </div>
							 <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
								 BengalMindAI Consultancy
							 </span>
						 </Link>
					 </div>
					 <div className="flex lg:hidden">
						 <button
							 type="button"
							 className="-m-2.5 inline-flex items-center justify-center rounded-xl p-3 text-muted-700 hover:bg-muted-100 transition-colors duration-200 lg:!hidden min-h-[44px] min-w-[44px]"
							 onClick={() => handleMobileMenuToggle(!mobileMenuOpen)}
							 aria-expanded={mobileMenuOpen}
							 aria-controls="mobile-menu"
							 aria-label="Toggle navigation menu"
						 >
							 {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
						 </button>
					 </div>
					 <div className="hidden lg:flex lg:gap-x-8">
						 {navigation.map((item) => (
							 <Link
								 key={item.name}
								 to={item.href}
								 className={`relative px-3 py-2 text-sm font-semibold transition-all duration-300 group ${
									 location.pathname === item.href
										 ? 'text-primary-600'
										 : 'text-muted-700 hover:text-primary-600'
								 }`}
							 >
								 {item.name}
								 {location.pathname === item.href && (
									 <motion.div
										 layoutId="navbar-indicator"
										 className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
										 initial={false}
										 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
									 />
								 )}
								 <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
							 </Link>
						 ))}
					 </div>
					 <div className="hidden lg:flex lg:flex-1 lg:justify-end">
						 <Link
							 to="/contact"
							 className="btn-cta text-sm font-semibold px-6 py-3 group"
						 >
							 Get Started
							 <span className="ml-2 group-hover:translate-x-0.5 transition-transform duration-300">→</span>
						 </Link>
					 </div>
				 </nav>
				 <AnimatePresence>
					 {mobileMenuOpen && (
						 <>
										 {/* Backdrop - highest z-index, covers everything */}
										 <motion.div
											 initial={{ opacity: 0 }}
											 animate={{ opacity: 0.5 }}
											 exit={{ opacity: 0 }}
											 transition={{ duration: 0.2 }}
											 className="fixed inset-0 bg-black z-[100]"
											 style={{ pointerEvents: 'auto' }}
											 onClick={() => handleMobileMenuToggle(false)}
										 />
										 {/* Slide-in sidebar - highest z-index, covers full height, safe padding */}
										 <motion.div
											 initial={{ x: '100%' }}
											 animate={{ x: 0 }}
											 exit={{ x: '100%' }}
											 transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
											 className="fixed top-0 right-0 h-screen w-[90vw] max-w-sm bg-white shadow-elegant-lg z-[110] flex flex-col px-6 pt-8 pb-10 gap-6"
											 role="dialog"
											 aria-modal="true"
											 aria-labelledby="mobile-menu-title"
											 id="mobile-menu"
										 >
											 <div className="flex items-center justify-between mb-6">
												 <span className="text-lg font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">Menu</span>
												 <button
													 type="button"
													 className="p-2 rounded-xl text-muted-700 hover:bg-muted-100 transition-colors duration-200"
													 aria-label="Close menu"
													 onClick={() => handleMobileMenuToggle(false)}
												 >
													 <X className="h-6 w-6" aria-hidden="true" />
												 </button>
											 </div>
											 <div className="flex flex-col gap-2 overflow-y-auto flex-1">
												 {navigation.map((item) => (
													 <Link
														 key={item.name}
														 to={item.href}
														 className={`block rounded-xl px-4 py-4 text-lg font-semibold transition-all duration-200 ${
															 location.pathname === item.href
																 ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border-l-4 border-primary-500'
																 : 'text-muted-700 hover:bg-muted-50 hover:text-primary-600'
														 }`}
														 onClick={() => handleMobileMenuToggle(false)}
													 >
														 {item.name}
													 </Link>
												 ))}
											 </div>
											 <Link
												 to="/contact"
												 className="btn-cta w-full text-center py-4 mt-6"
												 onClick={() => handleMobileMenuToggle(false)}
											 >
												 Get Started
											 </Link>
										 </motion.div>
						 </>
					 )}
				 </AnimatePresence>
			 </header>
		 </>
	 );
}
