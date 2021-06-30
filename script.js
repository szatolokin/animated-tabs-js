// animated tabs
window.addEventListener('DOMContentLoaded', () => {
  const COMPONENT_CLASS = 'block'

  const components = document.querySelectorAll(`.${COMPONENT_CLASS}`)

  components.forEach(component => {
    const items = component.querySelectorAll(`.${COMPONENT_CLASS}__item`)

    // swap active item (item click)
    {
      component.addEventListener('click', event => {
        const item = event.target.closest(`.${COMPONENT_CLASS}__item`)

        if (item) {
          component.querySelector(`.${COMPONENT_CLASS}__item--active`).classList.remove(`${COMPONENT_CLASS}__item--active`)

          item.classList.add(`${COMPONENT_CLASS}__item--active`)
        }
      })
    }
  })

})
