import React from 'react'
import { mount } from 'enzyme'
import AnimateOnChange from './'

jest.useFakeTimers()

describe('AnimateOnChange', () => {
  it('should render child value', () => {
    const component = mount(<AnimateOnChange>123</AnimateOnChange>)
    expect(component.text()).toEqual('123')
  })

  it('should render child components', () => {
    const component = mount(
      <AnimateOnChange>
        <div>
          <p />
          <p />
        </div>
      </AnimateOnChange>
    )
    expect(component.find('div').length).toEqual(1)
    expect(component.find('p').length).toEqual(2)
  })

  it('should have a default duration of 200', () => {
    const component = mount(<AnimateOnChange>123</AnimateOnChange>)
    expect(component.get(0).props.durationOut).toEqual(200)
  })

  it('should render the correct transition duration', () => {
    const durationOut = 250
    const component = mount(
      <AnimateOnChange durationOut={durationOut}>123</AnimateOnChange>
    )
    expect(component.get(0).props.durationOut).toEqual(250)
    expect(component.find('span').get(0).props.style.transition).toEqual(
      expect.stringContaining('250ms')
    )
  })

  it('should animate then change content when children changes', () => {
    const durationOut = 10
    const component = mount(
      <AnimateOnChange durationOut={durationOut}>old</AnimateOnChange>
    )
    expect(component.find('span').get(0).props.style.opacity).toEqual(1)
    expect(component.text()).toEqual('old')

    // Update the children to trigger animation
    component.setProps({ children: 'new' })
    component.update()

    // Expect old value while transitioning out
    expect(component.find('span').get(0).props.style.opacity).toEqual(0)
    expect(component.text()).toEqual('old')

    // Test opacity and new value after duration has passed
    jest.runAllTimers()
    component.update()
    expect(component.find('span').get(0).props.style.opacity).toEqual(1)
    expect(component.text()).toEqual('new')
  })

  it('should set named animation on in and out', () => {
    const durationOut = 10
    const component = mount(
      <AnimateOnChange
        animationIn="popIn"
        animationOut="popOut"
        durationOut={durationOut}
      >
        old
      </AnimateOnChange>
    )
    expect(component.find('span').get(0).props.style.animation).toEqual(
      undefined
    )
    expect(component.text()).toEqual('old')

    component.setProps({ children: 'new' })
    component.update()
    expect(component.find('span').get(0).props.style.animation).toEqual(
      expect.stringContaining('pop-out')
    )
    expect(component.text()).toEqual('old')

    jest.runAllTimers()
    component.update()
    expect(component.find('span').get(0).props.style.animation).toEqual(
      expect.stringContaining('pop-in')
    )
    expect(component.text()).toEqual('new')
  })

  it('should accept custom styles', () => {
    const component = mount(
      <AnimateOnChange style={{ background: 'red' }}>123</AnimateOnChange>
    )
    expect(component.find('span').get(0).props.style.background).toEqual('red')
  })
})
