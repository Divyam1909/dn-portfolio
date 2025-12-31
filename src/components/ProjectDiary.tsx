import React, { forwardRef, useRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './Diary.css';

// SVG Assets
const GoldGradient = () => (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bf953f" />
                <stop offset="30%" stopColor="#fcf6ba" />
                <stop offset="60%" stopColor="#b38728" />
                <stop offset="100%" stopColor="#aa771c" />
            </linearGradient>
            <symbol id="ornate-corner" viewBox="0 0 100 100">
                <path d="M0,0 L100,0 L100,20 Q60,20 40,60 Q20,80 0,100 Z" fill="url(#gold-gradient)" />
                <path d="M5,5 L90,5 L90,15 Q55,15 35,55 Q15,75 5,90 Z" fill="none" stroke="#5d4037" strokeWidth="1" opacity="0.3" />
                <circle cx="20" cy="20" r="4" fill="#3e2723" />
            </symbol>
            <symbol id="icon-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </symbol>
        </defs>
    </svg>
);

const CornerDecor = () => (
    <>
        <div className="corner-gold c-tl"><svg><use href="#ornate-corner" /></svg></div>
        <div className="corner-gold c-tr"><svg><use href="#ornate-corner" /></svg></div>
        <div className="corner-gold c-bl"><svg><use href="#ornate-corner" /></svg></div>
        <div className="corner-gold c-br"><svg><use href="#ornate-corner" /></svg></div>
    </>
);

const PageFace = forwardRef(
    ({ children, className = "", texture = "paper", style, ...rest }: any, ref: any) => (
        <div className={`diary-page ${className}`} ref={ref} style={style} {...rest}>
            {/* Solid backing to prevent content showing through during flip */}
            <div className="page-backing" style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: texture === 'leather' ? '#3e2723' : '#f3e5ce',
                zIndex: 1,
                opacity: 1
            }}></div>
            {texture === "leather" && <div className="leather-texture"></div>}
            {texture === "paper" && <div className="paper-texture"></div>}
            <div className="content-layer" style={{ position: 'relative', zIndex: 2 }}>
                {children}
            </div>
        </div>
    )
);

const CoverPage = forwardRef((props: any, ref: any) => (
    <PageFace ref={ref} texture="leather" className="cover-front">
        <CornerDecor />
        <div
            className="flex flex-col items-center justify-center text-center p-8 h-full"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '2rem',
                textAlign: 'center'
            }}
        >
            <div
                className="bordered-content"
                style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid rgba(197, 160, 89, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <h1 className="font-display text-4xl tracking-widest text-gold uppercase drop-shadow-lg" style={{ fontSize: '2.5rem', letterSpacing: '0.2em', margin: 0, textTransform: 'uppercase', color: '#c5a059', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Project<br />Diary</h1>
                <div className="w-16 h-px bg-gold mx-auto my-6 opacity-70" style={{ width: '4rem', height: '1px', backgroundColor: '#c5a059', margin: '1.5rem auto', opacity: 0.7 }}></div>
                <p className="font-sc text-lg tracking-widest text-light-gold" style={{ fontFamily: '"IM Fell English SC", serif', fontSize: '1.125rem', letterSpacing: '0.1em', color: '#e0c080' }}>Portfolio Vol. I</p>
                <div className="mt-8 text-gold font-sc tracking-widest text-sm opacity-80" style={{ marginTop: '2rem', fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.1em', fontSize: '0.875rem', color: '#c5a059', opacity: 0.8 }}>Author - D.N.</div>
            </div>
            <div className="nav-hint text-gold mt-auto pt-4" style={{ marginTop: 'auto', paddingTop: '1rem', color: '#c5a059' }}>Tap to Open</div>
        </div>
    </PageFace>
));

const IntroPage = forwardRef((props: any, ref: any) => (
    <PageFace ref={ref} className="" style={{ padding: '32px' }}>
        <div className="inner-page-frame" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="font-hand text-2xl text-leather mb-4" style={{ fontFamily: '"La Belle Aurore", cursive', fontSize: '1.8rem', color: '#8d7b68', marginBottom: '1rem' }}>Preface</div>
            <p className="font-serif italic text-ink text-lg w-3/4 leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.25rem', color: '#2b2118', width: '85%', lineHeight: '1.6' }}>
                "To the bugs that kept me up at night, and the solutions that greeted me at dawn."
            </p>
            <div className="w-8 h-px bg-leather mt-6" style={{ width: '2rem', height: '1px', backgroundColor: '#8d7b68', marginTop: '1.5rem' }}></div>
        </div>
    </PageFace>
));

const IndexPage = forwardRef(({ projects, onProjectClick }: any, ref: any) => (
    <PageFace ref={ref} className="text-ink" style={{ padding: '32px' }}>
        <div className="inner-page-frame">
            <h2 className="font-display text-2xl text-leather border-b border-gold pb-2 mb-6 text-center mt-2" style={{ fontFamily: '"Cinzel", serif', fontSize: '1.5rem', color: '#3e2723', borderBottom: '1px solid #c5a059', paddingBottom: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', marginTop: '0.5rem' }}>Index</h2>
            <div className="space-y-4 font-sc text-lg text-leather flex-grow" style={{ fontFamily: '"IM Fell English SC", serif', fontSize: '1.125rem', color: '#5d4037', flexGrow: 1, overflowY: 'auto' }}>
                {projects.map((p: any, i: number) => (
                    <div key={i} className="index-item" onClick={() => onProjectClick(i)} style={{ cursor: 'pointer', padding: '0.5rem 0 0.5rem 1.5rem', borderBottom: '1px dashed rgba(197, 160, 89, 0.3)', position: 'relative' }}>
                        {i + 1}. {p.title}
                    </div>
                ))}
            </div>
            <div className="page-number page-number--below">- i -</div>
        </div>
    </PageFace>
));

const ProjectTextPage = forwardRef(({ project, pageNum, onBack }: any, ref: any) => (
    <PageFace ref={ref} className="text-ink" style={{ padding: '32px' }}>
        <div className="inner-page-frame">
            <button
                className="home-btn absolute top-6 right-6 text-leather opacity-50 hover:opacity-100 transition-opacity"
                onClick={onBack}
                title="Back to Index"
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#8d7b68', zIndex: 10 }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </button>

            <div className="absolute top-6 left-6 font-hand text-xl text-leather" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontFamily: '"La Belle Aurore", cursive', fontSize: '1.25rem', color: '#8d7b68' }}>{project.date || '2024'}</div>

            <h2 className="font-display text-2xl mb-4 mt-8 text-leather border-b border-gold pb-2" style={{ fontFamily: '"Cinzel", serif', fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2.5rem', color: '#3e2723', borderBottom: '1px solid #c5a059', paddingBottom: '0.5rem' }}>{project.title}</h2>

            <p className="font-serif text-lg leading-relaxed mb-4 text-ink" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '1rem', color: '#2b2118' }}>
                {project.description}
            </p>

            <div className="bg-[#e8dec6] p-3 border-l-4 border-leather italic font-serif text-base mb-4 shadow-sm" style={{ backgroundColor: '#e8dec6', padding: '0.75rem', borderLeft: '4px solid #8d7b68', fontStyle: 'italic', fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', marginBottom: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                "{project.quote || 'Crafted with passion and code.'}"
            </div>

            <div className="mt-auto flex gap-3 font-sc text-xs justify-center" style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', fontFamily: '"IM Fell English SC", serif', fontSize: '0.9rem', justifyContent: 'center' }}>
                {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" className="border border-leather px-4 py-2 hover:bg-leather hover:text-white transition duration-300" style={{ border: '1px solid #3e2723', padding: '0.5rem 1rem', textDecoration: 'none', color: '#3e2723', transition: 'all 0.3s' }}>
                        View Live
                    </a>
                )}
                {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="border border-leather px-4 py-2 hover:bg-leather hover:text-white transition duration-300" style={{ border: '1px solid #3e2723', padding: '0.5rem 1rem', textDecoration: 'none', color: '#3e2723', transition: 'all 0.3s' }}>
                        Source
                    </a>
                )}
            </div>
            <div className="page-number page-number--below">- {pageNum} -</div>
        </div>
    </PageFace>
));

const ProjectImagePage = forwardRef(({ project, pageNum }: any, ref: any) => (
    <PageFace ref={ref} className="" style={{ padding: '32px' }}>
        <div className="inner-page-frame" style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', flexDirection: 'column' }}>
            <div className={`polaroid transform ${pageNum % 4 === 0 ? 'rotate-1' : '-rotate-1'}`} style={{ transform: pageNum % 4 === 0 ? 'rotate(1deg)' : 'rotate(-1deg)' }}>
                <div className="tape"></div>
                {project.image ? (
                    <img src={project.image} className="w-full h-32 object-cover sepia-low" alt={project.title} style={{ width: '100%', height: '160px', objectFit: 'cover', filter: 'sepia(0.3)' }} />
                ) : (
                    <div style={{ width: '100%', height: '160px', background: 'linear-gradient(135deg, #e0c080 0%, #d4a050 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="font-display text-4xl text-white opacity-50">{project.title.substring(0, 2)}</span>
                    </div>
                )}
                <div className="font-hand text-lg mt-3 text-center text-ink" style={{ fontFamily: '"La Belle Aurore", cursive', fontSize: '1.125rem', marginTop: '0.5rem', textAlign: 'center', color: '#2b2118' }}>{project.title}</div>
            </div>

            {/* Stack Section moved here */}
            <div style={{ marginTop: '1.5rem', width: '100%', textAlign: 'center' }}>
                <h3 className="font-sc text-xs text-leather mb-2 opacity-70" style={{ fontFamily: '"IM Fell English SC", serif', fontSize: '0.8rem', color: '#5d4037', marginBottom: '0.5rem', opacity: 0.7 }}>Stack</h3>
                <div className="flex flex-wrap gap-2 justify-center" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="tech-badge">{tech}</span>
                    ))}
                </div>
            </div>

            <div className="page-number page-number--bottom">- {pageNum} -</div>
        </div>
    </PageFace>
));

const BackCover = forwardRef((props: any, ref: any) => (
    <PageFace ref={ref} texture="leather" className="cover-back">
        <CornerDecor />
        <div
            className="flex flex-col items-center justify-center text-center p-8 h-full text-gold"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '2rem',
                color: '#c5a059',
                textAlign: 'center'
            }}
        >
            <div
                className="content-layer flex flex-col justify-center items-center border border-gold border-opacity-30 rounded p-4 h-full bg-transparent"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    borderRadius: '4px',
                    height: '100%',
                    width: '100%',
                    padding: '1rem',
                    textAlign: 'center'
                }}
            >
                <div className="font-display text-xl leading-relaxed mb-6 drop-shadow-md" style={{ fontFamily: '"Cinzel", serif', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)', textAlign: 'center' }}>"Every project here started with a <span className="italic text-white" style={{ fontStyle: 'italic', color: 'white' }}>question</span>, not a feature."</div>
                <div className="w-16 h-1 bg-gold opacity-60 mb-6" style={{ width: '4rem', height: '2px', backgroundColor: '#c5a059', opacity: 0.6, marginBottom: '1.5rem' }}></div>
                <div className="nav-hint text-gold mt-8" style={{ marginTop: '2rem', color: '#c5a059', fontSize: '1.4rem' }}>Reopen</div>
            </div>
        </div>
    </PageFace>
));

export const ProjectDiary = ({ projects = [] }: any) => {
    const bookRef = useRef<any>(null);
    const flipTimeoutRef = useRef<any>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Initial check
        checkMobile();

        // Listen for resize events
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Clean up timeout on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (flipTimeoutRef.current) {
                clearTimeout(flipTimeoutRef.current);
            }
        };
    }, []);

    // -------- Recursive Sequence Flip Logic --------
    const flipSequentially = (targetPageIndex: number) => {
        const book = bookRef.current?.pageFlip();
        if (!book) return;

        // Clear any pending flip checks to avoid stacking commands
        if (flipTimeoutRef.current) {
            clearTimeout(flipTimeoutRef.current);
            flipTimeoutRef.current = null;
        }

        const currentPage = book.getCurrentPageIndex();

        // 1. Check if we are already there
        if (currentPage === targetPageIndex) return;

        // 2. Spread Logic Handling:
        // In landscape/spread mode (usePortrait=false), we might see [2, 3].
        // If current is 2, and target is 3, we are technically "at" the spread.
        // However, let's keep it simple: strict index navigation.

        // 3. Determine direction and Move
        if (targetPageIndex > currentPage) {
            book.flipNext();
            // Wait for animation duration (800ms) + small buffer (50ms)
            flipTimeoutRef.current = setTimeout(() => {
                flipSequentially(targetPageIndex);
            }, 850);
        } else if (targetPageIndex < currentPage) {
            book.flipPrev();
            flipTimeoutRef.current = setTimeout(() => {
                flipSequentially(targetPageIndex);
            }, 850);
        }
    };
    // ------------------------------------------------

    const flipToIndex = () => {
        // Index Page is at Index 2 in the flattened children list:
        // 0: Cover, 1: Intro, 2: Index
        console.log('flipToIndex: sequential flip to page 1');
        flipSequentially(1);
    };

    const flipToProject = (index: number) => {
        // Calculate the specific page index for the project's text page.
        // Array structure:
        // 0: Cover
        // 1: Intro
        // 2: Index
        // 3: Proj 0 Text
        // 4: Proj 0 Image
        // ...
        const targetPage = 3 + (index * 2);

        console.log(`flipToProject: sequential flip to page ${targetPage}`);
        flipSequentially(targetPage);
    };

    // Responsive dimensions
    const bookWidth = isMobile ? Math.min(window.innerWidth - 40, 320) : 360;
    const bookHeight = isMobile ? Math.min(window.innerHeight - 200, 480) : 520;

    return (
        <div className="diary-scene" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: isMobile ? '450px' : '600px', padding: '0.5rem' }}>
            <GoldGradient />

            {/* Mobile hint message */}
            {isMobile && (
                <div className="mobile-hint" style={{
                    fontFamily: '"IM Fell English SC", serif',
                    fontSize: '1.5rem',
                    color: '#3e2723',
                    textAlign: 'center',
                    padding: '0.6rem 1.25rem',
                    marginBottom: '0.75rem',
                    background: 'linear-gradient(135deg, #f3e5ce 0%, #e8dec6 100%)',
                    borderRadius: '4px',
                    border: '2px solid #c5a059',
                    boxShadow: '0 2px 8px rgba(62, 39, 35, 0.15)',
                    maxWidth: '90%'
                }}>
                    ❧ Switch to desktop for better experience ❧
                </div>
            )}

            <HTMLFlipBook
                width={bookWidth}
                height={bookHeight}
                size="fixed"
                minWidth={isMobile ? 280 : 300}
                maxWidth={isMobile ? 350 : 500}
                minHeight={isMobile ? 350 : 400}
                maxHeight={isMobile ? 500 : 700}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className={`diary-book ${isMobile ? 'diary-book--mobile' : ''}`}
                ref={bookRef}
                style={{ margin: '0 auto' }}
                startPage={0}
                drawShadow={true}
                flippingTime={800} /* Matched in flipSequentially timeout */
                usePortrait={isMobile}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={isMobile ? 30 : 20}
                showPageCorners={true}
                disableFlipByClick={false}
            >
                {/* 0. Cover */}
                <CoverPage key="cover" />

                {/* 1. Intro */}
                <IntroPage key="intro" />

                {/* 2. Index */}
                <IndexPage key="index" projects={projects} onProjectClick={flipToProject} />

                {/* Projects Start at Index 3 */}
                {projects.flatMap((project: any, index: number) => [
                    <ProjectTextPage key={`p-${index}-1`} project={project} pageNum={(index * 2) + 1} onBack={flipToIndex} />,
                    <ProjectImagePage key={`p-${index}-2`} project={project} pageNum={(index * 2) + 2} />
                ])}

                {/* Back Cover */}
                <BackCover key="back-cover" />

            </HTMLFlipBook>
        </div>
    );
};