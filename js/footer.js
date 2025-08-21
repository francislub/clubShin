// Modern Footer JavaScript Functionality
class ModernFooter {
    constructor() {
      this.init()
    }
  
    init() {
      this.setupBackToTop()
      this.setupNewsletterForm()
      this.setupTooltips()
      this.setupCurrentYear()
      this.setupScrollAnimations()
    }
  
    setupBackToTop() {
      const backToTopBtn = document.getElementById("backToTop")
      if (!backToTopBtn) return
  
      // Show/hide back to top button based on scroll position
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add("show")
        } else {
          backToTopBtn.classList.remove("show")
        }
      })
  
      // Smooth scroll to top
      window.scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    }
  
    setupNewsletterForm() {
      const newsletterForm = document.getElementById("newsletterForm")
      if (!newsletterForm) return
  
      newsletterForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const email = e.target.querySelector('input[type="email"]').value
  
        try {
          // Show loading state
          const submitBtn = e.target.querySelector('button[type="submit"]')
          const originalText = submitBtn.innerHTML
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Subscribing...'
          submitBtn.disabled = true
  
          // Simulate API call (replace with actual endpoint)
          await new Promise((resolve) => setTimeout(resolve, 1500))
  
          // Show success message
          this.showNotification("Successfully subscribed to newsletter!", "success")
          e.target.reset()
  
          // Reset button
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
        } catch (error) {
          console.error("Newsletter subscription error:", error)
          this.showNotification("Failed to subscribe. Please try again.", "error")
  
          // Reset button
          const submitBtn = e.target.querySelector('button[type="submit"]')
          submitBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Subscribe'
          submitBtn.disabled = false
        }
      })
    }
  
    setupTooltips() {
      // Initialize Bootstrap tooltips if available
      const bootstrap = window.bootstrap
      if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
      }
    }
  
    setupCurrentYear() {
      const yearElement = document.getElementById("currentYear")
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear()
      }
    }
  
    setupScrollAnimations() {
      // Animate footer elements on scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }
        })
      }, observerOptions)
  
      // Observe footer sections
      document
        .querySelectorAll(".footer-section .col-lg-3, .footer-section .col-lg-2, .quick-access-card")
        .forEach((el) => {
          el.style.opacity = "0"
          el.style.transform = "translateY(20px)"
          el.style.transition = "all 0.6s ease"
          observer.observe(el)
        })
    }
  
    showNotification(message, type = "info") {
      // Create notification element
      const notification = document.createElement("div")
      notification.className = `alert alert-${type === "error" ? "danger" : "success"} position-fixed`
      notification.style.cssText = `
              top: 20px;
              right: 20px;
              z-index: 9999;
              min-width: 300px;
              opacity: 0;
              transform: translateX(100%);
              transition: all 0.3s ease;
          `
      notification.innerHTML = `
              <div class="d-flex align-items-center">
                  <i class="fas fa-${type === "error" ? "exclamation-circle" : "check-circle"} me-2"></i>
                  ${message}
                  <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
              </div>
          `
  
      document.body.appendChild(notification)
  
      // Animate in
      setTimeout(() => {
        notification.style.opacity = "1"
        notification.style.transform = "translateX(0)"
      }, 100)
  
      // Auto remove after 5 seconds
      setTimeout(() => {
        notification.style.opacity = "0"
        notification.style.transform = "translateX(100%)"
        setTimeout(() => notification.remove(), 300)
      }, 5000)
    }
  }
  
  // Initialize footer when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    new ModernFooter()
  })
  
  // Export for use in other files
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ModernFooter
  }
  