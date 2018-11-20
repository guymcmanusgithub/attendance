// member-visit.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import member from '/imports/test/fake-member'

import MemberVisitPinSet from './member-visit-pin-set'

const match = {
  params: {
    id: '12344'
  }
}

const updateMember = () => {
  const options = {
    isHere: boolean('Present', false),
    isSuper: boolean('Is Supervisor', true),
    sessionCount: boolean('Is Newbie', true) ? 1 : 25,
  }
  return Object.assign(member, options)
}

storiesOf('Member.Session', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add('Set PIN', withInfo('PIN Set')(() => {
    const story = (
      <div style={{maxWidth: '280px', textAlign: 'center'}}>
        <MemberVisitPinSet
          loading={boolean('Loading', false)}
          setPin={action('setPin')}
        />
      </div>
    )
    // specs(() =>
    //   describe('<User avatar={avatar} />', () => {
    //     it('displays an User', () => {
    //       const wrapper = mount(story);
    //       expect(wrapper.find('img')).to.have.length(1);
    //       expect(wrapper.find('img').props().src).to.contain(avatar.url);
    //     });
    //   })
    // );
    return story;
  }))

