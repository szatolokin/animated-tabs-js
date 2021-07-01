// animated tabs
{
  const ANIMATION = {
    DURATION: 250,
  }

  window.addEventListener('DOMContentLoaded', () => {
    const COMPONENT_CLASS = 'block'

    const components = document.querySelectorAll(`.${COMPONENT_CLASS}`)


    components.forEach(component => {
      const wrapper = component.querySelector(`.${COMPONENT_CLASS}__wrapper`)
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
                  (() => {
                    // создать thumb (dinamic)
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

                    // расчет нач. и кон. состояний
                    const thumbState = {
                      start: {
                        top: activeItem.offsetTop + activeItem.offsetHeight,
                        left: activeItem.offsetLeft,

                        width: activeItem.offsetWidth,
                      },
                      end: {
                        top: clickedItem.offsetTop + clickedItem.offsetHeight,
                        left: clickedItem.offsetLeft,

                        width: clickedItem.offsetWidth,
                      },

                      now: null,
                    }

                    function updateThumbState(progressValue) {
                      thumbState.now.top = thumbState.start.top + (
                        thumbState.end.top - thumbState.start.top
                      ) * progressValue

                      thumbState.now.left = thumbState.start.left + (
                        thumbState.end.left - thumbState.start.left
                      ) * progressValue

                      thumbState.now.width = thumbState.start.width + (
                        thumbState.end.width - thumbState.start.width
                      ) * progressValue
                    }

                    thumbState.now = Object.assign({}, thumbState.start)

                    // нач. позиция
                    function updateThumb() {
                      const thumbStyleTransform = [
                        `translate(${thumbState.now.left}px, ${thumbState.now.top}px) `,
                        `scaleX(${thumbState.now.width}) `,
                      ].join('')

                      thumb.style.transform = thumbStyleTransform
                    }

                    function removeThumb() {
                      thumb.remove()
                    }

                    updateThumb()

                    list.append(thumb)

                    // анимация
                    const animationState = {
                      timestamp: {
                        start: performance.now(),
                        current: null,
                      },

                      progress: {
                        time: null,
                        value: null,
                      },

                      isEnd: false,
                    }

                    function updateAnimationState() {
                      animationState.timestamp.current = performance.now()

                      animationState.progress.time = Math.abs(
                        animationState.timestamp.start - animationState.timestamp.current
                      )
                      animationState.progress.value = animationState.progress.time / ANIMATION.DURATION

                      if (animationState.progress.value > 1) {
                        animationState.progress.time = ANIMATION.DURATION
                        animationState.progress.value = 1

                        animationState.isEnd = true
                      }
                    }

                    function animationFrame() {
                      updateAnimationState()

                      updateThumbState(animationState.progress.value)

                      updateThumb()

                      if (animationState.isEnd) {
                        animationEnd()
                      } else {
                        requestAnimationFrame(animationFrame)
                      }
                    }

                    requestAnimationFrame(animationFrame)

                    function animationEnd() {
                      removeThumb()

                      attachThumb(activeItem)

                      isAnimation = false
                    }
                  })()
                } else {
                  (() => {
                    // создать thumb (dinamic)
                    const thumbActive = document.createElement('div')
                    const thumbClicked = document.createElement('div')

                    const thumbCssText = `
                      position: absolute;
                      z-index: -1;
                      bottom: 100%;
                      left: 0;
                      transform-origin: left bottom;

                      width: 1px;
                    `

                    thumbActive.style.cssText = thumbCssText
                    thumbClicked.style.cssText = thumbCssText

                    thumbActive.classList.add(`${COMPONENT_CLASS}__thumb`)
                    thumbClicked.classList.add(`${COMPONENT_CLASS}__thumb`)

                    // расчет нач. и кон. состояний
                    // list width (wrapper element because list have negative margin)
                    const wrapperWidth = wrapper.offsetWidth

                    // thumb direction
                    const thumbDirection = (clickedItem.offsetTop < activeItem.offsetTop) ? 'left' : 'right'
                    // const thumbDirection = 'right'

                    // thumb distance
                    const activeDistance = (thumbDirection === 'left') ? (
                      activeItem.offsetLeft
                    ) : (
                      wrapperWidth - activeItem.offsetLeft
                    )
                    const clickedDistance = (thumbDirection === 'left') ? (
                      wrapperWidth - clickedItem.offsetLeft
                    ) : (
                      clickedItem.offsetLeft
                    )
                    const thumbDistance = activeDistance + clickedDistance

                    // thumbs state
                    const thumbState = (thumbDirection === 'left') ? {
                      start: {
                        active: {
                          top: activeItem.offsetTop + activeItem.offsetHeight,
                          left: activeItem.offsetLeft,

                          width: activeItem.offsetWidth,
                        },
                        clicked: {
                          top: clickedItem.offsetTop + clickedItem.offsetHeight,
                          left: clickedItem.offsetLeft + thumbDistance,

                          width: activeItem.offsetWidth,
                        },
                      },
                      end: {
                        active: {
                          top: activeItem.offsetTop + activeItem.offsetHeight,
                          left: activeItem.offsetLeft - thumbDistance,

                          width: clickedItem.offsetWidth,
                        },
                        clicked: {
                          top: clickedItem.offsetTop + clickedItem.offsetHeight,
                          left: clickedItem.offsetLeft,

                          width: clickedItem.offsetWidth,
                        },
                      },

                      now: {
                        active: null,
                        clicked: null,
                      },
                    } : {
                      start: {
                        active: {
                          top: activeItem.offsetTop + activeItem.offsetHeight,
                          left: activeItem.offsetLeft,

                          width: activeItem.offsetWidth,
                        },
                        clicked: {
                          top: clickedItem.offsetTop + clickedItem.offsetHeight,
                          left: clickedItem.offsetLeft - thumbDistance,

                          width: activeItem.offsetWidth,
                        },
                      },
                      end: {
                        active: {
                          top: activeItem.offsetTop + activeItem.offsetHeight,
                          left: activeItem.offsetLeft + thumbDistance,

                          width: clickedItem.offsetWidth,
                        },
                        clicked: {
                          top: clickedItem.offsetTop + clickedItem.offsetHeight,
                          left: clickedItem.offsetLeft,

                          width: clickedItem.offsetWidth,
                        },
                      },

                      now: {
                        active: null,
                        clicked: null,
                      },
                    }

                    function updateThumbActiveState(progressValue) {
                      thumbState.now.active.left = thumbState.start.active.left + (
                        thumbState.end.active.left - thumbState.start.active.left
                      ) * progressValue

                      thumbState.now.active.width = thumbState.start.active.width + (
                        thumbState.end.active.width - thumbState.start.active.width
                      ) * progressValue
                    }
                    function updateThumbClickedState(progressValue) {
                      thumbState.now.clicked.left = thumbState.start.clicked.left + (
                        thumbState.end.clicked.left - thumbState.start.clicked.left
                      ) * progressValue

                      thumbState.now.clicked.width = thumbState.start.clicked.width + (
                        thumbState.end.clicked.width - thumbState.start.clicked.width
                      ) * progressValue
                    }
                    function updateThumbsState(progressValue) {
                      updateThumbActiveState(progressValue)
                      updateThumbClickedState(progressValue)
                    }

                    thumbState.now.active = Object.assign({}, thumbState.start.active)
                    thumbState.now.clicked = Object.assign({}, thumbState.start.clicked)

                    // нач. позиция
                    function updateThumbActive() {
                      const thumbStyleTransform = [
                        `translate(${thumbState.now.active.left}px, ${thumbState.now.active.top}px) `,
                        `scaleX(${thumbState.now.active.width}) `,
                      ].join('')

                      thumbActive.style.transform = thumbStyleTransform
                    }
                    function updateThumbClicked() {
                      const thumbStyleTransform = [
                        `translate(${thumbState.now.clicked.left}px, ${thumbState.now.clicked.top}px) `,
                        `scaleX(${thumbState.now.clicked.width}) `,
                      ].join('')

                      thumbClicked.style.transform = thumbStyleTransform
                    }
                    function updateThumbs() {
                      updateThumbActive()
                      updateThumbClicked()
                    }

                    function removeThumbs() {
                      thumbActive.remove()
                      thumbClicked.remove()
                    }

                    updateThumbs()

                    list.append(thumbActive)
                    list.append(thumbClicked)

                    // анимация
                    const animationState = {
                      timestamp: {
                        start: performance.now(),
                        current: null,
                      },

                      progress: {
                        time: null,
                        value: null,
                      },

                      isEnd: false,
                    }

                    function updateAnimationState() {
                      animationState.timestamp.current = performance.now()

                      animationState.progress.time = Math.abs(
                        animationState.timestamp.start - animationState.timestamp.current
                      )
                      animationState.progress.value = animationState.progress.time / ANIMATION.DURATION

                      if (animationState.progress.value > 1) {
                        animationState.progress.time = ANIMATION.DURATION
                        animationState.progress.value = 1

                        animationState.isEnd = true
                      }
                    }

                    function animationFrame() {
                      updateAnimationState()

                      updateThumbsState(animationState.progress.value)

                      updateThumbs()

                      if (animationState.isEnd) {
                        animationEnd()
                      } else {
                        requestAnimationFrame(animationFrame)
                      }
                    }

                    requestAnimationFrame(animationFrame)

                    function animationEnd() {
                      removeThumbs()

                      attachThumb(activeItem)

                      isAnimation = false
                    }
                  })()
                }
              }

              // swap active
              {
                swapItem(activeItem, clickedItem)

                activeItem.classList.remove(`${COMPONENT_CLASS}__item--active`)

                clickedItem.classList.add(`${COMPONENT_CLASS}__item--active`)

                activeItem = clickedItem
              }
            }
          }
        }
      })
    })

    function onEqualLine(item1, item2) {
      const offsetTop1 = item1.offsetTop
      const offsetTop2 = item2.offsetTop

      const offsetTopDiff = Math.abs(offsetTop1 - offsetTop2)

      return offsetTopDiff < 1
    }
  })

  // prevItem - предыдущий активный item (dom element)
  // nextItem - текущий активный (выбранный, кликнутый) item
  function swapItem(prevItem, nextItem) {
    // console.log(prevItem, nextItem)

    // * здесь код для смены tab'ов *
  }
}
