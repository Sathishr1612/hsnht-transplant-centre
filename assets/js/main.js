/* main.js - Core interactive scripts for HSN Hair Transplant Centre */

// Global state / Data definitions
const BEFORE_AFTER_ITEMS = [
  {
    id: "ba-1",
    grafts: "3,000 Micro-Grafts",
    target: "Full Frontal Hairline Design",
    team: "Dr. Neyogi (Direct Supervision)",
    beforeImage: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&w=800&q=80",
    title: "THE SWEEPING REVEAL",
    description: "Full frontal dense session restoring the natural density and hair flow direction."
  },
  {
    id: "ba-2",
    grafts: "2,500 Micro-Grafts",
    target: "Temples & Receding Corners",
    team: "Dr. Neyogi (Direct Supervision)",
    beforeImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    title: "SYMMETRICAL CORNERING",
    description: "Reconstructing recession points to create a sharp, masculine, and youthful frame."
  },
  {
    id: "ba-3",
    grafts: "5,000 Micro-Grafts",
    target: "High-Density Megasession",
    team: "Dr. Neyogi & Team Elite",
    beforeImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
    title: "THE CROWN MAJESTY",
    description: "A comprehensive megasession addressing both vertex thinning and primary hairline borders."
  },
  {
    id: "ba-4",
    grafts: "3,500 Micro-Grafts",
    target: "Beard & Temple Blend",
    team: "Dr. Neyogi (Direct Supervision)",
    beforeImage: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    title: "BEARD & TEMPLE CONTINUITY",
    description: "Blending facial transplants seamlessly with existing sideburn line angles."
  }
];

let activeBeforeAfterIdx = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Initialize scroll progress bar
  initScrollProgress();

  // Initialize mobile navigation
  initMobileNav();

  // Initialize Hero slideshow
  initHeroSlideshow();

  // Initialize Before/After interaction slider
  initBeforeAfterSlider();

  // Initialize Before/After carousel tabs
  initBeforeAfterCarousel();

  // Initialize Doctor profile tabs
  initDoctorTabs();

  // Initialize Gallery Filter
  initGalleryFilter();

  // Initialize Luxury Before/After Gallery
  initLuxuryGallery();

  // Initialize Testimonial Video Modal
  initTestimonialModal();

  // Initialize Consultation Booking Modal
  initConsultationModal();

  // Initialize statistics scroll counters
  initStatCounters();

  // Initialize Concern Selector
  initConcernSelector();
});

/* Scroll Tracker (Progress Bar, Navbar State, & Scrollspy) */
function initScrollProgress() {
  const progressBar = document.querySelector(".scroll-progress-bar");
  const navbar = document.getElementById("main-navbar");
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".glass-nav .nav-link, .mobile-nav-panel .nav-link");

  window.addEventListener("scroll", () => {
    // 1. Progress Bar
    if (progressBar) {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const percentage = (window.scrollY / totalScroll) * 100;
        progressBar.style.width = `${percentage}%`;
      }
    }

    // 2. Navbar scrolled state
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    }

    // Removed buggy scrollspy link highlighting that was stripping active classes from page links
  });
}

/* Mobile Nav Drawer functionality */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const closeBtn = document.getElementById("mobile-menu-close");
  const panel = document.getElementById("mobile-nav-panel");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  const links = document.querySelectorAll(".mobile-nav-panel .nav-link, .mobile-nav-panel .mobile-dropdown-item");
  const actionButtons = document.querySelectorAll(".mobile-nav-panel button, .mobile-nav-panel a");

  if (!toggleBtn || !panel || !backdrop) return;

  function openMenu() {
    panel.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    panel.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Toggle button opens menu
  toggleBtn.addEventListener("click", openMenu);

  // Close button closes menu
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  // Backdrop click closes menu
  backdrop.addEventListener("click", closeMenu);

  // ESC key closes menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      closeMenu();
    }
  });

  // Navigation link clicks close menu
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      // If it is the dropdown/accordion trigger, do not close menu and prevent bubbling!
      if (link.hasAttribute("data-bs-toggle") && link.getAttribute("data-bs-toggle") === "collapse") {
        return; // Let bootstrap collapse handle it
      }

      closeMenu();
    });
  });

  // CTA buttons or modal togglers close menu to avoid double-scrolling bugs
  actionButtons.forEach(btn => {
    if (btn.getAttribute("data-bs-toggle") === "modal" || btn.id === "drawer-cta-book") {
      btn.addEventListener("click", () => {
        closeMenu();
      });
    }
  });

  // Re-run lucide parser for the drawer elements if needed
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/* Hero Slideshow Cycle */
function initHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".indicator-item");
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    indicators.forEach(ind => ind.classList.remove("active"));

    currentSlide = index;
    slides[currentSlide].classList.add("active");
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add("active");
    }
  }

  function nextSlide() {
    let nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  }

  function startInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  indicators.forEach((ind, idx) => {
    ind.addEventListener("click", () => {
      showSlide(idx);
      resetInterval();
    });
  });

  startInterval();
}

/* Before / After Slider range movement logic */
function initBeforeAfterSlider() {
  const container = document.querySelector(".ba-slider-container");
  const sliderInput = document.getElementById("ba-slider-range");
  const revealContainer = document.querySelector(".ba-slider-reveal-container");
  const handle = document.querySelector(".ba-slider-handle");

  if (!sliderInput || !revealContainer || !handle) return;

  sliderInput.addEventListener("input", (e) => {
    const value = e.target.value;
    revealContainer.style.width = `${value}%`;
    handle.style.left = `${value}%`;
  });
}

/* Before / After Patient Carousel Selector */
function initBeforeAfterCarousel() {
  const navDots = document.querySelectorAll(".ba-nav-dot");
  if (!navDots.length) return;

  const beforeImg = document.getElementById("ba-before-img");
  const afterImg = document.getElementById("ba-after-img");
  const caseTitle = document.getElementById("ba-case-title");
  const caseDesc = document.getElementById("ba-case-desc");
  const graftVal = document.getElementById("ba-graft-value");
  const targetVal = document.getElementById("ba-target-value");
  const teamVal = document.getElementById("ba-team-value");

  function selectCase(index) {
    activeBeforeAfterIdx = index;
    const item = BEFORE_AFTER_ITEMS[index];

    // Update active tab dot
    navDots.forEach(dot => dot.classList.remove("active"));
    navDots[index].classList.add("active");

    // Fade effect on image swap
    const imageContainer = document.querySelector(".ba-slider-outer");
    if (imageContainer) {
      imageContainer.style.opacity = "0.3";
      setTimeout(() => {
        beforeImg.src = item.beforeImage;
        afterImg.src = item.afterImage;
        imageContainer.style.opacity = "1";
      }, 150);
    } else {
      beforeImg.src = item.beforeImage;
      afterImg.src = item.afterImage;
    }

    // Update details side text
    if (caseTitle) caseTitle.textContent = item.title;
    if (caseDesc) caseDesc.textContent = item.description;
    if (graftVal) graftVal.textContent = item.grafts;
    if (targetVal) targetVal.textContent = item.target;
    if (teamVal) teamVal.textContent = item.team;

    // Reset slider range to 50%
    const sliderInput = document.getElementById("ba-slider-range");
    const revealContainer = document.querySelector(".ba-slider-reveal-container");
    const handle = document.querySelector(".ba-slider-handle");
    if (sliderInput && revealContainer && handle) {
      sliderInput.value = 50;
      revealContainer.style.width = "50%";
      handle.style.left = "50%";
    }
  }

  navDots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      selectCase(idx);
    });
  });
}

/* Doctor Section Interactive Bio Tabs */
function initDoctorTabs() {
  const tabButtons = document.querySelectorAll(".doc-tab-btn");
  const tabContents = document.querySelectorAll(".doc-tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const activeContent = document.getElementById(`doc-tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });
}

/* Sanctuary Gallery Category filter */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll(".gallery-tab-btn");
  const galleryItems = document.querySelectorAll(".gallery-grid-item-wrapper");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute("data-category");
        if (category === "All" || itemCat === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

/* Testimonials Video play triggering and custom modal loading */
function initTestimonialModal() {
  const playButtons = document.querySelectorAll(".play-btn-circle, .testimonial-video-box");
  const videoIframe = document.getElementById("testimonial-iframe");
  const modalElement = document.getElementById("videoReviewModal");

  if (!modalElement || !videoIframe) return;

  playButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const videoUrl = btn.getAttribute("data-video") || btn.closest(".testimonial-video-box")?.getAttribute("data-video");
      if (videoUrl) {
        // Change watch/normal URL to embed format if needed
        let embedUrl = videoUrl;
        if (videoUrl.includes("watch?v=")) {
          embedUrl = videoUrl.replace("watch?v=", "embed/");
        }
        videoIframe.src = embedUrl;
      }
    });
  });

  // Clear iframe on modal dismissal to stop sound
  modalElement.addEventListener("hidden.bs.modal", () => {
    videoIframe.src = "";
  });
}

/* Consultation multi-step booking form */
function initConsultationModal() {
  const formStep1 = document.getElementById("booking-form-step-1");
  const formStep2 = document.getElementById("booking-form-step-2");

  const step1Panel = document.getElementById("booking-step-1-panel");
  const step2Panel = document.getElementById("booking-step-2-panel");
  const successPanel = document.getElementById("booking-success-panel");

  const modalCloseBtn = document.getElementById("consultation-modal-close");
  const modalEl = document.getElementById("consultationModal");

  // Time slot dynamic selection
  const timeSlotButtons = document.querySelectorAll(".time-slot-btn");
  let selectedTime = "";

  timeSlotButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      timeSlotButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTime = btn.getAttribute("data-time");
    });
  });

  // Booking Data store
  let bookingData = {
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: ""
  };

  // Step 1 Submit
  if (formStep1) {
    formStep1.addEventListener("submit", (e) => {
      e.preventDefault();

      bookingData.name = document.getElementById("booking-name").value;
      bookingData.phone = document.getElementById("booking-phone").value;
      bookingData.email = document.getElementById("booking-email").value;
      bookingData.service = document.getElementById("booking-service").value;

      if (!bookingData.name || !bookingData.phone || !bookingData.email) {
        alert("Please complete all fields to proceed.");
        return;
      }

      // Transition to Step 2
      step1Panel.style.display = "none";
      step2Panel.style.display = "block";
    });
  }

  // Step 2 Submit (Final confirm)
  if (formStep2) {
    formStep2.addEventListener("submit", (e) => {
      e.preventDefault();

      bookingData.date = document.getElementById("booking-date").value;
      bookingData.time = selectedTime;
      bookingData.notes = document.getElementById("booking-notes").value;

      if (!bookingData.date) {
        alert("Please choose an available appointment date.");
        return;
      }
      if (!bookingData.time) {
        alert("Please pick an available private suite timeslot.");
        return;
      }

      // Populate Success fields
      document.getElementById("success-summary-name").textContent = bookingData.name;
      document.getElementById("success-summary-service").textContent = bookingData.service;
      document.getElementById("success-summary-date").textContent = bookingData.date;
      document.getElementById("success-summary-time").textContent = bookingData.time;

      // Transition to Success Screen
      step2Panel.style.display = "none";
      successPanel.style.display = "block";
    });
  }

  // Reset modal when closing/returning
  const resetBtn = document.getElementById("booking-success-return");
  function resetBookingForm() {
    if (formStep1) formStep1.reset();
    if (formStep2) formStep2.reset();
    timeSlotButtons.forEach(b => b.classList.remove("active"));
    selectedTime = "";

    if (step1Panel) step1Panel.style.display = "block";
    if (step2Panel) step2Panel.style.display = "none";
    if (successPanel) successPanel.style.display = "none";
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetBookingForm();
      // Hide modal via Bootstrap API
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    });
  }

  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", () => {
      resetBookingForm();
    });
  }

  // Handle direct modal booking setup for a selected service card
  const bookTherapyBtns = document.querySelectorAll(".book-therapy-trigger, .service-card, [data-service]");
  bookTherapyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const serviceName = btn.getAttribute("data-service");
      if (serviceName) {
        const serviceSelect = document.getElementById("booking-service");
        if (serviceSelect) {
          serviceSelect.value = serviceName;
        }
      }
    });
  });
}

/* Metric count-up dynamic animation when scrolled into view */
function initStatCounters() {
  const statElements = document.querySelectorAll(".stat-counter-animate");
  if (!statElements.length) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseFloat(el.getAttribute("data-target"));
        const suffix = el.getAttribute("data-suffix") || "";

        let start = 0;
        const duration = 2000; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          // Easing out quadratic
          const easeProgress = progress * (2 - progress);
          const currentValue = start + easeProgress * targetValue;

          if (targetValue % 1 === 0) {
            el.textContent = Math.floor(currentValue).toLocaleString() + suffix;
          } else {
            el.textContent = currentValue.toFixed(1) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (targetValue % 1 === 0) {
              el.textContent = targetValue.toLocaleString() + suffix;
            } else {
              el.textContent = targetValue.toFixed(1) + suffix;
            }
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  statElements.forEach(el => observer.observe(el));
}

/* Premium Luxury Before/After Gallery with Drag and Marquee */
function initLuxuryGallery() {
  const track = document.getElementById('ba-drag-track');
  if (!track) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let isHovered = false;
  let animationFrameId;

  // Auto scroll logic
  const autoScrollSpeed = 1; // Pixels per frame
  let currentScroll = 0; // Use a float to accumulate scroll precisely

  // Initialize currentScroll slightly after layout
  setTimeout(() => {
    currentScroll = track.scrollLeft;
  }, 100);

  function scrollMarquee() {
    if (!isDown && !isHovered) {
      currentScroll += autoScrollSpeed;
      // Infinite loop check: if scrolled past halfway, reset
      if (currentScroll >= track.scrollWidth / 2) {
        currentScroll -= track.scrollWidth / 2;
      }
      track.scrollLeft = currentScroll;
    } else {
      // Sync our float accumulator if user dragged it
      currentScroll = track.scrollLeft;
    }
    animationFrameId = requestAnimationFrame(scrollMarquee);
  }

  // Start marquee
  animationFrameId = requestAnimationFrame(scrollMarquee);

  // Mouse events for dragging
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('is-dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    isHovered = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    track.scrollLeft = scrollLeft - walk;
  });

  track.addEventListener('mouseenter', () => {
    isHovered = true;
  });
}

/* Services Page: Interactive Concern Selector */
function initConcernSelector() {
  const items = document.querySelectorAll(".concern-item");
  const contents = document.querySelectorAll(".concern-content");

  if (!items.length || !contents.length) return;

  items.forEach(item => {
    item.addEventListener("click", () => {
      // Remove active from all items and contents
      items.forEach(i => i.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      // Add active to clicked item
      item.classList.add("active");

      // Show corresponding content
      const targetId = item.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}
