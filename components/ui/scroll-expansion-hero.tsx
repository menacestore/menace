'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  aspectRatio?: number;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  aspectRatio = 9 / 16,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [isTabletState, setIsTabletState] = useState<boolean>(false);

  const scrollProgressRef = useRef(0);
  const mediaFullyExpandedRef = useRef(false);
  const touchStartYRef = useRef(0);
  const showContentRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const updateProgress = useCallback(
    (value: number, expanded: boolean, contentShown: boolean) => {
      scrollProgressRef.current = value;
      mediaFullyExpandedRef.current = expanded;
      showContentRef.current = contentShown;
      setScrollProgress(value);
      setMediaFullyExpanded(expanded);
      setShowContent(contentShown);
    },
    [],
  );

  // Reset scroll-expansion state when the media source type changes.
  useEffect(() => {
    scrollProgressRef.current = 0;
    mediaFullyExpandedRef.current = false;
    showContentRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Collapse gradually (mirroring the expand) when scrolling up at the top.
      const collapsing = mediaFullyExpandedRef.current && e.deltaY < 0 && window.scrollY <= 5;
      if (collapsing || !mediaFullyExpandedRef.current) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgressRef.current + scrollDelta, 0),
          1
        );
        const expanded = newProgress >= 1;
        const contentShown = expanded || (newProgress >= 0.75 && showContentRef.current);
        updateProgress(newProgress, expanded, contentShown);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      if (!startY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = startY - touchY;

      // Collapse gradually (mirroring the expand) when swiping down at the top.
      const collapsing = mediaFullyExpandedRef.current && deltaY < 0 && window.scrollY <= 5;
      if (collapsing || !mediaFullyExpandedRef.current) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgressRef.current + scrollDelta, 0),
          1
        );
        const expanded = newProgress >= 1;
        const contentShown = expanded || (newProgress >= 0.75 && showContentRef.current);
        updateProgress(newProgress, expanded, contentShown);
        touchStartYRef.current = touchY;
      }
    };

    const handleTouchEnd = (): void => {
      touchStartYRef.current = 0;
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpandedRef.current) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [updateProgress]);

  useEffect(() => {
    const checkBreakpoints = (): void => {
      const w = window.innerWidth;
      setIsMobileState(w < 768);
      setIsTabletState(w >= 768 && w < 1024);
    };

    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);

    return () => window.removeEventListener('resize', checkBreakpoints);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 550 : isTabletState ? 800 : 1250);
  const mediaHeight = mediaWidth * aspectRatio;
  const textTranslateX = scrollProgress * (isMobileState ? 180 : isTabletState ? 120 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[calc(100dvh+5rem)]'>
        <div className='relative w-full flex flex-col items-center min-h-[calc(100dvh+5rem)]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              width={1920}
              height={1080}
              className='w-screen h-screen'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
            />
            <div className='absolute inset-0 bg-black/30 md:bg-black/20' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div
              className='flex flex-col items-center justify-center w-full h-[calc(100dvh+5rem)] relative'>
              <div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: isMobileState ? '92vw' : '95vw',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className='w-full h-full object-cover rounded-xl'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover rounded-xl'
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0 }}
                    />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                  {date && (
                    <p
                      className='text-lg md:text-xl text-zinc-300'
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className='text-xs md:text-sm text-zinc-500 font-medium text-center tracking-widest uppercase'
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {title && (
                <div
                  className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                    textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                  }`}
                >
                  <motion.h2
                    className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white transition-none tracking-tight'
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {firstWord}
                  </motion.h2>
                  {restOfTitle && (
                    <motion.h2
                      className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center text-white transition-none tracking-tight'
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {restOfTitle}
                    </motion.h2>
                  )}
                </div>
              )}
            </div>

            <motion.section
              className='flex flex-col w-full px-4 sm:px-8 py-6 sm:py-10 md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
