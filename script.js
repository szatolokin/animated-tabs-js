// animated tabs
window.addEventListener('DOMContentLoaded', () => {
  const COMPONENT_CLASS = 'block'

  const components = document.querySelectorAll(`.${COMPONENT_CLASS}`)


  components.forEach(component => {
    const list = component.querySelector(`.${COMPONENT_CLASS}__list`)
    const items = component.querySelectorAll(`.${COMPONENT_CLASS}__item`)

    let activeItem = component.querySelector(`.${COMPONENT_CLASS}__item--active`)

    let isAnimation = false

    // static thumb
    {
      const thumb = document.createElement('div')

      thumb.style.cssText = `
        position: absolute;
        z-index: -1;
        bottom: 100%;
        left: 0;
        transform-origin: left bottom;

        width: 1px;
      `

      thumb.classList.add(`${COMPONENT_CLASS}__thumb`)

      function attachThumb(item) {
        list.append(thumb)

        updateThumb(item)

        window.addEventListener('resize', handleResize)
      }

      function detachThumb() {
        window.removeEventListener('resize', handleResize)

        thumb.remove()
      }

      function updateThumb(item) {
        // item
        const itemOffsetTop = item.offsetTop
        const itemOffsetLeft = item.offsetLeft

        const itemOffsetWidth = item.offsetWidth
        const itemOffsetHeight = item.offsetHeight

        // thumb
        const thumbTop = itemOffsetTop + itemOffsetHeight
        const thumbLeft = itemOffsetLeft

        const thumbWidth = itemOffsetWidth

        // render style
        const thumbStyleTransform = [
          `translate(${thumbLeft}px, ${thumbTop}px) `,
          `scaleX(${thumbWidth}) `,
        ].join('')

        thumb.style.transform = thumbStyleTransform
      }

      // window resize
      const HANDLE_RESIZE_FPS = 60

      let handleResizeEnabled = true

      function handleResize() {
        if (handleResizeEnabled) {
          handleResizeEnabled = false

          updateThumb(activeItem)

          setTimeout(() => {
            updateThumb(activeItem)

            handleResizeEnabled = true
          }, 1000 / HANDLE_RESIZE_FPS)
        }
      }
    }

    attachThumb(activeItem)

    component.addEventListener('click', event => {
      const clickedItem = event.target.closest(`.${COMPONENT_CLASS}__item`)

      if (clickedItem) {
        if (!isAnimation) {
          if (clickedItem !== activeItem) {
            isAnimation = true

            detachThumb()

            // dinamic thumb
            {
              if (onEqualLine(clickedItem, activeItem)) {

              } else {

              }
            }

            // swap active
            {
              activeItem.classList.remove(`${COMPONENT_CLASS}__item--active`)

              clickedItem.classList.add(`${COMPONENT_CLASS}__item--active`)

              activeItem = clickedItem
            }
          }
        }
      }
    })

    /*

    // test
    // thumb (relative list)
    {
      // создание
      const thumb = document.createElement('div')

      thumb.classList.add(`${COMPONENT_CLASS}__thumb`)

      thumb.style.cssText = `
        position: absolute;
        z-index: -1;
        bottom: 100%;
        left: 0;
        transform-origin: left bottom;

        width: 1px;
      `

      function thumbUpdate() {
        // active item
        const activeItem = component.querySelector(`.${COMPONENT_CLASS}__item--active`)

        const activeItemOffsetTop = activeItem.offsetTop
        const activeItemOffsetLeft = activeItem.offsetLeft

        const activeItemOffsetWidth = activeItem.offsetWidth
        const activeItemOffsetHeight = activeItem.offsetHeight

        // thumb
        const thumbX = activeItemOffsetLeft
        const thumbY = activeItemOffsetTop + activeItemOffsetHeight

        const thumbStyleTransform = [
          `translate(${thumbX}px, ${thumbY}px) `,
          `scaleX(${activeItemOffsetWidth}) `,
        ].join('')

        thumb.style.transform = thumbStyleTransform
      }

      // начальная позиция
      thumbUpdate()

      // добавление в dom
      list.append(thumb)

      // window resize (item relocation)
      {
        const fps = 60

        let enabled = true

        window.addEventListener('resize', update)

        function update() {
          if (enabled) {
            enabled = false

            thumbUpdate()

            setTimeout(() => {
              thumbUpdate()

              enabled = true
            }, 1000 / fps)
          }
        }
      }

      // item click
      component.addEventListener('click', event => {
        const item = event.target.closest(`.${COMPONENT_CLASS}__item`)

        if (item) {
          const activeItem = component.querySelector(`.${COMPONENT_CLASS}__item--active`)

          if (item !== activeItem) {
            console.log(123);
          }
        }
      })
    }

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

    */
  })

  function onEqualLine(item1, item2) {
    const offsetTop1 = item1.offsetTop
    const offsetTop2 = item2.offsetTop

    const offsetTopDiff = Math.abs(offsetTop1 - offsetTop2)

    return offsetTopDiff < 1
  }
})
