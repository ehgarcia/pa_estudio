class AccordionItem {
  constructor(item, accordionClass) {
    this.accordionItem = item;
    this.accordionClass = accordionClass
    this.btn = item.querySelector('.ss-accordion-btn')
    this.content = item.querySelector('.content')
    this.addEventListeners();
  }

  addEventListeners() {
    if (this.btn) this.btn.addEventListener("click", this.toggle.bind(this));
  }

  toggle() {
    if (!this.btn || !this.content) return;
    
    const allowMultipleOpenItems = this.accordionClass.accordion.hasAttribute('data-ss-accordion-allow-multiple');
    const accordionIsOpen = this.btn.classList.contains('active')

    if (!allowMultipleOpenItems) {
      this.accordionClass.closeAllExcept(this.btn, this.content)
    }

    if (accordionIsOpen) {
      this.close(this.btn, this.content)
    } else {
      this.open(this.btn, this.content)
    }

  }

  open() {
    if (!this.btn || !this.content) return;
    
    this.btn.classList.add('active');
    this.content.style.height = this.content.scrollHeight + "px";
    const animationDuration = 350

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.content.style.height = "auto"
        if (parent?.Vvveb?.dndHelper?.repositionSelectedBox) parent?.Vvveb?.dndHelper?.repositionSelectedBox()
      }, animationDuration)
    })
  }

  close() {
    if (!this.btn || !this.content) return;

    this.content.style.height = this.content.scrollHeight + "px";

    requestAnimationFrame(() => {
      this.btn.classList.remove('active');
      this.content.style.height = "0px";
      if (parent?.Vvveb?.dndHelper?.repositionSelectedBox) parent?.Vvveb?.dndHelper?.repositionSelectedBox()
    })
  }
}

class Accordion {
  constructor(accordion) {
    this.accordion = accordion;
    this.instances = []
    this.items = Array.from(accordion.childNodes).map(accordionItem => {
      if (accordionItem?.classList?.contains('ss-accordion-tab')) new AccordionItem(accordionItem, this)})
  }

  closeAllExcept(currentBtn, currentContent) {
    const buttons = this.accordion.querySelectorAll('.ss-accordion-tab .ss-accordion-btn')
    const contents = this.accordion.querySelectorAll('.ss-accordion-tab .content')

    buttons.forEach(btn => {
      if (btn !== currentBtn) btn.classList.remove('active');
    });

    contents.forEach(content => {
      if (content !== currentContent) {
        content.style.height = content.scrollHeight + "px";
        requestAnimationFrame(() => {
          content.style.height = "0px";
        })
      }
    });
  }

  static initAll() {
    const accordionContainers = document.querySelectorAll(".ss-accordion");
    this.instances = Array.from(accordionContainers).map(container => new Accordion(container));
  }

  static addAccordionItem(node) {
    const accordion = node.parentElement
    const accordionElId = accordion.dataset.ssId
    const accordionClassInstance = this.instances.find(({accordion}) => accordion.dataset.ssId === accordionElId)
    accordionClassInstance.items.push(new AccordionItem(node, accordionClassInstance))
  }
}

Accordion.initAll()