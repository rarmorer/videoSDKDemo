import { ReactComponent as IconMeeting } from './icon-meeting.svg';
import React from 'react';
import Icon from '@ant-design/icons';

const iconMap = {
    'icon-meeting': IconMeeting
}

export const IconFont = (props) => {
    const { type, style } = props;
    const component = iconMap[type];
    return component ? <Icon component={component} style={{ ...(style || {}) }} /> : null;
  };