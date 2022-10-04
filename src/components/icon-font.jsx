import { ReactComponent as IconMeeting } from './icon-meeting.svg';
import { ReactComponent as IconHeadset } from './icon-headset.svg';
import React from 'react';
import Icon from '@ant-design/icons';

const iconMap = {
    'icon-meeting': IconMeeting,
    'icon-headset': IconHeadset
}

export const IconFont = (props) => {
    const { type, style } = props;
    const component = iconMap[type];
    return component ? <Icon component={component} style={{ ...(style || {}) }} /> : null;
  };