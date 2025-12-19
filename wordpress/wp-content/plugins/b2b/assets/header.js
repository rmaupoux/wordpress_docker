const header = document.querySelector('header')

if(header) {
  const topHeight = header.querySelector('.has-bot-separator').getBoundingClientRect().height;
  const adminBar = document.getElementById('wpadminbar')?.getBoundingClientRect().height || 0;
  const scrollThreshold = topHeight + adminBar;
  const fixedMenuBar = header.querySelector('.wp-block-menu-fixed-menu')
  const fixedBarHeight = fixedMenuBar.getBoundingClientRect().height;
  const sharedNavLinks = header.querySelector('.shared-dropdown-links');
  const langSwap = header.querySelector('.lang-swap');
  const menuItems = fixedMenuBar.querySelectorAll('.wp-block-navigation-item__label');
  let isSingleLine = true;
  
  let windowWidth = window.innerWidth
  //  resizeTimer = undefined;

  header.style.marginBottom = `${fixedBarHeight}px`

  // UTIL FUNCTIONS TO IMPROVE SCROLL EVENT LISTENER
  const debounce = (fn, delay) => {
    let timer;

    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  const handleScroll = () => {

      if(window.scrollY >= scrollThreshold) {
        header.classList.add('is-fixed');
      } else {
        header.classList.remove('is-fixed');
        
        if(menuItems) checkSingleLine(menuItems);
      }
  }

  window.addEventListener('scroll', debounce(handleScroll, 10));

  // BACK TO TOP
  const backTop = header.querySelectorAll('.back-to-top')
  backTop.forEach(el => el.addEventListener('click', () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }));

  // ADD PADDING TO MOBILE SUBMENU & OPENED BURGER NAV
  const adaptPadding = (origin, target, extra, dir) => {
    if(!origin || !target) return;

    const validDirs = ['left', 'right', 'top', 'bottom'];
    if (!validDirs.includes(dir)) dir = 'bottom';

    const styleKey = `padding${dir.charAt(0).toUpperCase()}${dir.slice(1)}`;

    const extraPadding = isNaN(extra) ? 0 : extra

    if(window.innerWidth < 1200) {      
      const originHeight = origin.getBoundingClientRect().height;
      
      target.style[styleKey] = `${originHeight + extraPadding}px`;    
    } else {
      target.style[styleKey] = ''
    }

    return;
  }

  // BURGER NAV
  const navToggle = header.querySelectorAll('.burger-nav');
  navToggle.forEach(toggle => {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      header.classList.toggle('burger-open');

      // Adapt padding from the nav wrapper to allow the shared-dropdown-links absolute positioning
      if(sharedNavLinks && fixedMenuBar) {
        if(document.body.classList.contains('nav-open')) adaptPadding(sharedNavLinks, fixedMenuBar, 40);
        else fixedMenuBar.style.paddingBottom = ''
      }
    })
  });

  window.onload = () => {
    const subMenu = header.querySelector('.internal-menu .has-child ul.wp-block-navigation-submenu'), subMenuBackdrop = subMenu?.closest('nav.internal-menu')

    if(subMenu && subMenuBackdrop) {
      requestAnimationFrame(() => {
        setTimeout(() => adaptPadding(subMenu, subMenuBackdrop), 50);
      });
    }

    // EMULATE DROPDOWN FOR TOP LEVEL MOBILE MENU
    const dropdownController = header.querySelector('.top-dropdown-item')

    const adaptDropdownWidth = () => {
      const topMenu = dropdownController ? header.querySelector('nav.top-menu') || header.querySelector('nav.wp-block-navigation') : header.querySelector('nav.internal-menu')
      const dropdownControl = dropdownController ? dropdownController : topMenu?.querySelector('.wp-block-navigation-submenu__toggle')

      if(!topMenu || !dropdownControl) return;

      if(window.innerWidth < 1200) {
        const dropdownItems = topMenu.querySelectorAll('.wp-block-navigation-item')

        // if the [lang_switcher] shortcode is added, clone it at the end of the burger nav
        if(langSwap) {
          const langSwapClone = langSwap.cloneNode(true);
          fixedMenuBar.appendChild(langSwapClone);
        }

        topMenu.style.setProperty('display', 'flex', 'important');
        dropdownItems.forEach(el => {
          el.style.display = 'block';
          el.style.position = 'static';
        });
        const originWidth = topMenu.getBoundingClientRect().width;

        dropdownItems.forEach(el => {
          el.style.display = '';
          el.style.position = '';
        });
        topMenu.style.display = '';
        
        dropdownControl.style.minWidth = `${originWidth}px`;
        
        const dropdownControlWidth = dropdownControl.getBoundingClientRect().width
        if(dropdownControlWidth > originWidth) {
          topMenu.style.minWidth = `${dropdownControlWidth}px`
        }
      
      } else {
        dropdownControl.style.width= '';
        topMenu.style.minWidth = '';
        dropdownControl.style.minWidth = '';

        // Remove the cloned lang swap element on desktop
        if(langSwap) {
          const insertedLangSwapClone = fixedMenuBar.querySelector('.lang-swap')
          insertedLangSwapClone?.remove();
        }
      }
    }
    adaptDropdownWidth();

    if(dropdownController) {
      const menuWrapper = dropdownController.parentElement
      menuWrapper.classList.add('is-top-level-menu');

      dropdownController.addEventListener('click', () => {
        menuWrapper.classList.toggle('active-dropdown');
      });
    }

    // OVERALL RESIZE UPDATE CONTROLLER
    window.addEventListener('resize', () => {
      if(window.innerWidth !== windowWidth){
        const breakPoint = (windowWidth < 1200 && window.innerWidth >= 1200) || (windowWidth > 1200 && window.innerWidth <= 1200)
        windowWidth = window.innerWidth;

        if(window.innerWidth >= 1200) {
          document.body.classList.remove('nav-open');
          header.classList.remove('burger-open');

          if(menuItems) checkSingleLine(menuItems);
        }
        
        if(breakPoint) {
          adaptDropdownWidth();
        }       

        if(subMenu && subMenuBackdrop) adaptPadding(subMenu, subMenuBackdrop);
        if(document.body.classList.contains('nav-open') && sharedNavLinks && fixedMenuBar) adaptPadding(sharedNavLinks, fixedMenuBar);

        // clearTimeout(resizeTimer);
        // resizeTimer = setTimeout(() => {            

        // }, 200);   
      }
    });
  }

  const checkSingleLine = (entries) => {
    const dropdownWrapper = fixedMenuBar.querySelector('ul.wp-block-navigation__container > .has-child .wp-block-navigation-submenu');
    const dropdownToggle = fixedMenuBar.querySelector('ul.wp-block-navigation__container > .has-child');

    isSingleLine = true;
    fixedMenuBar.classList.remove('has-dynamic-dropdown'); 

    if(!dropdownWrapper || !dropdownToggle) return

    entries.forEach(entry => {
      const el = entry.target || entry;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const height = el.clientHeight;
      if (height > lineHeight) {
        isSingleLine = false
      }
    });

    
    if(!isSingleLine) {
      fixedMenuBar.classList.add('has-dynamic-dropdown');

      const hiddenItems = fixedMenuBar.querySelectorAll('ul.wp-block-navigation__container > .wp-block-navigation-item:not(.has-child)');
      const allItems = fixedMenuBar.querySelectorAll('.wp-block-navigation-item');

      let itemHeight = 0, maxItemWidth = dropdownToggle.getBoundingClientRect().width

      hiddenItems.forEach(item => {
        itemHeight += item.getBoundingClientRect().height;
      });

      allItems.forEach(item => {
        const itemWidth = item.getBoundingClientRect().width
        maxItemWidth = Math.max(maxItemWidth, itemWidth)
      });
      
      dropdownWrapper.style.paddingTop = `${itemHeight}px`;
      dropdownWrapper.style.minWidth = `${maxItemWidth}px`;
      dropdownToggle.style.minWidth = `${maxItemWidth}px`;
    } else {
      dropdownWrapper.style.paddingTop = '';
      dropdownWrapper.style.minWidth = '';
      dropdownToggle.style.minWidth = '';
    }
  }

  const resizeObserver = new ResizeObserver(entries => {
    checkSingleLine(entries);
  });

  menuItems.forEach(child => resizeObserver.observe(child));
}